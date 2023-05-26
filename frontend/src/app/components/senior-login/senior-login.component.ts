import { AuctionService } from '../../services/auction.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import md5 from 'js-md5';
import { IpInfoService } from 'src/app/services/ip-info.service';

@Component({
  selector: 'app-senior-login',
  templateUrl: './senior-login.component.html',
  styleUrls: ['./senior-login.component.less'],
})
export class SeniorLoginComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  isLoad: boolean;
  passwordVisible: boolean = false;
  @ViewChild('pwdRef', { read: ElementRef, static: true }) pwdEle: ElementRef;
  @ViewChild('indicate') indicate: ElementRef;
  @ViewChild('toggle') toggle: ElementRef;
  @ViewChild('container') container: ElementRef;
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

  ngAfterViewInit(): void {
    // 获取页面中所有的输入框元素
    const inputs = document.querySelectorAll('.input-field');
    // 获取页面中所有的切换按钮元素
    const toggle_btn = document.querySelectorAll('.toggle');
    // 获取页面中的main元素
    const main = document.querySelector('login-container');
    // 获取页面中所有的小圆点元素
    const bullets = document.querySelectorAll('.bullets span');
    // 获取页面中所有的图片元素
    const images = document.querySelectorAll('.image');

    // 为所有输入框元素添加获取焦点和失去焦点的事件监听器
    inputs.forEach((inp: any) => {
      inp.addEventListener('focus', () => {
        inp.classList.add('active');
      });
      inp.addEventListener('blur', () => {
        if (inp.value != '') return;
        inp.classList.remove('active');
      });
    });

    // 为所有切换按钮元素添加点击事件监听器
    toggle_btn.forEach((btn) => {
      btn.addEventListener('click', () => {
        main.classList.toggle('sign-up-mode');
      });
    });

    // 定义moveSlider函数，用于实现图片轮播和文本滑动的效果
    function moveSlider() {
      // 获取当前点击的小圆点的索引值
      let index = this.dataset.value;
      // 根据索引值获取对应的图片元素
      let currentImg = document.querySelector(`.img-${index}`);
      // 将其他图片元素的show类名移除，将当前图片元素添加show类名
      images.forEach((img) => {
        img.classList.remove('show');
      });
      currentImg.classList.add('show');
      // 获取文本滑动元素
      const textSlider = document.querySelector('.text-group') as HTMLElement;
      // 将文本滑动元素的transform属性设置为当前索引值对应的位置
      textSlider.style.transform = `translateY(${-(index - 1) * 2.2}rem)`;
      // 将其他小圆点的active类名移除，将当前小圆点添加active类名
      bullets.forEach((bullet) => {
        bullet.classList.remove('active');
      });
      this.classList.add('active');
    }

    // 为所有小圆点元素添加点击事件监听器
    bullets.forEach((bullet) => {
      bullet.addEventListener('click', moveSlider);
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
      this.auctionSvc.loginPage.login(formValue).subscribe({
        next: (resb: any) => {
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
        },
        error: (err) => {
          this.nzMsgSvc.success(err.message);
        },
      });
    }
  }
}
