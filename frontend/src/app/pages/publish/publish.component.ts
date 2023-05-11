import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { of } from 'rxjs';
import { PublishStatus } from 'src/app/models/enums';
import { AuctionService } from 'src/app/services/auction.service';
import { GridOption } from 'src/app/shared/components/grid-list/grid-option';
import { ButtonColumn } from 'src/app/shared/components/grid-list/models/button-column';
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
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.less'],
})
export class PublishComponent implements OnInit {
  dataList: Array<any> | undefined;
  isVisible: boolean = false;
  publishId: any;
  title: string | undefined;
  entity: any;
  isLoad: boolean = false;
  option: GridOption;
  selectedStatus: number = -1;
  publishStatusList: Array<any> = [{ text: '全部', value: -1 }].concat(PublishStatus);
  columns: Array<Column> = [];
  reload: boolean = false;
  beforeRequest = (req: RequestOption) => {
    if (this.selectedStatus > -1) {
      req.filters.push({
        field: 'Status',
        op: '$eq',
        value: this.selectedStatus,
      });
    }
    return req;
  };
  constructor(private auctionSvc: AuctionService, private nzMsgSvc: NzMessageService, private router: Router) {}

  ngOnInit() {
    this.option = new GridOption({
      url: '/api/Auction/Publish/GetList',
      scroll: { x: '750px' },
    });

    this.columns = [
      new StringColumn({ display: '标题', field: 'Title', width: '400px', isEllipsis: true, inSearch: false }),
      new StringColumn({ display: '物品名称', width: '200px', field: 'Material.Name' }),
      new StringColumn({ display: '物品摘要', width: '400px', field: 'Excerpt', isEllipsis: true, inSearch: false }),
      new StringColumn({ display: '物资流水号', field: 'SerialNumber', width: '120px', inSearch: false }),
      new DatetimeColumn({ display: '生产日期', field: 'Material.ProduceDate', width: '120px', inSearch: false, formatString: 'YYYY/MM/DD' }),
      new DatetimeColumn({ display: '有效日期', field: 'Material.EffectiveDate', width: '120px', inSearch: false, formatString: 'YYYY/MM/DD' }),
      new IntColumn({ display: '挂网数量', field: 'Quantity', width: '90px', inSearch: false }),
      new IntColumn({ display: '已售数量', field: 'Material.SoldQuantity', width: '90px', inSearch: false }),
      new IntColumn({ display: '剩余数量', field: 'Material.RemainQuantity', width: '90px', inSearch: false }),
      new FloatColumn({ display: '官方价格(元)', field: 'OfficialPrice', width: '130px', inSearch: false }),
      new FloatColumn({ display: '京东(元)', field: 'JDPrice', width: '120px', inSearch: false }),
      new FloatColumn({ display: '天猫(元)', field: 'TmallPrice', width: '120px', inSearch: false }),
      new FloatColumn({ display: '淘宝(元)', field: 'TaoBaoPrice', width: '120px', inSearch: false }),
      new FloatColumn({ display: '其他网购平台(元)', field: 'OtherPrice', width: '150px', inSearch: false }),
      new FloatColumn({ display: '评估价(元)', field: 'EvaluationPrice', width: '120px', inSearch: false }),
      new FloatColumn({ display: '起拍价(元)', field: 'StartPrice', width: '120px', inSearch: false }),
      new IntColumn({ display: '加价幅度(元)', field: 'MarkUp', width: '120px', inSearch: false }),
      // new StringColumn({ display: '物资状态', field: 'Status', width: '100px', inSearch: false }),
      new EnumColumn({
        display: '物资状态',
        field: 'Status',
        width: '100px',
        inSearch: false,
        enumOptions: () =>
          of(
            new EnumOptions({
              options: PublishStatus,
            })
          ),
      }),
      // new ButtonColumn({
      //   width: '230px',
      //   right: '0px',
      //   onlyText: true,
      //   buttons: new Array<ButtonsOptions>(
      //     new ButtonsOptions({
      //       title: '竞价记录',
      //       icon: 'fas fa-edit',
      //       callBack: (entity) => {
      //         this.bidRecord(entity.Id);
      //       },
      //     }),
      //     new ButtonsOptions({
      //       title: '浏览记录',
      //       icon: 'fas fa-edit',
      //       callBack: (entity) => {
      //         this.viewRecord(entity.Id);
      //       },
      //     }),
      //     new ButtonsOptions({
      //       title: '查看',
      //       icon: 'fas fa-edit',
      //       visible: (entity, observer) => {
      //         if (entity.Status >= 2) {
      //           return observer.next(true);
      //         } else {
      //           return observer.next(false);
      //         }
      //       },
      //       callBack: (entity) => {
      //         this.editMaterialPublish(entity);
      //       },
      //     }),
      //     new ButtonsOptions({
      //       title: '编辑',
      //       icon: 'fas fa-edit',
      //       visible: (entity, observer) => {
      //         if (entity.Status < 2) {
      //           return observer.next(true);
      //         } else {
      //           return observer.next(false);
      //         }
      //       },
      //       callBack: (entity) => {
      //         this.editMaterialPublish(entity);
      //       },
      //     }),
      //     new ButtonsOptions({
      //       title: '删除',
      //       icon: 'fas fa-edit',
      //       visible: (entity, observer) => {
      //         if (entity.Status < 1) {
      //           return observer.next(true);
      //         } else {
      //           return observer.next(false);
      //         }
      //       },
      //       callBack: (entity) => {
      //         this.modal.confirm({
      //           nzTitle: '确定删除该拍卖物资的发布吗？',
      //           nzOnOk: () => {
      //             this.deleteItem(entity.Id);
      //           },
      //           nzOnCancel: () => {},
      //         });
      //       },
      //     })
      //   ),
      // }),
      new ButtonColumn({
        display: '操作',
        field: 'Operate',
        onlyText: true,
        width: '90px',
        right: '0px',
        inSearch: false,
        // buttons: new Array<ButtonsOptions>(
        //   new ButtonsOptions({
        //     icon: 'fas fa-edit',
        //     callBack: (entity) => {
        //       this.editItem(entity);
        //     },
        //   })
        // ),
      }),
    ];
  }

  edit(entity?: any): void {
    if (!entity?.Id) {
      this.title = '新增用户信息';
    } else {
      this.title = '编辑用户信息';
    }
    this.router.navigate(['/home/auction/publish-edit', { publishId: entity?.Id ? entity?.Id : 0, status: entity?.Status }]);
  }

  handleOk(): void {}

  handleCancel(): void {
    this.isVisible = false;
  }

  delete(id: any) {
    this.auctionSvc.publish.detele(id).subscribe((item) => {
      this.nzMsgSvc.success('删除成功！');
      this.reload = true;
    });
  }

  selectedChange(ev) {
    this.reload = true;
  }
}
