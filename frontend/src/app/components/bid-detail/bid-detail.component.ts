import { NzMessageService } from 'ng-zorro-antd/message';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { Util } from 'src/app/shared/utills/utils';
import { Column } from 'src/app/shared/components/grid-list/models/column';
import { GridOption } from 'src/app/shared/components/grid-list/grid-option';
import { RequestOption } from 'src/app/shared/components/grid-list/request-option';
import { AuctionService } from 'src/app/services/auction.service';
import { StringColumn } from 'src/app/shared/components/grid-list/models/string-column';
import { DatetimeColumn } from 'src/app/shared/components/grid-list/models/datetime-column';
import { IntColumn } from 'src/app/shared/components/grid-list/models/int-column';
import { Bid } from 'src/app/models/enums';

@Component({
  selector: 'app-bid-detail',
  templateUrl: './bid-detail.component.html',
  styleUrls: ['./bid-detail.component.less'],
})
export class BidDetailComponent implements OnInit, AfterViewInit {
  addPrice: number;
  maxPrice: number;
  _publishId: number;
  get publishId() {
    return this._publishId;
  }
  detailData: any;
  bid_img: string;
  initImgs = [];
  bid_imgs = [];
  startIndex: number = 0;
  activeBorder: Array<boolean>;
  isAdd: boolean = false;
  isDesc: boolean = false;
  bidTime: number = 0;
  _lookTime: number = 0;
  get lookTime() {
    return this._lookTime;
  }
  columns: Array<Column>;
  reload = false;
  option: GridOption = new GridOption({
    showAllHeader: false,
  });
  beforeRequest = (req: RequestOption) => {
    if (+this.publishId > 0) {
      req.filters.push({
        field: 'PublishId',
        op: '$eq',
        value: this.publishId,
      });
    }
    return req;
  };
  isBan: boolean = false;
  leftImg: any;
  rightImg: any;
  box: any;
  rightResult;
  @ViewChild('leftImg', { static: false }) leftImgElement: ElementRef<any>;
  @ViewChild('rightImg', { static: false }) rightImgElement: ElementRef<any>;

  afterRequest = (resp) => {
    this.bidTime = resp.Total;
    this.maxPrice = resp.Data[0]?.Amount;
    if (this.maxPrice > 0) {
      this.addPrice = this.maxPrice;
    }
    return resp;
  };

