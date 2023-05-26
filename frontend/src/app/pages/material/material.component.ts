import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { of } from 'rxjs';
import { MaterialEditComponent } from 'src/app/components/material-edit/material-edit.component';
import { AuctionService } from 'src/app/services/auction.service';
import { GridOption } from 'src/app/shared/components/grid-list/grid-option';
import { ButtonColumn } from 'src/app/shared/components/grid-list/models/button-column';
import { Column } from 'src/app/shared/components/grid-list/models/column';
import { DatetimeColumn } from 'src/app/shared/components/grid-list/models/datetime-column';
import { EnumColumn } from 'src/app/shared/components/grid-list/models/enum-column';
import { EnumOptions } from 'src/app/shared/components/grid-list/models/enum-options';
import { IntColumn } from 'src/app/shared/components/grid-list/models/int-column';
import { StringColumn } from 'src/app/shared/components/grid-list/models/string-column';
import { Util } from 'src/app/shared/utills/utils';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.less'],
})
export class MaterialComponent implements OnInit {
  dataList: Array<any> | undefined;
  entity: any;
  reload: boolean = false;
  option: GridOption;
  columns: Array<Column> = [];
  materialId: any;
  constructor(private auctionSvc: AuctionService, private nzMsgSvc: NzMessageService, private nzDrawer: NzDrawerService) {}

  ngOnInit() {
    this.option = new GridOption({
      url: '/api/Auction/Material/GetList',
      scroll: { x: '750px' },
    });

    this.columns = [
      new StringColumn({ display: '物资名称', field: 'Name', width: '300px', isEllipsis: true }),
      new StringColumn({ display: '物资类型', field: 'Category', width: '100px' }),
      new StringColumn({ display: '物资编号', field: 'SerialNumber', width: '120px' }),
      new StringColumn({ display: '物资摘要', field: 'Detail', width: '400px', isEllipsis: true, inSearch: false }),
      new StringColumn({ display: '仓库类别', field: 'WarehouseCategory', width: '100px', inSearch: false }),
      new IntColumn({ display: '入库数量', field: 'Quantity', width: '100px', inSearch: false }),
      new IntColumn({ display: '剩余数量', field: 'RemainQuantity', width: '100px', inSearch: false }),
      new EnumColumn({
        display: '允许拍卖',
        field: 'AllowAuction',
        width: '100px',
        inSearch: false,
        enumOptions: () =>
          of(
            new EnumOptions({
              options: [
                { text: '是', value: true },
                { text: '否', value: false },
              ],
            })
          ),
      }),
      new DatetimeColumn({ display: '生产日期', field: 'ProduceDate', width: '120px', inSearch: false, formatString: 'YYYY-MM-dd' }),
      new DatetimeColumn({ display: '有效日期', field: 'EffectiveDate', width: '120px', inSearch: false, formatString: 'YYYY-MM-dd' }),
      // new StringColumn({ display: '上缴人', field: 'UserName', width: '90px' }),
      // new StringColumn({ display: '部门/科室', field: 'DepName', width: '150px', inSearch: false }),
      new DatetimeColumn({ display: '申报日期', field: 'TurnInDate', width: '120px', inSearch: false, formatString: 'YYYY-MM-dd' }),
      // new StringColumn({ display: '经办人', field: 'Operator', width: '90px', inSearch: false }),
      new DatetimeColumn({ display: '入库时间', field: 'CreateDate', inSearch: false }),
      new DatetimeColumn({ display: '出库时间', field: 'DeliveryDate', inSearch: false }),
      new ButtonColumn({
        display: '操作',
        field: 'Operate',
        onlyText: true,
        width: '90px',
        right: '0px',
        inSearch: false,
        template: 'Operate',
      }),
    ];
  }

  edit(entity?: any): void {
    this.nzDrawer
      .create({
        nzTitle: entity ? '编辑物资' : '物资入库',
        nzContent: MaterialEditComponent,
        nzWidth: 800,
        nzFooter: null,
        nzContentParams: {
          materialId: entity?.Id,
          entity: entity,
        },
      })
      .afterClose.subscribe((item) => {
        if (item) {
          this.reload = true;
        }
      });
  }

  delete(id: any) {
    this.auctionSvc.material.detele(id).subscribe((item) => {
      this.nzMsgSvc.success('删除成功！');
      this.reload = true;
    });
  }
}
