import { flow, makeObservable, observable } from 'mobx';
import { IBlockModel } from '../models/block-model';
import { ApiService } from '../services/api-service';

export class BlockchainStore {
  apiService: ApiService;

  @observable
  blocks: IBlockModel[] = [];

  @observable
  isLoading: boolean = false;

  constructor(apiService: ApiService) {
    makeObservable(this);

    this.apiService = apiService;
  }

  @flow
  *fetchBlocks() {
    this.isLoading = true;
    this.blocks = yield this.apiService.getAllBlocks();

    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }
}
