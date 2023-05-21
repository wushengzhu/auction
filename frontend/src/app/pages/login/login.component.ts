import { AuctionService } from '../../services/auction.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import md5 from 'js-md5';
import { IpInfoService } from 'src/app/services/ip-info.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  isLoad: boolean;
  passwordVisible: boolean = false;
  @ViewChild('pwdRef', { read: ElementRef, static: true }) pwdEle: ElementRef;
  constructor(
    private fb: FormBuilder,
    private auctionSvc: AuctionService,
    private nzMsgSvc: NzMessageService,
    private authService: AuthService,
    private router: Router,
    private storageSvc: StorageService,
    private ipInfoSvc: IpInfoService
  ) {
    this.form = this.fb.group({
      Account: [null, [Validators.required]],
      Password: [null, [Validators.required]],
    });
  }

  ngOnInit() {}

  focuPwd() {
    this.pwdEle.nativeElement.focus();
  }

  saveForm() {
    this.isLoad = true;
    for (const i in this.form.controls) {
      if (this.form.controls.hasOwnProperty(i)) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
      }
    }
    if (this.form.valid) {
      const formValue = this.form.value;
      formValue.Password = md5(this.form.controls['Password'].value);
      this.auctionSvc.loginPage.login(formValue).subscribe((resb: any) => {
        // “iat”（于发布）索赔确定了JWT发布的时间。该声明可用于确定JWT的年龄。其值必须是包含NumericDate值的数字。此声明的使用是可选的。
        // “exp”：s为单位，（到期时间）声明标识了到期时间，在此日期或之后不得接受JWT进行处理。“exp”索赔的处理要求当前日期/时间必须早于“exp”索赔中列出的到期日期/时间。
        const token = resb?.Token;
        localStorage.setItem('token', token);
        this.auctionSvc.token = token;
        if (resb.Code === 200) {
          this.authService.login().subscribe(() => {
            if (this.authService.isLoginIn) {
              const userId = resb?.Data;
              this.storageSvc.loadUserInfo(userId).subscribe(() => {
                const redirectUrl = this.authService.redirectUrl || '/home/index'; // 防止用户直接在地址栏输入造成的redirectUrl为空的错误
                // 跳转回重定向路径
                this.router.navigate([redirectUrl]);
                this.isLoad = false;
                this.nzMsgSvc.success(resb.Message);
              });
              this.ipInfoSvc.saveRecord('登录成功').subscribe();
            }
          });
        } else {
          this.isLoad = false;
          this.ipInfoSvc.saveRecord('登录失败').subscribe();
          this.auctionSvc.loginRecord.save(formValue).subscribe();
          this.nzMsgSvc.error(resb.Message);
        }
      },err=>{
        this.nzMsgSvc.success(err.message);
      });
    }
  }
}
