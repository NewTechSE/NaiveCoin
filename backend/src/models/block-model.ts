import { TransactionModel } from './transaction-model';
import crypto from 'crypto';
import { autoImplement } from '@/utils/util';

export class BlockModel extends autoImplement<BlockShape>() {
  //   id: number;
  //   hash: string;
  //   previousHash: string;
  //   timestamp: number;
  //   nonce: number;
  //   transactions: TransactionModel[] = [];

  static tableName = 'blocks'; // database table name
  static idColumn = 'id'; // id column name

  constructor(blockShape: BlockShape) {
    super();
    this.id = blockShape.id;
    this.previousHash = blockShape.previousHash;
    this.timestamp = blockShape.timestamp;
    this.nonce = blockShape.nonce;
    this.transactions = blockShape.transactions;
    this.hash = this.calculateHash();
  }

  calculateHash(): string {
    return crypto
      .createHash('sha256')
      .update(this.previousHash + JSON.stringify(this.transactions) + this.timestamp + this.nonce)
      .digest('hex');
  }

  allValidTransactions(): boolean {
    return this.transactions.every(transaction => transaction.isValid());
  }
}

export type BlockShape = {
  id?: number;
  hash?: string;
  previousHash?: string;
  timestamp?: number;
  nonce?: number;
  transactions?: TransactionModel[];
};
