import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, ReplaySubject } from 'rxjs';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { AuctionService } from 'src/app/services/auction.service';
import { Util } from '../../utills/utils';
import md5 from 'js-md5';
import { HttpClient } from '@angular/common/http';
import pinyin from 'pinyin';
import { ResetPwdComponent } from '../reset-pwd/reset-pwd.component';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.less'],
})
export class UserEditComponent implements OnInit {
  form: FormGroup;
  category = 1;
  imgBase64: any;
  imgUrl: string = '';
  isReadOnly: boolean = false;
  @Input() type: string = '';
  @Input() userId: string = '';
  @Input() entity: any;
  @ViewChild('uploadImgInput', { read: ElementRef, static: true })
  uploadImgEle!: ElementRef;
  @ViewChild(HomeComponent)
  homeCpt!: HomeComponent;
  passwordVisible: boolean = false;
  isVisible: boolean = false;
  @ViewChild('resetPwdTpl', { static: false }) resetPwdTpl: ResetPwdComponent;
  constructor(private fb: FormBuilder, private auctionSvc: AuctionService, private nzMsgSvc: NzMessageService, private http: HttpClient) {
    this.form = this.fb.group({
      Id: [null],
      Account: [null, [Validators.required]],
      UserName: [null, [Validators.required, Validators.pattern(/^[\u4e00-\u9fa5]{0,10}/)]],
      Password: [null, Validators.required],
      NickName: [null],
      Email: [null, Validators.email],
      Pic: [null],
      Image: [null],
      Category: [1],
      Gender: [true],
    });
  }

  ngOnInit() {
    if (this.entity) {
      this.form.patchValue(this.entity);
    }
    if (this.type === 'edit' && !Util.isUndefinedOrNull(this.userId)) {
      this.isReadOnly = true;
    }
    if (!Util.isUndefinedOrNullOrWhiteSpace(this.userId)) {
      this.auctionSvc.userPage.getById(this.userId).subscribe((res: any) => {
        this.form.patchValue(res.data);
        this.imgUrl = res.data?.Image;
        this.category = res.data?.Category;
      });
    } else {
      this.form.patchValue(null);
    }
  }

  changeImg() {
    let that = this;
    const reader = new FileReader();
    reader.readAsDataURL(this.uploadImgEle.nativeElement.files[0]);
    const imgPath = this.uploadImgEle.nativeElement.files[0];
    console.log(imgPath);
    reader.onload = function () {
      that.imgBase64 = this.result; // 拿到的是base64格式的图片
      that.storageUploadImg(imgPath.name, that.imgBase64);
    };
  }

  storageUploadImg(imgName: any, fileData: any) {
    this.auctionSvc.file.image(imgName, fileData).subscribe((item: any) => {
      if (item) {
        this.imgUrl = item.data;
        this.nzMsgSvc.success(item?.msg);
      }
    });
  }

  uploadImg() {
    this.uploadImgEle.nativeElement.click();
  }

  save(): Observable<boolean> {
    let sub = new ReplaySubject<boolean>();
    for (const i in this.form.controls) {
      if (this.form.controls.hasOwnProperty(i)) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
      }
    }

    if (this.form.valid) {
      let formValue = {};
      if (this.entity) {
        formValue = Object.assign({}, this.form.value, this.entity);
      } else {
        formValue = Object.assign({}, this.form.value, {
          Image: this.imgUrl,
          Category: this.category,
          Password: md5(this.form.controls['Password'].value),
        });
      }
      this.auctionSvc.userPage.save(formValue).subscribe((resb: any) => {
        if (+resb.Code === 200) {
          this.nzMsgSvc.success(resb.Message);
        } else {
          this.nzMsgSvc.error(resb.Message);
        }
        sub.next(true);
        sub.complete();
      });
    }
    return sub;
  }

  cancel() {
    history.back();
  }

  userNameChange(ev) {
    if (ev && !Util.isUndefinedOrNullOrWhiteSpace(ev)) {
      const regUserName = /^[\u4e00-\u9fa5]{0,10}/;
      if (regUserName.test(ev)) {
        const cToe = pinyin(ev, {
          style: pinyin.STYLE_FIRST_LETTER,
        });
        this.form.controls['Account'].patchValue(cToe.join(''));
      }
    } else {
      this.form.controls['Account'].patchValue('');
    }
  }

  resetPwd() {
    this.resetPwdTpl.save().subscribe((item) => {});
  }
}
