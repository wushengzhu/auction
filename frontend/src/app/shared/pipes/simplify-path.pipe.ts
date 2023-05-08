import { Pipe, PipeTransform } from '@angular/core';
import { Util } from '../utills/utils';

@Pipe({
  name: 'simplifyPath',
})
export class SimplifyPathPipe implements PipeTransform {
  transform(value: any, format: string = '/'): any {
    if (!Util.isUndefinedOrNull(value)) {
      return value.toString().split(format).pop();
    } else {
      return null;
    }
  }
}
