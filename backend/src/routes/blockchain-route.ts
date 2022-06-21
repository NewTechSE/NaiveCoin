import { BlockchainController } from '@/controllers/blockchain-controller';
import { MineBlockDto } from '@/dtos/mine-block-dto';
import { Routes } from '@/interfaces/routes.interface';
import validationMiddleware from '@/middlewares/validation.middleware';
import { Router } from 'express';

export class BlockchainRoute implements Routes {
  public path = '/blockchain';
  public router = Router();
  public blockchainController = new BlockchainController();

  constructor() {
    this.router.get(`${this.path}`, this.blockchainController.getBlocks);

    this.router.get(`${this.path}/transactions/:publicKey`, this.blockchainController.getTransactions);

    this.router.post(`${this.path}/transactions`, this.blockchainController.makeTransaction);

    this.router.get(`${this.path}/pending-transactions`, this.blockchainController.getPendingTransactions);

    this.router.post(`${this.path}/mine`, validationMiddleware(MineBlockDto, 'body'), this.blockchainController.mineBlock);
  }
}
