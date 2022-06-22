export interface ITransactionModel {
  fromAddress?: string;
  toAddress?: string;
  amount?: number;
  timestamp?: number;
  signature?: string;
}
