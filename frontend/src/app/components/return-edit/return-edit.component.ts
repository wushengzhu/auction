import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Injector, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form/form-label.component';
import { DatePipe } from '@angular/common';
import { Util } from 'src/app/shared/utills/utils';
import { AuctionService } from 'src/app/services/auction.service';

@Component({
  selector: 'app-return-edit',
  templateUrl: './return-edit.component.html',
  styleUrls: ['./return-edit.component.less'],
  providers: [DatePipe],
})
export class ReturnEditComponent  implements OnInit, OnDestroy {
  @Input() set returnId(value) {
    if (Util.isUndefinedOrNull(this._returnId)) {
      this._returnId = value;
    }
  }
  get returnId() {
    return this._returnId;
  }
  @Input() publishName: string;
  @Input() bidRecord: any;
  formCode: string;
  _search$ = new Subject<string>();
  materialList = [];
  dataSource = [];
  model: any;
  userInfo: any;
  isSaving: boolean;
  tipIcon: NzFormTooltipIcon = {
    type: 'info-circle',
    theme: 'twotone',
  };
  creator: string;
  creatorId: string;
  _returnId: any;
  form:FormGroup;

  constructor(private fb:FormBuilder,private auctionSvc: AuctionService, private mesSvc: NzMessageService, private modalRef: NzModalRef, private datePipe: DatePipe) {

  }

  ngOnInit() {
    this.formCode = 'auction$return';
    this.form = this.fb.group({
      Id: [null],
      PublishId: [null, [Validators.required]],
      UserId: [null],
      UserName: [null, [Validators.required]],
      OperateTime: [null],
      Reason: [null, [Validators.maxLength(500)]],
      'Material.Name': [null],
    });
    // 只有新增的时候做请求获取列表数据，否则只显示当前的物资
    if (this.returnId <= 0 || Util.isUndefinedOrNull(this.returnId)) {
      this.auctionSvc.publish
        .getList()
        .pipe(map((c) => c.Data.Data))
        .subscribe((resp) => {
          if (Util.isArray(resp)) {
            resp.forEach((p) => {
              if (p.Status === 4 || p.Status === 6) {
                this.materialList.push(p);
                this.dataSource.push(p);
              }
            });
          }
          this.getSearchValue();
        });
    }

    const curentTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm');
    this.getFormControl('OperateTime').setValue(curentTime);
    if (this.returnId > 0) {
      this.auctionSvc.back.getById(this.returnId).subscribe((r:any) => {
        this.model = r.Data;
        if (this.model) {
          this.getFormData(this.model);
          this.getFormControl('Material.Name').setValue(this.publishName);
        }
      });
    }
  }

  getFormControl(label:string){
    return this.form.controls[label];
  }

  getSearchValue() {
    // rxjs实现防抖节流查询
    this._search$.pipe(debounceTime(300)).subscribe((resp) => {
      if (!Util.isUndefinedOrNullOrWhiteSpace(resp)) {
        this.materialList = [...this.dataSource.filter((item) => item.SerialNumber.indexOf(resp) !== -1)];
      } else {
        this.materialList = [...this.dataSource];
      }
    });
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

  ngOnDestroy() {
    if (this._search$) {
      this._search$.unsubscribe();
    }
  }

  selectUser(users) {
    this.userInfo = users[0];
    this.form.controls['UserName'].patchValue(this.userInfo.Name);
  }

  publishIdChange(e) {
    if (this.materialList.length > 0) {
      const bid = this.materialList.filter((item) => item.Id === e)[0];
      if (!Util.isUndefinedOrNull(bid?.BidRecord)) {
        this.getFormControl('UserName').patchValue(bid.BidRecord.UserName);
        this.getFormControl('UserId').patchValue(bid.BidRecord.UserId);
      }
    }
  }

  onMaterialChange(event) {
    /**
     * 允许编辑，填空类型，组件加载完毕
     */
    this._search$.next(event);
  }


  save() {
    if (this.form.valid) {
      const model = this.form.value;
      if (!Util.isUndefinedOrNull(this.userInfo)) {
        model.DepName = this.userInfo['Department'].Name;
        model.UserCode = this.userInfo.Code;
        model.UserId = this.userInfo.Id;
        model.DepPath = this.userInfo['Department'].ParentId + this.userInfo['Department'].Id + '';
      }
      model.Operator = this.creator;
      model.OperatorId = this.creatorId;
      this.auctionSvc.back.save(model).subscribe((r:any) => {
        this._returnId = r.Data;
          this.mesSvc.success('保存成功');
      });
    } else {
      this.mesSvc.error('请检查表单项，确认无误后再提交保存');
    }
  }

  cancel() {
    this.modalRef.close(false);
  }
}
