import { Routes } from '@/interfaces/routes.interface';
import { Router } from 'express';

export class BlockchainRoute implements Routes {
  public path = '/blockchain';
  public router = Router();

  constructor() {}
}
