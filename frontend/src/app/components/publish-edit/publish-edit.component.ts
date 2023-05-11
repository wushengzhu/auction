import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import moment from 'moment';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DOCUMENT, DatePipe } from '@angular/common';
import { AuctionService } from 'src/app/services/auction.service';
import { Util } from 'src/app/shared/utills/utils';
import { NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-publish-edit',
  templateUrl: './publish-edit.component.html',
  styleUrls: ['./publish-edit.component.less'],
  providers: [DatePipe],
})
export class PublishEditComponent implements OnInit {
  @Input() noticeId: any;
  publishId: any;
  materialId: any;
  status: number = 0;
  noticeList: any[] = [];
  materialList: any[] = [];
  sumPrice: number = 0;
  startPrice: number;
  evalPrice: number;
  isReadOnly: boolean = false;
  model: any;
  countResult = 5;
  title: string;
  isSaving: boolean = false;
  reload: boolean = false;
  isSetStartPrice: boolean = true;
  form: FormGroup;
  fileList: Array<any> = [];
  details;
  /**
   * 富文本
   */
  editorContent;

  setDetails(details: string): void {
    this.editorContent = details;
  }
  imagesList: Array<any> = [];
  materialObjectId: any;
  constructor(private fb: FormBuilder, private router: Router, private datePipe: DatePipe, private auctionSvc: AuctionService, private mesSvc: NzMessageService, private route: ActivatedRoute) {}

  validateStartTimes = (fc: FormControl) => {
    const value = fc.value;
    if (Util.isUndefinedOrNullOrWhiteSpace(value)) {
      return { required: true };
    }
    const endTime = this.form.controls['EndTime'].value;
    const _diff = this.calcTimeGap(value, endTime, 'start');
    if (_diff && !Util.isUndefinedOrNullOrWhiteSpace(endTime)) {
      return { validateStartTimes: true };
    }
    // tslint:disable-next-line:semicolon

    return null;
  };

  validateEndTimes = (fc: FormControl) => {
    const value = fc.value;
    if (Util.isUndefinedOrNullOrWhiteSpace(value)) {
      return { required: true };
    }
    // const startTime = this.form.controls['StartTime'].value;
    const diff = this.calcTimeGap(moment(), value, 'end');
    if (diff && !Util.isUndefinedOrNullOrWhiteSpace(value)) {
      return { validateEndTimes: true };
    }
    // tslint:disable-next-line:semicolon

    return null;
  };

  validateQuantity = (fc: FormControl) => {
    const value = fc.value;
    if (Util.isUndefinedOrNullOrWhiteSpace(value)) {
      return { required: true };
    }
    const remain = this.getFormControl('MaterialRemainQuantity').value;
    if (value > remain) {
      return { validateQuantity: true };
    }
    // tslint:disable-next-line:semicolon

    return null;
  };

  ngOnInit() {
    this.initFormData();
    this.route.params.subscribe((params: Params) => {
      if (!Util.isUndefinedOrNull(params)) {
        this.publishId = +params['publishId'];
        this.status = parseInt(params['status'], 10) ? parseInt(params['status'], 10) : 0;
      }
      if (+this.publishId > 0) {
        this.title = '新增物资发布';
      } else {
        this.title = '编辑物资发布';
      }
    });
    // this.auctionSvc.publish.getList().subscribe((r) => {
    //   // this.noticeList = r.Data.Data.filter((item) => item.Status === 1);
    //   this.noticeList = r.Data.Data;
    //   // 新增默认带出最新公告
    //   // if (+this.publishId === 0) {
    //   //   this.form.controls['NoticeId'].setValue(this.noticeList[0].Id);
    //   // }
    // });

    this.auctionSvc.material.getList().subscribe((res) => {
      const data = res.Data;
      if (data && data?.length > 0) {
        this.materialList = data.filter((item) => item.AllowAuction);
      }
    });

    if (+this.publishId > 0) {
      this.isSetStartPrice = false;
      this.auctionSvc.publish.getById(this.publishId).subscribe((r: any) => {
        this.model = r.Data;
        // if (this.model.Id > 0) {
        this.getFormData(this.model);
        // 如果平台价格都为空，初始化时触发了回调函数，如果加价幅度是有值的是赋值不了的
        this.getFormControl('MarkUp').patchValue(this.model?.MarkUp);
        if (!Util.IsNullOrEmpty(this.model?.Material)) {
          this.materialId = r.Data?.Material[0]?.Id;
          this.getFormControl('MaterialName').patchValue(r.Data?.Material[0]?.Name);
        }

        // }
      });
    } else {
      // this.auctionSvc.getSerialNumber('Publish').subscribe((r) => {
      //   this.getFormControl('SerialNumber').setValue(r.Data.SerialNumber);
      // });
    }
  }

