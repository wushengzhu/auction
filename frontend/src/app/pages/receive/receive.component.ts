import { Component, Input, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { of } from 'rxjs';
import { ReceiveEditComponent } from 'src/app/components/receive-edit/receive-edit.component';
import { Receive, ReceiveStatus } from 'src/app/models/enums';
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
import { RequestOption } from 'src/app/shared/components/grid-list/request-option';
import { Util } from 'src/app/shared/utills/utils';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.less'],
})
export class ReceiveComponent implements OnInit {
  @Input() publishId: string;
  organizeId: string;
  columns: Array<Column>;
  option: GridOption = new GridOption();
  reload: boolean = false;
  selectData = [];
  prices = [];
  templatePara = {
    status: -2,
  };
  statusList: any[] = ReceiveStatus;
  publishIds = [];
  sumPrice: number = 0;
  isPay: boolean = false;
  userName: string = '';
  userId: string = '';
  received: number = -3; // 默认已确认收货、已付款的所有记录
  constructor(private auctionSvc: AuctionService, private mesSvc: NzMessageService, private modal: NzModalService) {}

  beforeRequest = (req: RequestOption) => {
    if (this.organizeId) {
      req.filters.push({
        field: 'BidRecord.DepPath',
        op: 'contains',
        value: this.organizeId,
      });
    }
    // // 默认获取竞拍成功的产品
    // const filter1: CompositeFilterDescriptor = { logic: 'or', filters: [] };
    // // 未开封获已开封都是未提交状态
    // [Receive.Unclaimed, Receive.Confirmed, Receive.Paid].forEach((status) => {
    //   filter1.filters.push({ field: 'Status', operator: 'eq', value: status });
    // });
    // req.filters.push(filter1);

    // // 标签获取列表
    // if (this.templatePara.status > -2) {
    //   req.filters.push({
    //     field: 'Status',
    //     operator: 'eq',
    //     value: this.templatePara.status,
    //   });
    // } else if (this.templatePara.status === -3) {
    //   const filter2: CompositeFilterDescriptor = { logic: 'or', filters: [] };
    //   // 未开封获已开封都是未提交状态
    //   [Receive.Confirmed, Receive.Paid].forEach((status) => {
    //     filter2.filters.push({ field: 'Status', operator: 'eq', value: status });
    //   });
    //   req.filters.push(filter2);
    // }
    return req;
  };

  ngOnInit() {
    this.getGridColumn();
  }

  refresh(status?: number) {
    if (status) {
      this.templatePara.status = status;
    }
    this.reload = true;
  }

  onDepSelect(r) {
    if (r) {
      this.organizeId = r.Id;
    } else {
      this.organizeId = null;
    }
    this.reload = true;
  }

  getGridColumn() {
    this.option = new GridOption({
      url: '/api/Auction/Publish/GetList',
      scroll: { x: 270 + 'px' },
      recoverGridState: true,
      defaultIdSortEnabled: false,
      bordered: true,
    });
    this.columns = [
      new CheckboxColumn({ left: '0px' }),
      new StringColumn({ display: '领取物资', left: '50px', field: 'Material.Name', width: '300px' }),
      new StringColumn({ display: '物品摘要', width: '400px', field: 'Excerpt', isEllipsis: true, inSearch: false }),
      new StringColumn({ display: '姓名', field: 'BidRecord.UserName', width: '120px' }),
      new FloatColumn({ display: '竞价价格', field: 'BidRecord.Amount', width: '100px', inSearch: false }),
      new StringColumn({ display: '领取状态', field: 'Status', width: '120px', inSearch: false }),
      new StringColumn({ display: '支付方式', field: 'ReceiveRecord.PaymentMethod', width: '100px', inSearch: false }),
      new StringColumn({ display: '领取人', field: 'ReceiveRecord.UserName', width: '100px' }),
      new DatetimeColumn({ display: '领取时间', field: 'ReceiveRecord.OperateTime', width: '150px', inSearch: false, formatString: 'YYYY-MM-DD HH:mm' }),
      new ButtonColumn({
        width: '48px',
        right: '0px',
        inSearch: false,
        template: 'Operate',
      }),
    ];
  }

  getReceiveText(status) {
    if (status === Receive.Confirmed) {
      return '已确认收货';
    } else {
      return this.statusList.filter((item) => item.value === status)[0]?.text;
    }
  }

  editItem(entity?) {
    this.isPay = false;
    if (this.selectData.length > 0) {
      this.prices = [];
      this.publishIds = [];
      const commonUser = this.selectData[0].BidRecord.UserId;
      const isSame = this.selectData.every((item) => item.BidRecord.UserId === commonUser);
      if (isSame) {
        this.selectData.forEach((item) => {
          if (item.Status === 6) {
            this.isPay = true;
          }
          this.userName = item.BidRecord.UserName;
          this.userId = item.BidRecord.UserId;
          this.publishIds.push(item.BidRecord.PublishId); // 选中的id集合
          this.prices.push(item.BidRecord.Amount); // 获取竞价价格集合
        });
        // 获取选中的竞价价格总和
        this.sumPrice = this.prices.reduce((total, num) => {
          return total + num;
        }, 0);
      } else {
        this.mesSvc.error('您所选择的拍品不属于同一个人！');
      }
    } else if (this.selectData.length === 0) {
      this.mesSvc.error('请选择您要登记付款的竞品！');
    }

    if (this.publishIds.length > 0 && !this.isPay) {
      this.modal.create({
        nzTitle: '拍品付款登记',
        nzContent: ReceiveEditComponent,
        nzWidth: 700,
        nzComponentParams: { ids: this.publishIds, sumPrice: this.sumPrice, userName: this.userName, userId: this.userId },
      });
    } else if (this.isPay) {
      this.mesSvc.error('您选择的拍品包含已付款的！');
    }
  }

  deleteItem(id: string) {
    this.modal.confirm({
      nzTitle: '确定要删除当前领取记录吗',
      nzOnOk: () => {
        this.auctionSvc.publish.detele(id).subscribe((r) => {
          this.mesSvc.success('删除成功！');
          this.reload = true;
        });
      },
    });
  }
}
