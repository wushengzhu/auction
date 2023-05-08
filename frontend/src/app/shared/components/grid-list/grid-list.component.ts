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
  @Input() selectedData: Array<boolean> = [];
  @Input() beforeRequest: RequestFunc;
  @Input() afterRequest: (result: any) => any;
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
  simpleFilter: Array<any> = [];
  constructor(private auctionSvc: AuctionService, private nzMsgSvc: NzMessageService, private gridListSvc: GridUtilService) {}

  ngAfterViewInit(): void {
    this.initTemplate(this.columns);
  }

  ngOnInit() {
    this.initSimpleSearch();
    this.getData();
  }

  initSimpleSearch() {
    if (!Util.IsNullOrEmpty(this.columns)) {
      const col = this.columns.filter((item) => item.inSearch).map((item) => item.display);
      if (col && col?.length > 0) {
        this.simpleSearchPlaceHolder = col.join(',');
      }
    }
  }

  simpleSearch() {
    this.columns.forEach((item) => {
      if (item.inSearch && !Util.isUndefinedOrNullOrWhiteSpace(this.simpleSearchText)) {
        this.simpleFilter.push({
          field: item.field,
          op: '$regex',
          value: this.simpleSearchText,
        });
        this.refresh();
      }
    });
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
      this.simpleFilter = filters;
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

  selectChange(ev) {}

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
