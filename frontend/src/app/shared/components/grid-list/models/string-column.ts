import { Column } from './column';
export class StringColumn extends Column {
  constructor(init?: StringColumn) {
    super();
    // this.advSearchType = ViewType.string;
    if (init) {
      Object.assign(this, init);
    }
  }
  /**
   * 自动溢出省略时省略行数
   */
  ellipsisRows?: number = 1;
  /**
   * 是否可拷贝
   */
  copyable?: boolean;
  /**
   * 是否可以展开
   */
  expandable?: boolean;
}
