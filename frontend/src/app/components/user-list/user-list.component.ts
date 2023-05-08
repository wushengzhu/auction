import { AuctionService } from '../../services/auction.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserEditComponent } from 'src/app/shared/components/user-edit/user-edit.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GridOption } from 'src/app/shared/components/grid-list/grid-option';
import { Column } from 'src/app/shared/components/grid-list/models/column';
import { StringColumn } from 'src/app/shared/components/grid-list/models/string-column';
import { DatetimeColumn } from 'src/app/shared/components/grid-list/models/datetime-column';
import { ButtonColumn } from 'src/app/shared/components/grid-list/models/button-column';
import { EnumColumn } from 'src/app/shared/components/grid-list/models/enum-column';
import { of } from 'rxjs';
import { EnumOptions } from 'src/app/shared/components/grid-list/models/enum-options';
import { Util } from 'src/app/shared/utills/utils';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.less'],
})
export class UserListComponent implements OnInit {
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
  // @Output() r
  @ViewChild(UserEditComponent) userEditCpt: UserEditComponent;
  constructor(
    private auctionSvc: AuctionService,
    private nzMsgSvc: NzMessageService
  ) {}

  ngOnInit() {
    this.option = new GridOption({
      url: '/api/Auction/User/GetList',
    });
    this.columns = [
      new StringColumn({
        display: '用户名',
        field: 'Account',
        width: '120px',
        isEllipsis: true,
      }),
      new StringColumn({
        display: '昵称',
        field: 'Account',
        width: '150px',
        isEllipsis: true,
      }),
      new EnumColumn({
        display: '性别',
        field: 'Gender',
        width: '100px',
        inSearch:false,
        enumOptions: () =>
          of(
            new EnumOptions({
              options: [
                { value: true, text: '男' },
                { value: false, text: '女' },
              ],
            })
          ),
      }),
      new EnumColumn({
        display: '用户类型',
        field: 'Category',
        width: '120px',
        inSearch:false,
        enumOptions: () =>
          of(
            new EnumOptions({
              options: [
                { value: 0, text: '超级管理员' },
                { value: 1, text: '普通用户' },
              ],
            })
          ),
      }),
      new DatetimeColumn({
        display: '创建时间',
        field: 'CreateTime',
        width: '150px',
      }),
      new ButtonColumn({
        display: '操作',
        field: '',
        width: '70px',
        template: 'operate',
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
    this.userEditCpt.save().subscribe((item) => {
      if (item) {
        this.isLoad = true;
        this.isVisible = false;
        this.reloadUserList();
      }
    });
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
