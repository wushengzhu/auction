import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, ReplaySubject } from 'rxjs';
import { AuctionService } from 'src/app/services/auction.service';
import { HttpClient } from '@angular/common/http';
import pinyin from 'pinyin';
import { Util } from 'src/app/shared/utills/utils';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-material-edit',
  templateUrl: './material-edit.component.html',
  styleUrls: ['./material-edit.component.less'],
})
export class MaterialEditComponent implements OnInit {
  @Input() materialId: any;
  @Input() entity: any;
  form: FormGroup;
  constructor(private fb: FormBuilder, private auctionSvc: AuctionService, private mesSvc: NzMessageService, private drawerRef: NzDrawerRef) {
    this.form = this.fb.group({
      Name: [null, [Validators.required]],
      SerialNumber: [null],
      Category: [null, [Validators.required]],
      WarehouseCategory: [null, [Validators.required]],
      ProduceDate: [null],
      EffectiveDate: [null],
      GuaranteePeriod: [null],
      Quantity: [null, [Validators.required]],
      UserId: [null],
      Detail: [null],
      DealWithMethod: [null],
      Remark: [null],
      AllowAuction: [true],
      SoldQuantity: [null],
      RemainQuantity: [null],
      TurnInDate: [new Date(), [Validators.required]],
      Reason: [null],
      Operator: [null],
      CreateTime: [null],
      ImgArr: [null],
      AttachArr: [null],
    });
  }

  ngOnInit() {
    if (this.entity) {
      this.form.patchValue(this.entity);
    }
  }

  changeQuantity(event) {
    if (event) {
      this.getFormControl('RemainQuantity').setValue(event);
    }
  }

  getFormControl(label: string) {
    return this.form.controls[label];
  }

  save() {
    for (const i in this.form.controls) {
      if (this.form.controls.hasOwnProperty(i)) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
      }
    }

    if (this.form.valid) {
      let formValue = this.form.value;
      if (this.materialId) {
        formValue = Object.assign({}, this.entity, this.form.value);
      }
      this.auctionSvc.material.save(formValue).subscribe((resb: any) => {
        this.mesSvc.success('保存成功！');
        this.drawerRef.close(true);
      });
    } else {
      this.mesSvc.error('请按照提示进行表单修改！');
    }
  }

  cancel() {
    this.drawerRef.close(false);
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
}