  constructor(private route: ActivatedRoute, private auctionSvc: AuctionService, private router: Router, private mesSvc: NzMessageService) {}
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this._publishId = params?.['publishId'];
    });
    // 保存点击，触发浏览记录
    // this.auctionSvc.view.saveRecord(this.publishId).subscribe();
    // 获取当前id的浏览记录
    // this.auctionSvc.view
    //   .getRecordData(this.publishId)
    //   .pipe(map((r) => r.Data.Data))
    //   .subscribe((item) => {
    //     // 做过滤时不能取Total
    //     console.log('打印一下围观数量', item);
    //     this._lookTime = item.length;
    //   });

    // 获取 当前id的详情
    this.auctionSvc.publish.getById(this.publishId).subscribe((resp: any) => {
      const time = Math.abs(resp.Data?.RemainTime);
      this.detailData = Object.assign(resp.Data, { Time: time });
      this.addPrice = this.detailData.StartPrice;
      this.executeTime();
    });
    this.getImageData();
    this.initAddPriceRecord();
  }

  ngAfterViewInit() {
    this.leftImg = this.leftImgElement.nativeElement;
    this.rightImg = this.rightImgElement.nativeElement;
    this.box = this.leftImgElement.nativeElement.lastChild;
    this.rightResult = this.rightImgElement.nativeElement.firstChild;
  }

  initAddPriceRecord() {
    this.option = new GridOption({
      url: '/api/Auction/BidRecord/GetList',
      showHeader: true,
      simplePagination: true,
    });
    this.columns = [
      new StringColumn({ display: '竞价者', field: 'UserName', width: '100px', inSearch: false }),
      new DatetimeColumn({ display: '出价时间', field: 'OperateTime' }),
      new IntColumn({ display: '出价金额', field: 'Amount', width: '100px' }),
      new StringColumn({ display: '竞价状态', field: 'Status', width: '150px', inSearch: false }),
    ];
  }

  getImageData() {
    // const token = this.authSvc.getAuthorizationUrl();
    this.auctionSvc.file.fileList('Auction$Publish', this.publishId).subscribe((resp: any) => {
      if (resp && !Util.IsNullOrEmpty(resp)) {
        resp.forEach((r, index) => {
          const src = `/uploads/images/${r?.OriginName}`;
          const obj = { src: src, id: index } as object;
          this.bid_imgs.push(obj);
        });
        this.initImgs = this.bid_imgs.slice(0, 6);
        this.bid_img = this.bid_imgs[0]?.src;
      }

      this.activeBorder = new Array(this.bid_imgs.length).fill(false);
    });
  }

  changeBtnText(time) {
    let str = '';
    if (time < 0) {
      str = '即将开始';
    } else if (time === 0) {
      str = '竞价结束';
    } else {
      str = '立即出价';
    }
    return str;
  }

  getStatusText(status) {
    let str = '';
    switch (status) {
      case Bid.Leading:
        str = '竞价领先';
        break;
      case Bid.Fail:
        str = '低于最高出价';
        break;
      case Bid.Success:
        str = '竞价成功';
        break;
      default:
        break;
    }
    return str;
  }

  dealPrice(type: string) {
    const markup = this.detailData?.MarkUp ? this.detailData?.MarkUp : 0;
    this.isBan = this.addPrice - this.detailData?.StartPrice <= 0;
    if (type === 'add') {
      this.addPrice += markup;
      this.isBan = false;
    } else {
      if (this.isBan) {
        return;
      } else {
        this.addPrice -= markup;
      }
    }
  }

  executeTime() {
    if (this.detailData.RemainTime !== 0) {
      const totalTake = Math.floor(this.detailData.Time / 1000);
      interval(1000)
        .pipe(take(totalTake))
        .subscribe({
          next: () => {
            this.detailData.Time -= 1000;
          },
        });
    } else {
      this.detailData.RemainTime = 0;
    }
  }

  bid() {
    if (this.addPrice <= this.maxPrice) {
      this.mesSvc.error('出价不能小于等于当前最高出价！');
    } else {
      const entity = {};
      this.auctionSvc.bidRecord.save(entity).subscribe((resp: any) => {
        if (resp.Data) {
          this.mesSvc.success('出价成功！');
          this.reload = true;
        }
      });
    }
  }

  changeDescStartIndex() {
    const cur = this.startIndex - 6;
    if (cur < 0) {
      this.startIndex = 0;
      this.initImgs = this.bid_imgs.slice(0, 6);
    } else {
      this.startIndex = cur;
      this.initImgs = this.bid_imgs.slice(cur, cur + 6);
    }
  }

  changeAddStartIndex() {
    const cur = this.startIndex + 6;
    if (cur > this.bid_imgs.length) {
      this.initImgs = this.bid_imgs.slice(this.startIndex, this.bid_imgs.length);
    } else {
      this.startIndex = cur;
      this.initImgs = this.bid_imgs.slice(cur, cur + 6);
    }
  }

  mouseOverImg(ev, i) {
    // 把边界全部撤掉
    this.activeBorder = new Array(this.bid_imgs.length).fill(false);
    this.bid_img = ev.path[0].currentSrc;
  }

  mouseOutImg(ev, i) {
    // 给当前悬浮的图片加边界
    this.activeBorder[i] = true;
  }

  lookOther() {
    this.router.navigate(['./auction/material-bid']);
  }

  back() {
    history.go(-1);
  }

  mouseOverLeftImg(e) {
    let ev = e || window.event;
    this.box.style.display = 'block';
    // this.getPosition(ev);
    this.rightImg.style.display = 'block';
  }

  getPosition(e) {
    let ev = e || window.event;
    // clientY：鼠标到浏览器顶部的距离
    // offsetTop：左边图片到浏览器顶部的距离
    // offsetHeight：盒子高度
    let top = ev.clientY - this.leftImg.offsetTop - this.box.offsetHeight;
    let left = ev.clientX - this.leftImg.offsetLeft - this.box.offsetWidth;
    const maxMoveTop = this.leftImg.offsetHeight - this.box.offsetHeight;
    const maxMoveLeft = this.leftImg.offsetWidth - this.box.offsetWidth;
    const minMoveTop = 0;
    const minMoveLeft = 0;
    let curBoxMoveTop, curBoxMoveLeft;
    if (top > maxMoveTop) {
      this.box.style.top = maxMoveTop + 'px';
      curBoxMoveTop = maxMoveTop;
    } else if (top < minMoveTop) {
      this.box.style.top = minMoveTop + 'px';
      curBoxMoveTop = minMoveTop;
    } else {
      this.box.style.top = top + 'px';
      curBoxMoveTop = top;
    }

    if (left > maxMoveLeft) {
      this.box.style.left = maxMoveLeft + 'px';
      curBoxMoveLeft = maxMoveLeft;
    } else if (left < minMoveLeft) {
      this.box.style.left = minMoveLeft + 'px';
      curBoxMoveLeft = minMoveLeft;
    } else {
      this.box.style.left = left + 'px';
      curBoxMoveLeft = left;
    }
    this.rightResult.style.top = -curBoxMoveTop * 2 + 'px';
    this.rightResult.style.left = -curBoxMoveLeft * 2 + 'px';
  }

  mouseOutLeftImg(e) {
    let ev = e || window.event;
    this.box.style.display = 'none';
    this.rightImg.style.display = 'none';
  }

  setBiderFormater(name: string) {
    const len = name.length;
    const first = name.slice(0, 1);
    const result = first + '*'.repeat(len - 1);
    return result;
  }
}
