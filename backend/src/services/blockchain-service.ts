import { HttpException } from '@/exceptions/HttpException';
import { TransactionModel } from '@/models/transaction-model';
import { BlockModel } from '@models/block-model';

export class BlockchainService {
  miningReward = 100;
  difficulty = 2;

  blockchain: BlockModel[] = [this.createGenesisBlock()];
  transactionPool: TransactionModel[] = [];

  createGenesisBlock() {
    const firstTx = new TransactionModel({
      fromAddress: 'System',
      toAddress: 'System',
      amount: 100,
    });

    return new BlockModel({
      id: 0,
      hash: '',
      previousHash: '',
      timestamp: 0,
      nonce: 0,
      transactions: [firstTx],
    });
  }

  getBalanceFromAddress(address: string): number {
    let balance = 0;
    this.blockchain.forEach(block => {
      block.transactions.forEach(transaction => {
        if (transaction.fromAddress === address) {
          balance -= transaction.amount;
        }

        if (transaction.toAddress === address) {
          balance += transaction.amount;
        }
      });
    });

    return balance;
  }

  async addTransactionToPoolAsync(transaction: TransactionModel) {
    if (!transaction.isValid()) {
      throw new HttpException(400, 'Transaction is not valid');
    }

    if (transaction.amount <= 0) {
      throw new HttpException(400, 'Transaction amount must be greater than 0');
    }

    const walletBalance = this.getBalanceFromAddress(transaction.fromAddress);
    if (walletBalance < transaction.amount) {
      throw new HttpException(400, 'Not enough balance');
    }

    const pendingTxOfWallet = this.transactionPool.filter(tx => tx.fromAddress === transaction.fromAddress);
    if (pendingTxOfWallet.length > 0) {
      const totalPendingAmount = pendingTxOfWallet.reduce((acc, tx) => acc + tx.amount, 0);

      const totalAmount = totalPendingAmount + transaction.amount;
      if (totalAmount > walletBalance) {
        throw new HttpException(400, 'Pending transactions for this wallet is higher than its balance');
      }
    }

    this.transactionPool.push(transaction);
    return transaction;
  }

  getLatestBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }

  async minePendingTransactionsAsync(miningRewardAddress: string) {
    if (this.transactionPool.length === 0) {
      throw new HttpException(404, 'Transaction pool is empty');
    }

    const rewardTx = new TransactionModel({
      fromAddress: '',
      toAddress: miningRewardAddress,
      amount: this.miningReward,
      id: 0,
      timestamp: Date.now(),
      signature: '',
    });
    this.transactionPool.push(rewardTx);

    const block = new BlockModel({
      previousHash: this.getLatestBlock().hash,
      timestamp: Date.now(),
      nonce: 0,
      transactions: this.transactionPool,
    });

    this.mineBlock(block);

    this.blockchain.push(block);

    return block;
  }

  mineBlock(block: BlockModel) {
    while (block.hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join('0')) {
      block.nonce++;
      block.hash = block.calculateHash();
    }
  }

  getTransactionsFromAddress(address: string): TransactionModel[] {
    const transactions = [];
    this.blockchain.forEach(block => {
      const trans = block.transactions.filter(tx => tx.fromAddress === address || tx.toAddress === address);

      transactions.push(...trans);
    });

    return transactions;
  }
}
