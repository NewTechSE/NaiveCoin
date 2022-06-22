import { ITransactionModel } from './transaction-model';

export interface IWalletModel {
  privateKey?: string;
  publicKey?: string;
  transactions: ITransactionModel[];
  pendingTransactions: ITransactionModel[];
}
