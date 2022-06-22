import axios from 'axios';
import { IBlockModel } from '../models/block-model';
import { ITransactionModel } from '../models/transaction-model';

const HOST = 'http://localhost:3001/blockchain';

axios.interceptors.request.use(request => {
  console.log(
    'Starting Request',
    JSON.stringify({ method: request.method, url: request.url, data: request.data }, null, 2),
  );
  return request;
});

axios.interceptors.response.use(response => {
  console.log(
    'Response:',
    JSON.stringify(
      { method: response.config.method, url: response.config.url, status: response.status, data: response.data },
      null,
      2,
    ),
  );
  return response;
});

export class ApiService {
  async getTransactions(publicKey: string) {
    const res = await axios.get(`${HOST}/transactions/${publicKey}`);
    const transactions: ITransactionModel[] = res.data.data.transactions;

    return transactions ?? [];
  }

  /**
   * Get all pending transactions of every one
   */
  async getPendingTransactions() {
    const res = await axios.get(`${HOST}/pending-transactions`);
    const transactions: ITransactionModel[] = res.data.data.transactions;

    return transactions ?? [];
  }

  async getAllBlocks() {
    const res = await axios.get(`${HOST}`);

    const blocks: IBlockModel[] = res.data.data.blocks;

    return blocks ?? [];
  }
}
