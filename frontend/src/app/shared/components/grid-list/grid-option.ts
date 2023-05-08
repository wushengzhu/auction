export class GridOption {
  constructor(init?: GridOption) {
    if (init) {
      Object.assign(this, init);
    }
  }

  /**
   * 全局唯一的Id，格式为module.biz用于存储用户自定义的列表设置，如分页数等，相同则会共享设置，非必须，如果为空，则使用url作为id
   *
   * @type {string}
   * @memberof GridOption
   */
  id?: string;
  /**
   * 请求数据的Api地址
   *
   * @type {string}
   * @memberof GridOption
   */
  url?: string;
  /**
   * 每页显示几条
   *
   * @type {number}
   * @memberof GridOption
   */
  size?: number = 10;

  /**
   * 最大每页条数
   */
  maxPageSize?: number = 100;
  /**
   * 显示table边框
   *
   * @type {boolean}
   * @memberof GridOption
   */
  bordered?: boolean = true;
  /**
   * table的大小
   *
   * @type {('small' | 'middle' | 'default')}
   * @memberof GridOption
   */
  tableSize?: 'small' | 'middle' | 'default';

  /**
   * 显示分页
   *
   * @type {boolean}
   * @memberof GridOption
   */
  showPagination?: boolean = true;
  /**
   * 显示页码快速跳转
   *
   * @type {boolean}
   * @memberof GridOption
   */
  showQuickJumper?: boolean = true;

  /**
   * 显示总页数
   *
   * @type {boolean}
   * @memberof GridOption
   */
  showTotal?: boolean = true;

  /**
   * 启用模糊搜索框
   *
   * @type {boolean}
   * @memberof GridOption
   */
  simpleSearchEnable?: boolean = true;
  /**
   * 启用高级搜索
   *
   * @type {boolean}
   * @memberof GridOption
   */
  advSearchEnable?: boolean = true;

  /**
   * 滚动条
   *
   */
  scroll?: { x?: string; y?: string };

  /**
   * 显示表头
   *
   * @type {boolean}
   * @memberof GridOption
   */
  showHeader?: boolean = true;

  /**
   * 显示头部（含刷新与搜索）
   *
   * @type {boolean}
   * @memberof GridOption
   */
  showAllHeader?: boolean = true;
  /**
   * 显示顶部下拉菜单，如刷新按钮等
   *
   * @type {boolean}
   * @memberof GridOption
   */
  showDropDownMenu?: boolean = true;

  /**
   * 启用行选择
   *
   * @type {boolean}
   * @memberof GridOption
   */
  rowSelectionEnable?: boolean = false;
  /**
   * 在加载完后展开高级搜索
   *
   * @type {boolean}
   * @memberof GridOption
   */
  showAdvSearchOnLoad?: boolean = false;
  /**
   * 加载完成后选中所有记录
   */
  checkAllOnLoaded?: boolean = false;

  /**
   * 是否设置Id默认排序列
   *
   */
  defaultIdSortEnabled?: boolean = true;

  /**
   * 是否显示列表设置
   *
   */
  showSetting?: boolean = true;
  /**
   * 是否显示列相关自定义设置
   */
  showColumnSeting?: boolean = true;

  /**
   * 能否改变列顺序
   *
   */
  changeColumnOrder?: boolean = true;

  /**
   * 导出配置
   *
   */
//   exportOption?: ExportOption;

  /**
   * 是否恢复用户上一次Grid的状态，包括搜索、页码、排序、每页条数
   */
  recoverGridState?: boolean = true;
  /**
   * 是否总是恢复用户上一次Grid的状态，用于跳转不同模块的列表，比如favorite
   */
  alwaysRecoverGridState?: boolean = false;

  /**
   * 每页条数
   */
  showSizeChanger?: boolean = false;

  /**
   * 每页条数
   * showSizeChanger=true生效
   */
  pageSizeOptions?: Array<number> = [10, 20, 30, 40, 50];

  /**
   * 展开高级搜索的时候是否将简单搜索的条件填上去
   */
  initAdvSearchFromSimpleSearch?: boolean = false;

  /**
   * 是否是可展开的
   */
  expandable?: boolean = false;
  /**
   * 可展开的开启手风琴效果
   */
  expandableAccordion?: boolean = false;
  /**
   * 表头分组时指定每列宽度，与 th 的 nzWidth 不可混用
   */
  widthConfig?: Array<string> = [];
  /**
   * 设置 nzTableLayout="fixed" 与 nzEllipsis 可以让单元格内容根据宽度自动省略。列头缩略暂不支持和排序筛选一起使用。
   * nzTableLayout 默认值为'auto'
   */
  tableLayout?: 'fixed' | 'auto' = 'auto';
  /**
   * 是否显示简单分页
   */
  simplePagination?: boolean = false;
  /**
   * 计算Y的扩展函数，增加或减少系统自动计算的误差
   */
  calScollY?: (y: number, isCompact: boolean) => number;
  /***
   * 是否允许用户保存高级搜索
   */
  advSearchSaveEnable?: boolean = true;

  showLayoutSwitch?: boolean = false;
  /**
   * 是否允许Id列搜索
   */
  enableIdFieldSearch?: boolean = false;
}