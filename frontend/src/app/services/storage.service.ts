import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuctionService } from './auction.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private auctionSvc: AuctionService) {}

  loadUserInfo(userId: any): Observable<any> {
    return this.auctionSvc.userPage.getById(userId).pipe(
      tap((data: any) => {
        this.set('userInfo', data?.Data);
        return data;
      })
    );
  }

  get(key) {
    const val = localStorage.getItem(key);
    if(val){
      return JSON.parse(val);
    }
  }

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key) {
    localStorage.removeItem(key);
  }
}
