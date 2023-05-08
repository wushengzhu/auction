import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ReplaySubject, shareReplay } from 'rxjs';
import { AuctionService } from 'src/app/services/auction.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-reset-pwd',
  templateUrl: './reset-pwd.component.html',
  styleUrls: ['./reset-pwd.component.less']
})
export class ResetPwdComponent implements OnInit{
  secondPwd: any;
  oldPwd: any;
  newPwd: any;
  userInfo: any;
  constructor(
    private nzMsgSvc: NzMessageService,
    private auctionSvc: AuctionService,
    private storageSvc: StorageService,
  ){
   
  }

  ngOnInit(): void {
    if(this.storageSvc.get('userInfo')){
      this.userInfo = this.storageSvc.get('userInfo');
    }
  }

  save(){
    const sub = new ReplaySubject<any>();
    if (this.newPwd !== this.secondPwd) {
      this.nzMsgSvc.error('两次输入新密码不一致！');
      this.newPwd = '';
      this.oldPwd = '';
      this.secondPwd = '';
    } else {
      if (this.userInfo.Id) {
        const reqData = { userId: this.userInfo.Id, newPwd: this.newPwd };
        this.auctionSvc.userPage.updatePwd(reqData).subscribe((item: any) => {
          this.nzMsgSvc.success(item?.Message);
          sub.next(true);
          sub.complete();
        });
      }else{
         sub.next(false);
         sub.complete();
      }
    }
    return sub;
  }
}
