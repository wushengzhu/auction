import { Component, Input, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ReturnEditComponent } from 'src/app/components/return-edit/return-edit.component';
import { AuctionService } from 'src/app/services/auction.service';
import { GridOption } from 'src/app/shared/components/grid-list/grid-option';
import { ButtonColumn } from 'src/app/shared/components/grid-list/models/button-column';
import { Column } from 'src/app/shared/components/grid-list/models/column';
import { DatetimeColumn } from 'src/app/shared/components/grid-list/models/datetime-column';
import { StringColumn } from 'src/app/shared/components/grid-list/models/string-column';
import { RequestOption } from 'src/app/shared/components/grid-list/request-option';

@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.less']
})
export class ReturnComponent {
  @Input() publishId: string;
  columns: Array<Column>;
  option: GridOption = new GridOption();
  reload: boolean = false;
  organizeId: string;
  @ViewChild(ReturnEditComponent,{static:true}) returnEditTpl:ReturnEditComponent
  constructor(private auctionSvc: AuctionService, private mesSvc: NzMessageService,private modal:NzModalService) {}

  beforeRequest = (req: RequestOption) => {
    if (this.organizeId) {
      req.filters.push({
        field: 'DepPath',
        op: 'contains',
        value: this.organizeId,
      });
    }
    return req;
  };

  ngOnInit() {
    this.getGridColumn();
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
      url: '/api/Auction/ReturnRecord/GetList',
      scroll: { x: 270 + 'px' },
    });
    this.columns = [
      new StringColumn({ display: '退回物资', field: 'Publish.Material.Name', left: '0px', width: '500px' }),
      new StringColumn({ display: '姓名', field: 'Publish.BidRecord.UserName', width: '70px' }),
      new StringColumn({ display: '工号', field: 'Publish.BidRecord.UserCode', width: '100px' }),
      new StringColumn({ display: '所属部门', field: 'Publish.BidRecord.DepName', width: '150px', inSearch: false}),
      new StringColumn({ display: '退回人', field: 'UserName', width: '70px', inSearch: false }),
      new DatetimeColumn({ display: '退回时间', field: 'OperateTime', width: '150px', inSearch: false, formatString: 'YYYY/MM/DD HH:mm' }),
      new StringColumn({ display: '经办人', field: 'Operator', width: '70px' }),
      new ButtonColumn({ width: '68px', template: 'Operate', right: '0px', inSearch: false }),
    ];
  }

  editItem(entity?) {
    this.modal
      .create({
        nzTitle: entity ? '拍品退回录入' : '拍品退回编辑',
        nzContent: ReturnEditComponent,
        nzWidth: 800,
        nzFooter:null,
        nzComponentParams: {
          returnId: entity ? entity.Id : 0,
          publishName: entity ? entity.Publish.Material.Name : '',
          bidRecord: entity ? entity : '',
        }
      }).afterClose
      .subscribe((r) => {
        console.log(r);
        if (r) {
          this.reload = true;
        }
      });
  }

  deleteItem(id: string) {
    this.auctionSvc.back.delete(id).subscribe((r) => {
      this.mesSvc.success('删除成功');
      this.reload = true;
    });
  }
}
