import { Component } from '@angular/core';
import * as moment from 'moment';
import * as momentTimezone from 'moment-timezone';

/**
 * 强制全局moment使用中国时区
 */
momentTimezone.tz.setDefault('Asia/Shanghai');
moment.locale('zh-cn');
@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
})

export class AppComponent {
  title = 'auction';
  constructor(){
      
  }
}
