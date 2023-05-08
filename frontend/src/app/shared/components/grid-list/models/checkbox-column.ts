import { Util } from 'src/app/shared/utills/utils';
import { Column } from './column';
export class CheckboxColumn extends Column {
  /**
   * 是否在列前显示checkbox
   *
   * @type {boolean}
   * @memberof Column
   */
  checkbox?: boolean;
  /**
   * 控制能否选中的Field，值必须是布尔类型的
   *
   */
  disabledField?: string;
  /**
   * 在加载时默认状态
   */
  checkOnLoad?: (datas: Array<any>, rowData: any) => boolean;
  /**
   * 是否能修改Check状态
   */
  canChangeCheck?: (datas: Array<any>, rowData: any) => boolean;
  /**
   *
   */
  constructor(init?: CheckboxColumn) {
    super();
    if (init) {
      Object.assign(this, init);
    }
    if (Util.isUndefinedOrNullOrWhiteSpace(this.display)) {
      this.display = '';
    }
    this.align = 'center';
    this.width = '50px';
    this.inSearch = false;
    this.checkbox = true;
  }
}