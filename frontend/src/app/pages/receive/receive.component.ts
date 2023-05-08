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
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.less']
})
export class ReceiveComponent implements OnInit {
  dataList: Array<any> | undefined;
  isVisible: boolean = false;
  userId: string = '';
  title: string | undefined;
  entity: any;
  isLoad: boolean = false;
  scroll = { x: '300px' };
  totalData: number = 0;
  pageSize: number = 5;
  curPage: number = 1;
  option: GridOption;
  columns: Array<Column> = [];
  constructor(
    private auctionSvc: AuctionService,
    private nzMsgSvc: NzMessageService
  ) {}

  ngOnInit() {
    this.option = new GridOption({
      url: '/api/Auction/Publish/GetList',
      scroll: { x: '750px' },
    });

    this.columns = [
      new CheckboxColumn({ left: '0px' }),
      new StringColumn({ display: '领取物资',field: 'Material.Name', width: '300px', isEllipsis:true }),
      new StringColumn({ display: '物品摘要', width: '400px', field: 'Excerpt', isEllipsis: true,  inSearch: false,  }),
      new StringColumn({ display: '姓名', field: 'BidRecord.UserName', width: '120px',  }),
      new StringColumn({ display: '工号', field: 'BidRecord.UserCode', width: '120px',  }),
      new StringColumn({ display: '所属部门', field: 'BidRecord.DepName', width: '120px',  inSearch: false,  }),
      new FloatColumn({ display: '竞价价格', field: 'BidRecord.Amount', width: '100px',  inSearch: false }),
      new StringColumn({ display: '领取状态', field: 'Status', width: '120px',  inSearch: false,  }),
      new StringColumn({ display: '支付方式', field: 'ReceiveRecord.PaymentMethod', width: '100px',  inSearch: false }),
      new StringColumn({ display: '领取人', field: 'ReceiveRecord.UserName', width: '100px',  }),
      new DatetimeColumn({ display: '领取时间', field: 'ReceiveRecord.OperateTime', width: '150px', inSearch: false,  formatString: 'YYYY/MM/DD HH:mm' }),
      new ButtonColumn({
        width: '70px',
        right: '0px',
        inSearch: false,
      }),
    ];
    this.reloadUserList();
  }

  pageSizeChange(event) {
    this.pageSize = event;
    this.isLoad = true;
    this.reloadUserList();
  }

  reloadUserList() {
    // let sub = new ReplaySubject<boolean>();
    this.auctionSvc.userPage
      .userList(this.curPage, this.pageSize)
      .subscribe((resp: any) => {
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

  handleOk(): void {
    
  }

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