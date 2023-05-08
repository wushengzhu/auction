
import { Util } from 'src/app/shared/utills/utils';
import { ButtonOptions } from './button-option';
import { Column } from './column';

export class ButtonColumn extends Column {
  /**
   * 是否显示操作列
   * @type {Array<ButtonsOptions>}
   * @memberof Column
   */
  buttons?: Array<ButtonOptions>;
  /**
   * 只显示文字
   */
  onlyText?: boolean = false;
  /**
   * 是否显示更多按钮
   */
  showMenu?: boolean = false;
  constructor(init?: ButtonColumn) {
    super();
    if (init) {
      Object.assign(this, init);
    }

    // this.canChangeVisible = false;
    // this.sortable = false;
    this.inSearch = false;
    if (Util.isUndefinedOrNullOrWhiteSpace(this.display)) {
      this.display = '操作';
    }
    if (
      Util.isUndefinedOrNullOrWhiteSpace(this.width) &&
      !Util.IsNullOrEmpty(this.buttons)
    ) {
      if (this.onlyText) {
        this.width = 40 * this.buttons.length + 'px';
      } else {
        this.width = 46 * this.buttons.length + 'px';
      }
    }
  }
}
