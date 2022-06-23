import { ec as EC } from 'elliptic';
import { SHA256, enc } from 'crypto-js';
export interface ITransactionModel {
  fromAddress?: string;
  toAddress?: string;
  amount?: number;
  timestamp?: number;
  signature?: string;
}

export function calculateTransactionHash(transaction: ITransactionModel): string {
  return SHA256(
    `${transaction.fromAddress}${transaction.toAddress}${transaction.amount}${transaction.timestamp}`,
  ).toString(enc.Hex);
}

export function calculateTransactionSignature(key: EC.KeyPair, transactionHash: string) {
  return key.sign(transactionHash, 'hex').toDER('hex');
}
