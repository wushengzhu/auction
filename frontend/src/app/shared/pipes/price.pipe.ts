import { Pipe, PipeTransform } from '@angular/core';
import { Util } from '../utills/utils';

@Pipe({
  name: 'price',
})
export class PricePipe implements PipeTransform {
  transform(value: any, args?: any): string {
    // 带两位小数
    // const num = Math.round(value * Math.pow(10, 2)) / Math.pow(10, 2);
    // const num = parseFloat(value.toFixed(2));
    let strNum;
    if (!Util.isFloat(value)) {
      strNum = value?.toString() + '.00';
    } else {
      strNum = value?.toFixed(2);
    }
    return strNum;
  }
}
