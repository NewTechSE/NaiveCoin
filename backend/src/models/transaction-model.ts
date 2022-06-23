import crypto from 'crypto';
import { ec as EC } from 'elliptic';
import { autoImplement } from '@/utils/util';
import { HttpException } from '@/exceptions/HttpException';

const ec = new EC('secp256k1');

export interface TransactionShape {
  id?: number;
  fromAddress?: string;
  toAddress?: string;
  amount?: number;
  timestamp?: number;
  signature?: string;
}

export class TransactionModel extends autoImplement<TransactionShape>() {
  //   id: number;
  //   fromAddress: string;
  //   toAddress: string;
  //   amount: number;
  //   timestamp: number;
  //   signature: string;

  static tableName = 'transactions'; // database table name
  static idColumn = 'id'; // id column name

  constructor(transactionShape: TransactionShape) {
    super();
    this.id = transactionShape.id;
    this.fromAddress = transactionShape.fromAddress;
    this.toAddress = transactionShape.toAddress;
    this.amount = transactionShape.amount;
    this.timestamp = transactionShape.timestamp;
    this.signature = transactionShape.signature;
  }

  calculateHash(): string {
    return crypto
      .createHash('sha256')
      .update(this.fromAddress + this.toAddress + this.amount + this.timestamp)
      .digest('hex');
  }

  isValid(): boolean {
    if (!this.fromAddress || this.fromAddress === '') {
      return false;
    }

    if (!this.toAddress || this.toAddress === '') {
      return false;
    }

    if (!this.amount) {
      return false;
    }

    if (!this.signature || this.signature === '') {
      return false;
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
    return publicKey.verify(this.calculateHash(), this.signature);
  }

  signTransaction(key: EC.KeyPair): void {
    if (key.getPublic('hex') !== this.fromAddress) {
      throw new HttpException(400, 'You cannot sign transactions for other wallets');
    }

    const hash = this.calculateHash();
    const signature = key.sign(hash, 'hex');

    this.signature = signature.toDER('hex');
  }
}
