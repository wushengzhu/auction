import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuctionService } from 'src/app/services/auction.service';
import { StorageService } from 'src/app/services/storage.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ResetPwdComponent } from 'src/app/shared/components/reset-pwd/reset-pwd.component';
import { IpInfoService } from 'src/app/services/ip-info.service';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {
  isCollapsed = false;
  layout: Array<any>;
  userInfo: any;
  isVisible: boolean = false;
  curRoute: any;
  @ViewChild('resetPwdTpl', { static: false }) resetPwdTpl: ResetPwdComponent;
  constructor(
    private http: HttpClient,
    private planform: PlatformLocation,
    private storageSvc: StorageService,
    private authService: AuthService,
    private router: Router,
    private ipInfoSvc: IpInfoService
  ) {
    this.router.events.subscribe((route) => {
      if (route instanceof NavigationEnd) {
        // this.curRoute = route.url.substring(1);
        if (route.url === '/home') {
          this.curRoute = route.url + '/index';
        } else {
          this.curRoute = route.url;
        }
      }
    });
  }

  ngOnInit() {
    this.http.get('../../../assets/layout.json').subscribe((resb: any) => {
      this.layout = resb.menu;
    });
    if (this.storageSvc.get('userInfo')) {
      this.userInfo = this.storageSvc.get('userInfo');
    }
  }

  updatePassword() {
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
  }

  handleOk() {
    this.resetPwdTpl.save().subscribe((item) => {
      // if(!item){
      //   this.nzMsgSvc.error('密码不一致，请重新输入！');
      // }
    });
  }

  outLogin() {
    this.authService.loginOut();
    this.ipInfoSvc.saveRecord('退出登录').subscribe();
  }

  personInfo() {
    this.router.navigate(['/home/person/info']);
  }

  isOpen(routeObj: any = {}) {
    const jsonObj = JSON.stringify(routeObj);
    if (jsonObj.includes(this.curRoute)) {
      return true;
    }
    return false;
  }

  activeRoute(route) {
    if (this.curRoute.includes(route) || this.curRoute === route) {
      return true;
    }
    return false;
  }
}
