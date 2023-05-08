import { Component, OnInit } from '@angular/core';
import { AuctionService } from 'src/app/services/auction.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.less'],
})
export class UserInfoComponent implements OnInit {
  loginRecord: Array<any> = [];
  userInfo: any;
  constructor(private auctionSvc: AuctionService, private storageSvc: StorageService) {}
  ngOnInit(): void {
    this.auctionSvc.loginRecord.getList(1, 0).subscribe((data) => {
      this.loginRecord = data.Data.splice(data.Data?.length - 10, data.Data?.length);
    });
    this.userInfo = this.storageSvc.get('userInfo');
  }
}
