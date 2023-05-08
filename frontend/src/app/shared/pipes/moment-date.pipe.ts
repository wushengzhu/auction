import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

/**
 * 基于 moment 日期格式化，显示更多细节参考：
 *
 * @see http://momentjs.com/docs/#/displaying
 *
 * @example
 * ```html
 * {{ data | _data }}
 * 2017-09-17 15:35
 *
 * {{ data | _data: 'YYYY年MM月DD日' }}
 * 2017年09月17
 *
 * {{ data | _data: 'fn' }}
 * 10 秒前
 * ```
 */
@Pipe({ name: '_date' })
export class MomentDatePipe implements PipeTransform {
  transform(value: Date, formatString: string = 'YYYY-MM-DD HH:mm'): string {
    if (value) {
      if (formatString === 'fn') {
        const sevenDaysAgo = moment().subtract(7, 'day').format();
        if (moment(value).isSame(moment(), 'quarter')) {
          // 一季度内
          if (moment(value).isBefore(sevenDaysAgo)) {
            // 一周内
            return moment(value).format('M月DD日');
          } else {
            return moment(value).fromNow();
          }
        } else {
          return moment(value).format('YYYY/MM/DD');
        }
      }
      // 其他格式
      return moment(value).format(formatString);
    } else {
      return '';
    }
  }
}
