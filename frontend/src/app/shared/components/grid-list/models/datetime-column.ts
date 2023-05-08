
import { Util } from 'src/app/shared/utills/utils';
import { ViewType } from '../enums/view-type.enum';
import { Column } from './column';
export class DatetimeColumn extends Column {
  /**
   * 格式化字符串
   *
   * @type {string}
   * @memberof DatetimeColumn
   */
  formatString?: string = 'YYYY-MM-dd HH:mm';
  /**
   *
   */
  constructor(init?: DatetimeColumn) {
    super();
    if (init) {
      Object.assign(this, init);
    }
    // this.advSearchType = ViewType.date;
    this.inSearch = false;
    if (Util.isUndefinedOrNullOrWhiteSpace(this.width)) {
      //MacOS 默认字体需要142px
      this.width = '142px';
    }
  }
}