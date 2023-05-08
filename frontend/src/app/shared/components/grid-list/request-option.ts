export interface FilterOption {
  field: string;
  op: string;
  value: any;
}

export class RequestOption {
  constructor(init?: RequestOption) {
    this.filters = [];
    if (init) {
      Object.assign(this, init);
    }
  }
  curPage?: number = 1;
  pageSize?: number = 10;
  filters?: Array<FilterOption> = [];
}
