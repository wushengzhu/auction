import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { of } from 'rxjs';
import { AuctionService } from 'src/app/services/auction.service';
import { GridOption } from 'src/app/shared/components/grid-list/grid-option';
import { ButtonColumn } from 'src/app/shared/components/grid-list/models/button-column';
import { CheckboxColumn } from 'src/app/shared/components/grid-list/models/checkbox-column';
import { Column } from 'src/app/shared/components/grid-list/models/column';
import { DatetimeColumn } from 'src/app/shared/components/grid-list/models/datetime-column';
import { EnumColumn } from 'src/app/shared/components/grid-list/models/enum-column';
import { EnumOptions } from 'src/app/shared/components/grid-list/models/enum-options';
import { FloatColumn } from 'src/app/shared/components/grid-list/models/float-column';
import { IntColumn } from 'src/app/shared/components/grid-list/models/int-column';
import { StringColumn } from 'src/app/shared/components/grid-list/models/string-column';
import { Util } from 'src/app/shared/utills/utils';

@Component({
  selector: 'app-my-bid',
  templateUrl: './my-bid.component.html',
  styleUrls: ['./my-bid.component.less'],
})
export class MyBidComponent implements OnInit {
  dataList: Array<any> | undefined;
  isVisible: boolean = false;
  userId: string = '';
  title: string | undefined;
  entity: any;
  isLoad: boolean = false;
  totalData: number = 0;
  pageSize: number = 5;
  curPage: number = 1;
  option: GridOption;
  columns: Array<Column> = [];
  constructor(private auctionSvc: AuctionService, private nzMsgSvc: NzMessageService) {}

  ngOnInit() {
    this.option = new GridOption({
      url: '/api/Auction/Publish/GetList',
      scroll: { x: '750px' },
    });

    this.columns = [
      new CheckboxColumn({
        left: '0px',
        // width: '38px',
      }),
      new StringColumn({ display: '竞品标题', field: 'Title', width: '400px', isEllipsis: true }),
      new StringColumn({ display: '物资流水号', field: 'SerialNumber', width: '120px' }),
      new FloatColumn({ display: '评估价(元)', field: 'EvaluationPrice', width: '120px', inSearch: false }),
      new FloatColumn({ display: '起拍价(元)', field: 'StartPrice', width: '120px', inSearch: false }),
      new DatetimeColumn({ display: '竞拍开始时间', field: 'StartTime', inSearch: false, width: '142px' }),
      new DatetimeColumn({ display: '竞拍截止时间', field: 'Deadline', inSearch: false, width: '142px' }),
      new FloatColumn({ display: '我的最高出价', field: 'UserBidRecord.Amount', width: '130px', inSearch: false }),
      new StringColumn({ display: '当前最高出价者', field: 'BidRecord.UserName', width: '150px' }),
      new FloatColumn({ display: '当前最高出价', field: 'BidRecord.Amount', width: '120px', inSearch: false }),
      new DatetimeColumn({ display: '出价时间', field: 'BidRecord.OperateTime', width: '120px', inSearch: false }),
    ];
  }

  pageSizeChange(event) {
    this.pageSize = event;
    this.isLoad = true;
    this.reloadUserList();
  }

  reloadUserList() {
    // let sub = new ReplaySubject<boolean>();
    this.auctionSvc.userPage.userList(this.curPage, this.pageSize).subscribe((resp: any) => {
      this.dataList = resp.Data;
      this.totalData = resp.Total;
      this.isLoad = false;
    });
  }

  pageIndexChange(event) {
    this.curPage = event;
    this.isLoad = true;
    this.reloadUserList();
  }

  editUserInfo(id?: string): void {
    this.isVisible = true;
    if (Util.isUndefinedOrNull(id)) {
      this.title = '新增用户信息';
      this.userId = '';
    } else {
      this.title = '编辑用户信息';
      this.userId = id;
    }
  }

  handleOk(): void {}

  handleCancel(): void {
    this.isVisible = false;
  }

  deleteUser(id: any) {
    this.auctionSvc.userPage.detele(id).subscribe((item) => {
      this.reloadUserList();
      this.nzMsgSvc.success('删除成功！');
    });
  }
}
