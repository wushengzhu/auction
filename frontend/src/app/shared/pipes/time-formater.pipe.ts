import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'TimeFormater',
})
export class TimeFormaterPipe implements PipeTransform {
  transform(value) {
    if (!value || value <= 0) {
      return '00天00时00分00秒';
    }
    const time = Math.abs(value);
    const transecond = Math.round(time / 1000); // 转化为秒
    const day = Math.floor(transecond / 3600 / 24); // 获取天数
    const hour = Math.floor((transecond / 3600) % 24); // 获取小时，取余代表不满一天那部分
    const minute = Math.floor((transecond / 60) % 60); // 获取分，取余代表不满小时那部分
    const second = transecond % 60;
    return `${this.formatTime(day)}天${this.formatTime(hour)}时${this.formatTime(minute)}分${this.formatTime(second)}秒`;
  }

  formatTime(t) {
    return t < 10 ? '0' + t : '' + t;
  }
}
