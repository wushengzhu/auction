import { Observable, ReplaySubject } from 'rxjs';
import { ViewType } from '../enums/view-type.enum';
import { Column } from './column';
import { EnumOptions } from './enum-options';

export class EnumColumn extends Column {
  /**
   * 内部属性，请勿使用
   *
   */
  _enumOptions?: ReplaySubject<EnumOptions>;
  /**
   * 高级搜索时，下拉选项
   *
   * @memberof Column
   */
  enumOptions?: () => Observable<EnumOptions>;

  multiple?: boolean = false;

  constructor(init?: EnumColumn) {
    super();
    // this.advSearchType = ViewType.enum;
    this.inSearch = false;
    if (init) {
      Object.assign(this, init);
    }
  }
}