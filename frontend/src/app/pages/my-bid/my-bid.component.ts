import { StorageService } from './../../services/storage.service';
import { RequestOption } from './../../shared/components/grid-list/request-option';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Publish } from 'src/app/models/enums';
import { Bid, BidStatus } from 'src/app/models/enums/bid.enum';
import { MyBid, MyBidStatus } from 'src/app/models/enums/my-bid.enum';
import { AuctionService } from 'src/app/services/auction.service';
import { GridOption } from 'src/app/shared/components/grid-list/grid-option';
import { CheckboxColumn } from 'src/app/shared/components/grid-list/models/checkbox-column';
import { Column } from 'src/app/shared/components/grid-list/models/column';
import { DatetimeColumn } from 'src/app/shared/components/grid-list/models/datetime-column';
import { FloatColumn } from 'src/app/shared/components/grid-list/models/float-column';
import { StringColumn } from 'src/app/shared/components/grid-list/models/string-column';

@Component({
  selector: 'app-my-bid',
  templateUrl: './my-bid.component.html',
  styleUrls: ['./my-bid.component.less'],
})
export class MyBidComponent implements OnInit {
  isVisible: boolean = false;
  isLoad: boolean = false;
  tabList: Array<any> = MyBidStatus;
  templatePara = {
    status: 0,
  };
  statusList: any[] = BidStatus;
  option: GridOption;
  columns: Array<Column> = [];
  selectedData: Array<any> = [];
  reload: boolean = false;
  beforeRequest = (req: RequestOption) => {
    req.filters.push({
      field: 'Status',
      op: '$gte',
      value: Publish.Published,
    });
    if (this.templatePara.status === 0) {
      req.filters.push({
        field: 'Status',
        op: '$gte',
        value: Publish.Published,
      });
    } else {
      if (this.templatePara.status === 2) {
        req.filters.push({
          field: 'Status',
          op: '$lt',
          value: Publish.Sold,
        });
      } else {
        req.filters.push({
          field: 'Status',
          op: '$eq',
          value: this.templatePara.status,
        });
      }
    }

    return req;
  };
  curUserId: any;
  constructor(private auctionSvc: AuctionService, private mesSvc: NzMessageService, private router: Router, private storeSvc: StorageService) {}

  ngOnInit() {
    this.option = new GridOption({
      url: '/api/Auction/Publish/GetList',
      scroll: { x: '1000px' },
    });

    this.columns = [
      new CheckboxColumn({
        left: '0px',
        // width: '38px',
      }),
      new StringColumn({ display: '竞品标题', field: 'Title', width: '200px', isEllipsis: true }),
      new StringColumn({ display: '物资流水号', field: 'SerialNumber', width: '120px' }),
      new FloatColumn({ display: '评估价(元)', field: 'EvaluationPrice', width: '120px', inSearch: false }),
      new FloatColumn({ display: '起拍价(元)', field: 'StartPrice', width: '120px', inSearch: false }),
      new DatetimeColumn({ display: '竞拍开始时间', field: 'StartTime', inSearch: false, width: '150px' }),
      new DatetimeColumn({ display: '竞拍截止时间', field: 'EndTime', inSearch: false, width: '150px' }),
      new FloatColumn({ display: '我的最高出价', field: 'UserBidRecord.Amount', width: '130px', inSearch: false }),
      new StringColumn({ display: '当前最高出价者', field: 'BidRecord.UserName', width: '150px' }),
      new FloatColumn({ display: '当前最高出价', field: 'BidRecord.Amount', width: '120px', inSearch: false }),
      new DatetimeColumn({ display: '出价时间', field: 'BidRecord.OperateTime', inSearch: false, width: '150px' }),
    ];
    this.curUserId = this.storeSvc.get('userInfo')?.Id;
  }

  getStatusText(status) {
    let str = '';
    if (status === Bid.Fail) {
      str = '低于最高出价';
    } else {
      str = this.statusList.filter((item) => item.value === status)[0].text;
    }
    return str;
  }

  confirmReceive() {
    let confirmData: Array<any> = [];
    console.log(this.selectedData);
    if (this.selectedData.length > 0) {
      const isBidden = this.selectedData.every((item) => item.Status === 3 && item.BidRecord[0]?.UserId === this.curUserId);
      if (isBidden) {
        this.selectedData.forEach((item) => {
          confirmData.push(item.Id);
        });
        this.saveConfim(confirmData);
      } else {
        this.mesSvc.error('请选择当前用户已获拍且待确认收货的物品！');
      }
    } else if (this.selectedData.length === 0) {
      this.mesSvc.error('请选择当前用户已获拍且待确认收货的物品！');
    }
  }

  refresh(status?: number) {
    if (status && status > 2) {
      this.templatePara.status = status;
    }
    this.reload = true;
  }

  saveConfim(data) {
    if (data?.length > 0) {
      this.auctionSvc.publish.confirm(data).subscribe((resp: any) => {
        if (resp.Data) {
          this.mesSvc.success('选中的物品已确认收货！');
          this.reload = true;
        }
      });
    }
  }

  readDetail(id: string) {
    this.router.navigate(['/home/auction/bid-detail', { publishId: id }]);
  }
}
