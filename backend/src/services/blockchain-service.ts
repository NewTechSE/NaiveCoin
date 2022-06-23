import { HttpException } from '@/exceptions/HttpException';
import { TransactionModel } from '@/models/transaction-model';
import { BlockModel } from '@models/block-model';
import { ec as EC } from 'elliptic';

const ec = new EC('secp256k1');

export class BlockchainService {
  miningReward = 100;
  difficulty = 2;
  key: EC.KeyPair;

  blockchain: BlockModel[];
  transactionPool: TransactionModel[];

  constructor() {
    this.key = ec.genKeyPair();

    this.blockchain = [this.createGenesisBlock()];
    this.transactionPool = [this.createGenesisTransaction()];
  }

  createGenesisBlock() {
    return new BlockModel({
      id: 0,
      hash: '',
      previousHash: '',
      timestamp: 0,
      nonce: 0,
      transactions: [],
    });
  }

  createGenesisTransaction() {
    const tx = new TransactionModel({
      fromAddress: this.key.getPublic('hex'),
      toAddress: this.key.getPublic('hex'),
      amount: 4294967296,
    });

    tx.signTransaction(this.key);

    return tx;
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

    if (!transaction.amount && transaction.amount <= 0) {
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
      fromAddress: this.key.getPublic('hex'),
      toAddress: miningRewardAddress,
      amount: this.miningReward,
      id: 0,
      timestamp: Date.now(),
      signature: '',
    });
    rewardTx.signTransaction(this.key);
    this.transactionPool.push(rewardTx);

    const block = new BlockModel({
      id: this.blockchain.length,
      previousHash: this.getLatestBlock().hash,
      timestamp: Date.now(),
      nonce: 0,
      transactions: this.transactionPool,
    });

    this.mineBlock(block);

    this.blockchain.push(block);

    this.transactionPool = [];

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
