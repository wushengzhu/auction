import { ViewType } from '../enums/view-type.enum';
import { Column } from './column';
export class IntColumn extends Column {
  constructor(init?: IntColumn) {
    super();
    if (init) {
      Object.assign(this, init);
    }
    // this.advSearchType = ViewType.int;
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