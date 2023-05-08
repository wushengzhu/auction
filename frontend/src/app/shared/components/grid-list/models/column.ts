import { TemplateRef } from '@angular/core';

export abstract class Column {
  constructor(init?: Column) {
    if (init) {
      Object.assign(this, init);
    }
  }

  /**
   * 数据源字段名
   */
  field?: string;

  /**
   * 显示名
   */
  display?: string;

  /**
   * 单元格模板
   */
  template?: TemplateRef<any> | string;

  /**
   * 宽度
   */
  width?: string;

  /**
   *
   * 左侧距离，用于固定左侧列
   * @type {string}
   * @memberof Column
   */
  left?: boolean | string = false;
  /**
   *
   * 右侧距离，用于固定右侧列
   * @type {string}
   * @memberof Column
   */
  right?: string | boolean = false;
  /**
   * 单元格内容
   */
  type?: 'date' | 'button' | 'string' | 'template' | 'radio' | 'checkbox' =
    'string';

  /**
   * 根据所传的值来格式化显示的值
   * @memberof Column
   */
  formatter?: (entity, column) => string;

  /**
   * 内容对齐方式
   */
  align?: 'left' | 'right' | 'center' = 'left';
  /**
   * 表头模板
   */
  headerTemplate?: TemplateRef<any> | string;
  /**
   * 是否单元格内容根据宽度自动省略
   */
  isEllipsis?: boolean;
  /**
   * 启用模糊搜索框
   *
   * @type {boolean}
   * @memberof Column
   */
  inSearch?: boolean = true;
  /**
   * 可见性
   */
  visible?: boolean = true;
}

// import { ViewType } from '../enums/view-type.enum';
// import { SortDirection } from '../enums/sort-direction.enum';
// import { TemplateRef } from '@angular/core';

// export abstract class Column {
//   constructor(init?: Column) {
//     if (init) {
//       Object.assign(this, init);
//     }
//   }
//   /**
//    *
//    * 数据源字段名
//    * @type {string}
//    * @memberof Column
//    */
//   field?: string;
//   /**
//    * 显示名
//    *
//    * @type {string}
//    * @memberof Column
//    */
//   display?: string;

//   /**
//    * 是否显示在列表中，不影响搜索的可见性
//    *
//    * @type {boolean}
//    * @memberof Column
//    */
//   visible?: boolean = true;
//   /**
//    * 可见性默认值，visible为true时才生效
//    *
//    * @type {boolean}
//    * @memberof Column
//    */
//   visibleDefault?: boolean = true;
//   /**
//    * 单元格模版
//    *
//    * @type {TemplateRef<any>}
//    * @memberof Column
//    */
//   template?: TemplateRef<any> | string;

//   /**
//    * 表头模板
//    */
//   headerTemplate?: TemplateRef<any> | string;
//   /**
//    * 宽度
//    *
//    * @type {string}
//    * @memberof Column
//    */
//   width?: string;
//   /**
//    * 是否参与计算ScroolX
//    */
//   autoCalcScrollXByWitdh?: boolean = true;
//   /**
//    *
//    * 数据类型
//    * @type {ViewType}
//    * @memberof Column
//    */
//   advSearchType?: ViewType = ViewType.string;

//   /**
//    * 是否包含在模糊搜索中
//    *
//    * @type {boolean}
//    * @memberof Column
//    */
//   inSearch?: boolean = true;
//   /**
//    * 是否显示在高级搜索中
//    *
//    * @type {boolean}
//    * @memberof Column
//    */
//   inAdvSearch?: boolean = true;
//   /**
//    * 高级搜索模版
//    */
//   advSearchTemplate?: TemplateRef<any> | string;
//   /**
//    *
//    * 默认展开高级搜索，并显示该列
//    */
//   advSearchDefaultShow?: boolean = false;
//   /**
//    * 用户是否可改变显示状态
//    *
//    * @type {boolean}
//    * @memberof Column
//    */
//   canChangeVisible?: boolean = true;
//   /**
//    *
//    * 是否启用排序
//    * @type {boolean}
//    * @memberof Column
//    */
//   sortable?: boolean = true;
//   /**
//    *
//    * 设置默认排序
//    * @type {SortDirection}
//    * @memberof Column
//    */
//   sort?: SortDirection;

//   /**
//    * 根据所传的值来格式化显示的值
//    * @memberof Column
//    */
//   formatter?: (entity, column) => string;

//   /**
//    * 根据所传的值来获取提示的值
//    * @memberof Column
//    */
//   getTitle?: (entity, column) => string;

//   /**
//    * 搜索字段名，查询条件将使用这个字段
//    *
//    * @type {string}
//    * @memberof Column
//    */
//   searchField?: string;
//   /**
//    * 高级搜索操作符
//    *
//    * @type {string}
//    * @memberof Column
//    */
//   advSearchOperator?: string;
//   /**
//    * 高级搜索控件取值字段名，目前用于取选人和选组织控件的值
//    *
//    * @type {string}
//    * @memberof Column
//    */
//   advSearchValueField?: string;
//   /**
//    * 导出字段名
//    *
//    * @type {string}
//    * @memberof Column
//    */
//   exportField?: string;
//   /**
//    *
//    * 左侧距离，用于固定左侧列
//    * @type {string}
//    * @memberof Column
//    */
//   left?: boolean | string = false;
//   /**
//    *
//    * 右侧距离，用于固定右侧列
//    * @type {string}
//    * @memberof Column
//    */
//   right?: string | boolean = false;

//   /**
//    * 是否允许导出
//    *
//    */
//   canExport?: boolean = true;

//   /**
//    *
//    * 即使隐藏也可以导出
//    */
//   enforceExport?: boolean;

//   /**
//    * 内部属性请勿使用
//    *
//    */
//   _visible?: boolean;
//   /**
//    * 内容对齐方式
//    */
//   align?: 'left' | 'right' | 'center' = 'left';

//   /**
//    * DynamicForm来源标记
//    */
//   from?: string;
//   /**
//    * th 类样式
//    */
//   thClass?: string;
//   /**
//    * 是否显示列表设置项
//    */
//   inSettingFields?: boolean = true;
//   /**
//    * 是否单元格内容根据宽度自动省略
//    */
//   isEllipsis?: boolean;

//   /**
//    * 是否显示展开按钮
//    * 注：template 模板有效
//    */
//   showExpand?: boolean = false;
//   /**
//    * 根据display的长度调整宽度
//    */
//   autoCalWidthByHeader?: boolean = true;

//   /***
//    * 自定义格式化配置
//    */
//   formatSetting?: string;
//   /**
//    * 导出额外参数
//    */
//   exportExtraParameters?: { [key: string]: string };
// }
