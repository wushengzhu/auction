import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, ReplaySubject } from 'rxjs';
import { AuctionService } from 'src/app/services/auction.service';
import { HttpClient } from '@angular/common/http';
import pinyin from 'pinyin';
import { Util } from 'src/app/shared/utills/utils';

@Component({
  selector: 'app-material-edit',
  templateUrl: './material-edit.component.html',
  styleUrls: ['./material-edit.component.less'],
})
export class MaterialEditComponent implements OnInit {
  _materialId: any;
  @Input() set materialId(val) {
    if (val) {
      this._materialId = val;
      this.getData();
    }
  }
  get materialId() {
    return this._materialId;
  }
  @Output() materialIdChange: EventEmitter<boolean> = new EventEmitter(); // reload双重绑定
  form: FormGroup;
  materialInfo: any;
  isVisible: boolean = false;
  warehouseCategory: Array<any> = [];
  constructor(private fb: FormBuilder, private auctionSvc: AuctionService, private nzMsgSvc: NzMessageService, private http: HttpClient) {
    this.form = this.fb.group({
      Id: [null],
      Name: [null,[Validators.required]],
      SerialNumber: [null],
      Category: [null,[Validators.required]],
      WarehouseCategory: [null,[Validators.required]],
      ProduceDate: [null],
      EffectiveDate: [null],
      GuaranteePeriod: [null],
      Quantity: [null,[Validators.required]],
      UserId: [null],
      Detail: [null],
      DealWithMethod: [null],
      Remark: [null],
      AllowAuction: [true],
      SoldQuantity: [null],
      RemainQuantity: [null],
      TurnInDate: [new Date(),[Validators.required]],
      Reason: [null],
      Operator: [null],
      CreateTime: [null],
      ImgArr: [null],
      AttachArr: [null],
    });
  }

  ngOnInit() {
    this.auctionSvc.dict.getList(1, 0, 'WarehouseCategory').subscribe((item) => {
      this.warehouseCategory = item.Data.filter((data) => data.ParentId);
    });
  }

  changeQuantity(event){
    if(event){
      this.getFormControl('RemainQuantity').setValue(event);
    }
  }

  getFormControl(label:string){
    return this.form.controls[label];
  }

  getData() {
    if (!Util.isUndefinedOrNullOrWhiteSpace(this.materialId)) {
      this.auctionSvc.material.getById(this.materialId).subscribe((res: any) => {
        this.form.patchValue(res.Data);
        this.materialInfo = res.Data;
      });
    } else {
      this.form.patchValue(null);
    }
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
      let formValue = this.form.value;
      if (this.materialId) {
        formValue = Object.assign({}, this.form.value, this.materialInfo);
      }
      this.auctionSvc.material.save(formValue).subscribe((resb: any) => {
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
}
