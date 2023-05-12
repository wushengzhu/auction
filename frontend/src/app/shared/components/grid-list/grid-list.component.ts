import { AfterViewInit, Component, ContentChild, ContentChildren, EventEmitter, Input, OnInit, Output, QueryList, TemplateRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ReplaySubject } from 'rxjs';
import { AuctionService } from 'src/app/services/auction.service';
import { Util } from '../../utills/utils';
import { GridColumnTemplateDirective } from './grid-column-template.directive';
import { GridOption } from './grid-option';
import { GridUtilService } from './grid-util.service';
import { Column } from './models/column';
import { EnumColumn } from './models/enum-column';
import { EnumOptions } from './models/enum-options';
import { RequestOption } from './request-option';

type RequestFunc = (req: RequestOption) => RequestOption;

@Component({
  selector: 'app-grid-list',
  templateUrl: './grid-list.component.html',
  styleUrls: ['./grid-list.component.less'],
})
export class GridListComponent implements OnInit, AfterViewInit {
  @Input() set reload(val) {
    if (this._reload !== val) {
      this._reload = val;
      if (val && this.option) {
        setTimeout(() => {
          this.getData();
        });
      }
    }
  }
  get reload() {
    return this._reload;
  }
  @Output() reloadChange: EventEmitter<boolean> = new EventEmitter(); // reload双重绑定
  @Input() option: GridOption = new GridOption();
  @Input() pageSize: number = 10;
  @Input() curPage: number = 1;
  private _columns: Array<any> = [];
  @Input() set columns(val) {
    if (val && val !== this._columns) {
      this._columns = val.filter((item) => item.visible);
      this.selectShowField = val;
    }
  }
  get columns() {
    return this._columns;
  }
  @Input() beforeRequest: RequestFunc;
  @Input() afterRequest: (result: any) => any;
  /**
   *
   * 获取选取列选取的行，单选或多选
   */
  @Input() selection: Array<any>;

  @Output() selectionChange = new EventEmitter<any>();
  @ContentChild('prefixArea') prefixArea: TemplateRef<any>;
  @ContentChild('suffixArea') suffixArea: TemplateRef<any>;
  @ContentChild('titleTpl') titleTpl: TemplateRef<any>;
  @ContentChild('footerTpl') footerTpl: TemplateRef<any>;
  @ContentChild('noResult') noResult: TemplateRef<any>;
  @ContentChildren(GridColumnTemplateDirective)
  columnTemplates: QueryList<GridColumnTemplateDirective>;
  originColumns: Array<any> = [];
  selectShowField: Array<any> = [];
  simpleSearchPlaceHolder: string = '';
  dataList: Array<any>;
  isVisible: boolean = false;
  isLoading: boolean = false;
  scroll = { x: '300px' };
  totalData: number = 0;
  private _reload: boolean = false;
  simpleSearchText: string = '';
  // set simpleSearchText(val: string) {
  //   if (this._simpleSearchText !== val) {
  //     this.simpleSearchText = val;
  //     this.simpleFilter = [];
  //     this.searchChange(this.simpleSearchText);
  //   } else {
  //     this.reload = true;
  //   }
  // }

  // get simpleSearchText() {
  //   return this._simpleSearchText;
  // }
  simpleFilter: Array<any> = [];
  thChecked: boolean = false;
  indeterminate: boolean = false;
  // setOfCheckedId = new Set<number>();
  mapOfChcekedData = new Map<number, object>();
  listOfCurrentPageData: readonly any[] = [];
  constructor(private auctionSvc: AuctionService, private nzMsgSvc: NzMessageService, private gridListSvc: GridUtilService) {}

  ngAfterViewInit(): void {
    this.initTemplate(this.columns);
  }

  ngOnInit() {
    this.initSimpleSearch();
    this.getData();
    this.mapOfChcekedData.clear();
  }

  initSimpleSearch() {
    if (!Util.IsNullOrEmpty(this.columns)) {
      const col = this.columns.filter((item) => item.inSearch).map((item) => item.display);
      if (col && col?.length > 0) {
        this.simpleSearchPlaceHolder = col.join(',');
      }
    }
  }

  clearSearchText() {
    this.simpleSearchText = '';
    this.simpleFilter = [];
    this.refresh();
  }

