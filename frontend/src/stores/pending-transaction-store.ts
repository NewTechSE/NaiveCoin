import { flow, makeObservable, observable } from 'mobx';
import { ITransactionModel } from '../models/transaction-model';
import { ApiService } from '../services/api-service';

export class PendingTransactionStore {
  apiService: ApiService;

  @observable
  isLoading = false;

  @observable
  pendingTransactions: ITransactionModel[] = [];

  constructor(apiService: ApiService) {
    makeObservable(this);
    this.apiService = apiService;
  }

  @flow
  *fetchPendingTransactions() {
    this.isLoading = true;
    this.pendingTransactions = yield this.apiService.getPendingTransactions();
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  @flow
  *mineNewBlock(rewardAddrress: string) {
    yield this.apiService.mineNewBlock(rewardAddrress);
  }
}
