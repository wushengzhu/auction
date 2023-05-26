import { Component, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AuctionService } from 'src/app/services/auction.service';
import { Util } from '../../utills/utils';

@Component({
  selector: 'app-dict-select',
  templateUrl: './dict-select.component.html',
  styleUrls: ['./dict-select.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DictSelectComponent),
      multi: true,
    },
  ],
})
export class DictSelectComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
  private _modCode: string;
  private _dictName: string;
  /**
   * 模块代码
   * @type {string}
   * @memberof DictSelectComponent
   */
  @Input()
  set modCode(code: string) {
    if (code !== this._modCode) {
      this._modCode = code;
    }
  }
  get modCode() {
    return this._modCode;
  }
  /**
   * 字典名称
   * @type {string}
   * @memberof DictSelectComponent
   */
  @Input()
  set dictName(name: string) {
    if (name !== this._dictName) {
      this._dictName = name;
    }
  }
  get dictName() {
    return this._dictName;
  }
  @Input() disabled: boolean = false;
  @Output() selectChange = new EventEmitter<any>();
  inputValue: string = '';
  value: Array<{ value: any; show: boolean }> = [];
  data: string;
  dictList: Array<any> = [];

  onChange: (value) => void = () => null;
  onTouch: () => void = () => null;
  constructor(private auctionSvc: AuctionService) {}

  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy(): void {}
  ngOnChanges(changes: SimpleChanges): void {}

  private getData() {
    this.auctionSvc.dict.getList(1, 0, this.dictName).subscribe((item) => {
      this.dictList = item.Data.filter((data) => data.ParentId);
    });
  }

  modelChange(event) {
    const value = [];
    this.onTouch();
    this.onChange(event);
    value.push(this.dictList.find((el) => el.Value === event));
    this.selectChange.emit(value);
  }

  private update(value) {
    if (Util.isUndefinedOrNull(value) || Util.isUndefinedOrNullOrWhiteSpace(value)) {
      this.data = null;
      return;
    }
    this.data = value;
  }

  writeValue(value: any): void {
    this.update(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
