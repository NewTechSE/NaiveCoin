import { ITransactionModel } from './transaction-model';

export interface IBlockModel {
  id?: number;
  hash?: string;
  previousHash?: string;
  timestamp?: number;
  nonce?: number;
  transactions: ITransactionModel[];
}
