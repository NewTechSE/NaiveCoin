import { BlockShape } from '@/models/block-model';
import { TransactionModel, TransactionShape } from '@/models/transaction-model';
import { BlockchainService } from '@/services/blockchain-service';
import { NextFunction, Request, Response } from 'express';

export class BlockchainController {
  public blockchainService = new BlockchainService();

  public getBlocks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blocks: BlockShape[] = this.blockchainService.blockchain;

      res.status(200).json({ data: { blocks }, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getPendingTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pendingTransactions: TransactionShape[] = this.blockchainService.transactionPool;

      res.status(200).json({ data: { transactions: pendingTransactions }, message: 'Pending transactions' });
    } catch (error) {
      next(error);
    }
  };

  public getTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const publicKey: string = req.params.publicKey;
      const transactions: TransactionShape[] = await this.blockchainService.getTransactionsFromAddress(publicKey);

      res.status(200).json({ data: { transactions }, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public makeTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const transactionData: TransactionShape = req.body;
      const transaction: TransactionShape = await this.blockchainService.addTransactionToPoolAsync(new TransactionModel(transactionData));

      res.status(201).json({ data: transaction, message: 'Add transaction to pool' });
    } catch (error) {
      next(error);
    }
  };

  public mineBlock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rewardAddress: string = req.body.publicKey;
      const block: BlockShape = await this.blockchainService.minePendingTransactionsAsync(rewardAddress);

      res.status(201).json({ data: { block }, message: 'Mined block' });
    } catch (error) {
      next(error);
    }
  };
}
