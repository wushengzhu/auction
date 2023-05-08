import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, map, take } from 'rxjs';
import { AuctionService } from 'src/app/services/auction.service';
import { Util } from 'src/app/shared/utills/utils';

@Component({
  selector: 'app-auction-bid',
  templateUrl: './auction-bid.component.html',
  styleUrls: ['./auction-bid.component.less'],
  providers: [DatePipe],
})
export class AuctionBidComponent implements OnInit {
  tabIndex: number = 0;
  isLoad: boolean = false;
  publishData: Array<any>;
  _token: any;
  get token() {
    return this._token;
  }
  _mobileLink: string;
  get mobileLink() {
    return this._mobileLink;
  }
  spin: boolean = false;
  error: boolean = false;
  tabList = [
    { tab: '全  部', value: 0 },
    { tab: '即将开始', value: 1 },
    { tab: '正在进行', value: 2 },
  ];
  curentBid: number = 0;
  constructor(private auctionSvc: AuctionService, private datePipe: DatePipe, private router: Router) {}

  ngOnInit() {
    // 获取移动端链接
    // this.profilefSvc.getMobileDomain().subscribe((resp) => {
    //   if (Util.isUndefinedOrNullOrWhiteSpace(resp.Data)) {
    //     this.error = true;
    //   } else {
    //     this._mobileLink = resp.Data;
    //     this.error = false;
    //   }
    // });
    // this._token = this.authService.getAuthorizationUrl();
    this.requestData(this.tabIndex);
  }

  requestData(tabIndex: number) {
    this.isLoad = true;
    this.auctionSvc.publish
      .getList(1, 0, 1)
      .pipe(
        map((resp: any) => {
          return resp.Data;
        })
      )
      .subscribe((resp) => {
        this.publishData = this.filterTabStatus(resp as Array<any>, tabIndex);
        this.publishData.forEach((c) => {
          c.StartTime = `${this.datePipe.transform(c.StartTime, 'yyyy/MM/dd HH:mm:ss')}`;
          c.EndTime = `${this.datePipe.transform(c.EndTime, 'yyyy/MM/dd HH:mm:ss')}`;
          c.Time = Math.abs(c.RemainTime as number);
          c.qrCode = `${this.mobileLink}/app/auction/portal/publish/auction-detail;id=${c.Id}`;
          c.src = !Util.IsNullOrEmpty(c?.Images) ? `/uploads/images/${c?.Images[0]}` : '';
          // c.src = Util.parsePath(`/api/attachment/file/image?id=${c?.File?.Id}&objectId=${c.Id}&modCode=Auction$Publish&${this.token}`, ResourceType.FrontEnd);
          return c;
        });
        this.executeTime();
        this.isLoad = false;
      });
  }

  filterTabStatus(data, tabIndex) {
    switch (tabIndex) {
      case 1:
        const startData = data.filter((item) => item.RemainTime < 0);
        return startData;
      case 2:
        const doingData = data.filter((item) => item.RemainTime > 0);
        return doingData;
      default:
        return data;
    }
  }

  executeTime() {
    this.publishData.forEach((item) => {
      if (item.RemainTime !== 0) {
        const totalTake = Math.floor(item.Time / 1000);
        interval(1000)
          .pipe(take(totalTake))
          .subscribe({
            next: () => {
              item.Time -= 1000;
            },
          });
      } else {
        item.RemainTime = 0;
      }
    });
  }

  linkDetail(id: string) {
    this.router.navigate(['/home/auction/bid-detail', { publishId: id }]);
  }

  excerptIsEmpty(excerpt: string) {
    if (Util.isUndefinedOrNull(excerpt)) {
      return '当前物品没有摘要说明!';
    } else {
      return excerpt;
    }
  }
}
