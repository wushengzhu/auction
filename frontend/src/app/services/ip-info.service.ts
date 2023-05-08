import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuctionService } from './auction.service';

@Injectable({
  providedIn: 'root',
})
export class IpInfoService {
  constructor(private auctionSvc: AuctionService) {}
  
  saveRecord(msg:string){
    const ipInfo = JSON.parse(localStorage.getItem('ipInfo'));
    let formValue = {
      IP: ipInfo?.ip,
      City:ipInfo?.city,
      Addr:ipInfo?.addr,
      ProVince:ipInfo?.pro,
      CreateDate:new Date(),
      OperateName:msg,
    }
    return this.auctionSvc.loginRecord.save(formValue);
  }
}
