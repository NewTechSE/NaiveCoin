import { computed, flow, makeAutoObservable, observable } from 'mobx';
import { IWalletModel } from '../models/wallet-model';
import { ec as EC } from 'elliptic';
import { ApiService } from '../services/api-service';
import {
  calculateTransactionHash,
  calculateTransactionSignature,
  ITransactionModel,
} from '../models/transaction-model';

export class WalletStore {
  apiService: ApiService;

  ec = new EC('secp256k1');
  keyPair: EC.KeyPair;

  @observable
  wallet: IWalletModel;

  @observable
  isLoadingWallet: boolean = false;

  @observable
  isLoadingPendingTransactions: boolean = false;

  @computed
  get balance(): number {
    let balance = 0;
    this.wallet.transactions.forEach(tx => {
      if (tx.fromAddress === this.keyPair.getPublic('hex')) {
        balance -= tx.amount!;
      }
      if (tx.toAddress === this.keyPair.getPublic('hex')) {
        balance += tx.amount!;
      }
    });

    return balance;
  }

  @computed
  get myPendingTransactions() {
    return this.wallet.pendingTransactions.filter(
      tx => tx.fromAddress === this.keyPair.getPublic('hex') || tx.toAddress === this.keyPair.getPublic('hex'),
    );
  }

  constructor(apiService: ApiService) {
    makeAutoObservable(this);

    this.apiService = apiService;

    const privateKey = localStorage.getItem('privateKey');
    if (privateKey) {
      this.keyPair = this.ec.keyFromPrivate(privateKey, 'hex');
    } else {
      this.keyPair = this.ec.genKeyPair();
      localStorage.setItem('privateKey', this.keyPair.getPrivate('hex'));
    }

    this.wallet = {
      privateKey: this.keyPair.getPrivate('hex'),
      publicKey: this.keyPair.getPublic('hex'),
      transactions: [],
      pendingTransactions: [],
    };
  }

  @flow
  *fetchTransactions() {
    this.isLoadingWallet = true;
    this.wallet.transactions = yield this.apiService.getTransactions(this.keyPair.getPublic('hex'));

    setTimeout(() => {
      this.isLoadingWallet = false;
    }, 500);
  }

  @flow
  *fetchPendingTransactions() {
    this.isLoadingPendingTransactions = true;
    this.wallet.pendingTransactions = yield this.apiService.getPendingTransactions();

    setTimeout(() => {
      this.isLoadingPendingTransactions = false;
    }, 500);
  }

  async createTransaction(transaction: ITransactionModel) {
    if (this.wallet.publicKey && this.wallet.publicKey !== transaction.fromAddress) {
      throw new Error('You can only sign transactions from your own wallet');
    }

    const hash = calculateTransactionHash(transaction);
    const signature = calculateTransactionSignature(this.keyPair, hash);
    transaction.signature = signature;

    const tx: ITransactionModel = await this.apiService.createTransaction(transaction);
    return tx;
  }
}