  loadFiles(ev) {
    this.imagesList = ev;
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  getFormControl(control: string) {
    return this.form.controls[control];
  }

  importImage() {
    // if (this.materialId !== '0' && this.publishId !== '0') {
    //   this.auctionSvc.publish.materialImage(this.materialId, this.publishId).subscribe((r) => {
    //     if (r.Data) {
    //       this.reload = true;
    //       this.mesSvc.success('导入成功！');
    //     }
    //   });
    // }
  }

  // 计算时间间隔
  calcTimeGap(start, end, type: string) {
    const _start = moment(new Date(start)); // 开始时间
    const _end = moment(new Date(end)); // 结束时间
    if (type === 'start') {
      return _end.isBefore(_start);
    } else if (type === 'end') {
      return start.isSameOrAfter(_end, 'minute');
    }
  }

  setQuantityValidate() {
    this.form.controls['Quantity'].setValidators([this.validateQuantity]);
    this.form.updateValueAndValidity();
  }

  setStartValidate() {
    this.form.controls['StartTime'].setValidators([this.validateStartTimes]);
    this.form.updateValueAndValidity();
  }

  setEndValidate() {
    this.form.controls['EndTime'].setValidators([this.validateEndTimes]);
    this.form.updateValueAndValidity();
  }

  initFormData() {
    this.form = this.fb.group({
      Id: [null],
      NoticeId: [this.noticeId],
      MaterialId: [null, [Validators.required]],
      SerialNumber: [null],
      Title: [null, [Validators.required, Validators.maxLength(500)]],
      Excerpt: [null],
      OfficialPrice: [null],
      JDPrice: [null],
      TmallPrice: [null],
      TaoBaoPrice: [null],
      OtherPrice: [null],
      MarkUp: [null, [Validators.required]],
      StartPrice: [null, [Validators.required]],
      EvaluationPrice: [null, [Validators.required]],
      Quantity: [null, [Validators.required]],
      StartTime: [null, [Validators.required]],
      EndTime: [null, [Validators.required]],
      Image: [null],
      RemainTime: [null],
      Description: [null],
      DisplayToNotice: [null],
      MaterialName: [null],
      MaterialProduceDate: [null],
      MaterialEffectiveDate: [null],
      // 'Material.Remark': [null],
      MaterialSoldQuantity: [0],
      MaterialRemainQuantity: [0],
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

  materialChange(e) {
    if (this.materialList.length > 0) {
      this.materialList.forEach((item) => {
        if (item.Id === e) {
          this.getFormControl('Title').patchValue(item.Name);
          this.getFormControl('Excerpt').patchValue(item.Detail);
          // this.getFormControl('Material.Remark').patchValue(item.Remark);
          this.getFormControl('MaterialProduceDate').patchValue(item?.ProduceDate);
          this.getFormControl('MaterialEffectiveDate').patchValue(item?.EffectiveDate);
          this.getFormControl('MaterialSoldQuantity').patchValue(item?.SoldQuantity);
          this.getFormControl('MaterialRemainQuantity').patchValue(item?.RemainQuantity);
          this.materialId = item.Id;
          this.materialObjectId = item._id;
        }
      });
    }
  }

  calculatePrice() {
    const sumPrice = this.getFormControl('JDPrice').value + this.getFormControl('TmallPrice').value + this.getFormControl('TaoBaoPrice').value + this.getFormControl('OtherPrice').value;
    return sumPrice;
  }

  calculateCount() {
    let countResult = 4;
    if (Util.isUndefinedOrNullOrWhiteSpace(this.getFormControl('JDPrice').value)) {
      countResult--;
    }
    if (Util.isUndefinedOrNullOrWhiteSpace(this.getFormControl('TmallPrice').value)) {
      countResult--;
    }
    if (Util.isUndefinedOrNullOrWhiteSpace(this.getFormControl('TaoBaoPrice').value)) {
      countResult--;
    }
    if (Util.isUndefinedOrNullOrWhiteSpace(this.getFormControl('OtherPrice').value)) {
      countResult--;
    }
    return countResult;
  }

  fomatFloat(num, pos) {
    return Math.round(num * Math.pow(10, pos)) / Math.pow(10, pos);
  }

  addPriceRange = (price: number) => {
    if (price >= 1 && price < 10) {
      return 1;
    } else if (price >= 10 && price < 50) {
      return 3;
    } else if (price >= 50 && price < 100) {
      return 5;
    } else if (price >= 100 && price < 500) {
      return 10;
    } else if (price >= 500 && price < 1000) {
      return 15;
    } else if (price >= 1000) {
      return 20;
    }
    return null;
  };

  setFormValue(hasprice: boolean, startPrice?: number, evaluationPrice?: number) {
    if (hasprice) {
      // 所有平台价格不为空
      this.getFormControl('StartPrice').patchValue(startPrice);
      this.getFormControl('EvaluationPrice').patchValue(evaluationPrice);
      this.getFormControl('MarkUp').patchValue(this.addPriceRange(startPrice));
    } else {
      // 所有平台价格为空
      this.getFormControl('MarkUp').patchValue(this.addPriceRange(this.getFormControl('StartPrice').value));
      this.getFormControl('StartPrice').patchValue(0);
      this.getFormControl('EvaluationPrice').patchValue(0);
    }
  }

  changeCalc() {
    this.sumPrice = 0;
    let count = 1;
    // 回调判断是否有官方价格
    if (!Util.isUndefinedOrNullOrWhiteSpace(this.getFormControl('OfficialPrice').value)) {
      this.sumPrice = this.getFormControl('OfficialPrice').value;
    } else {
      count = this.calculateCount();
      // 没有官方价格，判断其他价格格是否为空
      if (count === 0) {
        this.setFormValue(false);
      } else {
        this.sumPrice = this.calculatePrice();
      }
    }

    if (this.sumPrice !== 0) {
      // 平台价格平均值，也就是评估价
      const avgPrice = this.fomatFloat(this.sumPrice / count, 2);
      // 起拍价为评估价一半
      const sPrice = Math.round(avgPrice / 2);
      if (!isNaN(avgPrice)) {
        this.setFormValue(true, sPrice, avgPrice);
      }
    }
  }

  editStartPrice() {
    this.getFormControl('MarkUp').patchValue(this.addPriceRange(this.getFormControl('StartPrice').value));
  }

  editEvaluationPrice(e) {
    // 假如只修改起拍价的时候，读取不做计算回调，防止评估价
    if (!this.isSetStartPrice) {
      // this.isSetStartPrice = true;
      return;
    }

    const price = Math.round(e / 2);
    this.getFormControl('StartPrice').patchValue(price);
    this.getFormControl('MarkUp').patchValue(this.addPriceRange(price));
  }

  save(status, isCancel?: boolean) {
    // isCancel主要是为了取消也能保存
    for (const i in this.form.controls) {
      if (this.form.controls.hasOwnProperty(i)) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
      }
    }
    if (this.form.valid) {
      this.isSaving = true;
      const startTime = `${this.datePipe.transform(this.getFormControl('StartTime').value, 'yyyy-MM-dd HH:mm:00')}`;
      const endTime = `${this.datePipe.transform(this.getFormControl('EndTime').value, 'yyyy-MM-dd HH:mm:00')}`;
      const formValue = Object.assign({}, this.form.value, {
        // 设置秒为0开始
        StartTime: startTime,
        EndTime: endTime,
        Images: this.imagesList,
        Status: status,
        Material: this.model ? this.model?.Material : this.materialObjectId,
        // RemainTime: moment(new Date(endTime)).diff(new Date(startTime)),
      });
      if (this.getFormControl('MaterialRemainQuantity').value <= 0) {
        this.mesSvc.warning('当前物品仓库剩余数量为0！');
      } else {
        this.auctionSvc.publish.save(formValue).subscribe((r: any) => {
          this.form.controls['Id'].setValue(r.Data);
          this.publishId = r.Data;
          this.isSaving = false;
          this.successMessage(status);
        });
      }
    } else {
      this.isSaving = false;
      this.mesSvc.error('根据提示完成表单！');
    }
  }

  successMessage(status, isCancel?: boolean) {
    if (status === -1 && isCancel) {
      this.mesSvc.success('取消成功');
      this.cancel();
    } else if (status === 1) {
      this.mesSvc.success('发布成功');
      this.cancel();
    } else if (status === 0 || (status === -1 && !isCancel)) {
      this.mesSvc.success('保存成功');
    }
    this.status = status;
    this.isSaving = false;
    this.isSetStartPrice = true;
  }

  cancel() {
    // history.go(-1);
    // this.draRef.close(isReload);
    this.router.navigate(['/home/auction/publish']);
  }
}
