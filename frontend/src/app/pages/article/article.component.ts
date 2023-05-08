import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuctionService } from 'src/app/services/auction.service';
import { Util } from 'src/app/shared/utills/utils';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.less'],
})
export class ArticleComponent implements OnInit {
  dataList: Array<any>;
  isVisible: boolean = false;
  articleId: string = '';
  title: string;
  entity: any;
  isLoad: boolean = false;
  scroll = { x: '300px' };
  totalData: number = 0;
  pageSize: number = 5;
  curPage: number = 1;
  // @Output() r
  // @ViewChild(UserEditComponent) userEditCpt: UserEditComponent;
  constructor(
    private auctionSvc: AuctionService,
    private nzMsgSvc: NzMessageService,
    private router: Router
  ) {}

  ngOnInit() {
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
      .userList(this.pageSize, this.curPage)
      .subscribe((resp) => {
        // this.dataList = resp.Data.filter((item) => item.Status > -1);
        // this.totalData = resp.Total;
        // this.isLoad = false;
      });
  }

  pageIndexChange(event) {
    this.curPage = event;
    this.isLoad = true;
    this.reloadUserList();
  }

  editArticleInfo(id?: string): void {
    this.isVisible = true;
    if (Util.isUndefinedOrNull(id)) {
      this.title = '新增用户信息';
      this.articleId = '';
    } else {
      this.title = '编辑用户信息';
      this.articleId = id;
    }
    this.router.navigate(['/home/article/edit']);
  }

  handleOk(): void {
    // this.userEditCpt.save().subscribe((item) => {
    //   if (item) {
    //     this.isLoad = true;
    //     this.isVisible = false;
    //     this.reloadUserList();
    //   }
    // });
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  deleteUser(id: string) {
    this.auctionSvc.userPage.detele(id).subscribe((item) => {
      this.reloadUserList();
      this.nzMsgSvc.success('删除成功！');
    });
  }
}
