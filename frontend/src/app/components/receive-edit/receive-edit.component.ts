import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Component, OnInit, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { AuctionService } from 'src/app/services/auction.service';
import { Util } from 'src/app/shared/utills/utils';

@Component({
  selector: 'app-receive-edit',
  templateUrl: './receive-edit.component.html',
  styleUrls: ['./receive-edit.component.less'],
})
export class ReceiveEditComponent implements OnInit {
  @Input() publishId: any;
  @Input() publishName: string;
  @Input() ids: Array<string>;
  @Input() sumPrice: number;
  @Input() userName: string;
  @Input() userId: string;
  formCode: string;
  dataSource = [];
  materialList = [];
  model: any;
  userInfo: any;
  options = [];
  form: FormGroup;
  constructor(private fb: FormBuilder, private auctionSvc: AuctionService, private mesSvc: NzMessageService, private modalRef: NzModalRef) {}

  ngOnInit() {
    this.formCode = 'auction$receive';
    this.form = this.fb.group({
      Id: [null],
      UserName: [null, Validators.required],
      UserId: [null],
      UserCode: [null],
      DepPath: [null],
      DepName: [null],
      OperateTime: [null, [Validators.required]],
      PaymentMethod: [null, [Validators.required, Validators.maxLength(50)]],
      Remark: [null, [Validators.maxLength(500)]],
      'Publish.Material.Name': [this.publishName],
    });
    // if (this.publishId > 0) {
    //   this.auctionSvc.receive.getItem(this.publishId).subscribe((r) => {
    //     this.model = r.Data;
    //     // this.dynamicData = {
    //     //   value: JsonUtils.parse(r.Data.Dynamic),
    //     // };
    //     if (this.model) {
    //       this.getFormData(this.model);
    //     }
    //   });
    // }
    this.getFormControl('UserName').setValue(this.userName);
  }

  getFormControl(con) {
    return this.form.controls[con];
  }

  getFormData(model: any) {
    // tslint:disable-next-line:forin
    for (const prop in model) {
      if (typeof model[prop] === 'object') {
        const obj = model[prop];
        // tslint:disable-next-line:forin
        for (const p in obj) {
          const control = this.form.controls[`${prop}.${p}`];
          if (control) {
            control.patchValue(obj[p]);
          }
        }
      } else {
        const control = this.form.controls[prop];
        if (control) {
          control.patchValue(model[prop]);
        }
      }
    }
  }

  selectUser(users) {
    this.userInfo = users[0];
    this.form.controls['UserName'].patchValue(this.userInfo.Name);
  }

  save() {
    if (this.form.valid) {
      let model = this.form.value;
      if (!Util.isUndefinedOrNull(this.userInfo)) {
        model.DepName = this.userInfo['Department'].Name;
        model.UserCode = this.userInfo.Code;
        model.UserId = this.userInfo.Id;
        model.DepPath = this.userInfo['Department'].ParentId + this.userInfo['Department'].Id + '';
      } else {
        model.UserId = this.userId;
      }
      model.publishIds = this.ids;
      // 批量保存
      // this.auctionSvc.receive.saveMore(model).subscribe((res) => {
      //   this.mesSvc.success('保存成功');
      //   this.modalRef.close(true);
      // });
    } else {
      this.mesSvc.error('请检查表单项，确认无误后再提交保存');
    }
  }

  cancel() {
    this.modalRef.close(false);
  }
}
