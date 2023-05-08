import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class TokenTimeService {
  constructor(private storageSvc: StorageService) {}

  isExpire(): boolean {
    const curentTimeDiff =
      moment(new Date()).diff(new Date('1970/1/1 00:00')) / 1000;
    const tokenTime = this.storageSvc.get('tokenExp');
    if (curentTimeDiff > tokenTime) {
      return true; // 已过期
    }
    return false;
  }
}