  simpleSearch() {
    this.simpleFilter = [];
    if (!Util.isUndefinedOrNullOrWhiteSpace(this.simpleSearchText)) {
      this.columns.forEach((item) => {
        if (item.inSearch) {
          this.simpleFilter.push({
            field: item.field,
            op: '$regex',
            value: this.simpleSearchText,
          });
        }
      });
    }
    this.refresh();
  }

  onAllChecked(checked: boolean) {
    this.listOfCurrentPageData.forEach((data) => this.updateCheckedSet(data, checked));
    this.refreshCheckedStatus();
  }

  updateCheckedSet(data: any, checked: boolean): void {
    const id = data?.Id;
    if (checked) {
      // this.setOfCheckedId.add(id);
      this.mapOfChcekedData.set(id, data);
    } else {
      // this.setOfCheckedId.delete(id);
      this.mapOfChcekedData.delete(id);
    }
    this.selectionChange.emit([...this.mapOfChcekedData.values()]);
  }

  onCurrentPageDataChange(event: readonly any[]): void {
    this.listOfCurrentPageData = event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    if (this.listOfCurrentPageData.length > 0) {
      this.thChecked = this.listOfCurrentPageData.every(({ Id }) => this.mapOfChcekedData.has(Id));
      this.indeterminate = this.listOfCurrentPageData.some(({ Id }) => this.mapOfChcekedData.has(Id)) && !this.thChecked;
    }

    if (!this.thChecked) {
      this.mapOfChcekedData.clear();
    }
  }

  onItemChecked(data: any, checked: boolean): void {
    this.updateCheckedSet(data, checked);
    this.refreshCheckedStatus();
  }

  initTemplate(uColumn: Array<Column>) {
    uColumn.forEach((v, i, cs) => {
      if (cs[i].template instanceof TemplateRef) {
      } else if (typeof cs[i].template === 'string') {
        if (this.columnTemplates) {
          const template = this.columnTemplates.find((c) => c.name === cs[i].template);
          if (template instanceof GridColumnTemplateDirective) {
            cs[i].template = template.templateRef;
            template.init = true;
          } else {
            cs[i].template = null;
          }
        } else {
          cs[i].template = null;
        }
      } else {
        if (this.columnTemplates) {
          const template = this.columnTemplates.find((c) => c.name === cs[i].field);
          if (template instanceof GridColumnTemplateDirective) {
            cs[i].template = template.templateRef;
            template.init = true;
          }
        }
      }

      if (cs[i] instanceof EnumColumn) {
        const enumc = <EnumColumn>cs[i];
        if (enumc._enumOptions && !enumc._enumOptions.isStopped) {
          enumc._enumOptions.complete();
        }
        enumc._enumOptions = new ReplaySubject<EnumOptions>();
        enumc.enumOptions().subscribe((r) => {
          enumc._enumOptions.next(r);
          enumc._enumOptions.complete();
        });
      }
    });
  }

  pageSizeChange(event) {
    this.pageSize = event;
    this.getData();
  }

  getData() {
    this.isLoading = true;
    if (Util.isFunction(this.beforeRequest)) {
      const requestData = new RequestOption();
      const { curPage, pageSize, filters } = this.beforeRequest(requestData);
      this.curPage = curPage;
      this.pageSize = pageSize;
      if (Util.isUndefinedOrNullOrWhiteSpace(this.simpleSearchText)) {
        this.simpleFilter = [];
      }
      this.simpleFilter = [...this.simpleFilter, ...filters];
    }
    this.auctionSvc
      .getData(this.option.url, {
        curPage: this.curPage,
        pageSize: this.pageSize,
        filters: this.simpleFilter,
      })
      .subscribe((data: any) => {
        if (Util.isFunction(this.afterRequest)) {
          data = this.afterRequest(data);
        }
        this.dataList = data.Data;
        this.totalData = data.Total;
        this.isLoading = false;
        this.reloadChange.emit(false);
      });
  }

  pageIndexChange(event) {
    this.curPage = event;
    this.getData();
  }

  colType(col: Column) {
    return this.gridListSvc.columnTrType(col);
  }

  thType(col: Column) {
    return this.gridListSvc.columnThType(col);
  }

  getCellValue(entity, field) {
    return Util.getter(entity, field);
  }

  refresh() {
    this.getData();
  }

  saveShowField() {
    this.columns = this.selectShowField;
    this.isVisible = false;
    this.reload = true;
  }
}
