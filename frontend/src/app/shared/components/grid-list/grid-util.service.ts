import { EnumColumn } from './models/enum-column';
import { DatetimeColumn } from './models/datetime-column';

import { Injectable } from '@angular/core';
import { Column } from './models/column';
// import { RadioColumn } from './models/radio-column';
import { ButtonColumn } from './models/button-column';
// import { ViewType } from './models/enums/view-type.enum';
// import { TextColumn } from './models/text-column';
import * as moment from 'moment';
import { Util } from '../../utills/utils';
import { CheckboxColumn } from './models/checkbox-column';
/**
 * Grid的工具类
 *
 * @export
 * @class GridUtilService
 */
@Injectable()
export class GridUtilService {
  constructor() {}

  columnThType(column: Column) {
    if (column instanceof CheckboxColumn) {
      return 'checkbox';
    } 
    // else if (column instanceof RadioColumn) {
    //   return 'radio';
    // } else 
    else if (column instanceof ButtonColumn) {
      return 'button';
    } 
    else if (column.headerTemplate) {
      return 'template';
    } else {
      return 'normal';
    }
  }
  columnTrType(column: Column) {
    if (column instanceof DatetimeColumn && Util.isUndefinedOrNull(column.template)) {
      return 'datetime';
    } 
    else if (column instanceof CheckboxColumn) {
      return 'checkbox';
    }
    //  else if (column instanceof RadioColumn) {
    //   return 'radio';
    // } 
    else if (column instanceof ButtonColumn && Util.isUndefinedOrNull(column.template)) {
      return 'button';
    } else if (column instanceof EnumColumn && Util.isUndefinedOrNull(column.template)) {
      return 'enum';
    } else if (column.formatter) {
      return 'formatter';
    } else if (column.template) {
      return 'template';
    } else {
      return 'normal';
    }
  }

  getColumnWidthByDisplay(display: string, defWidthStr: string) {
    if (Util.isUndefinedOrNullOrWhiteSpace(defWidthStr)) {
      return defWidthStr;
    }
    let defWidth = parseInt(defWidthStr, 10);
    if (isNaN(defWidth)) {
      defWidth = 0;
    }
    if (!Util.isUndefinedOrNullOrWhiteSpace(display)) {
      const displayWidth = display.length * 15 + 16;
      if (displayWidth > defWidth) {
        return displayWidth + 'px';
      } else {
        return defWidthStr;
      }
    }
    return defWidthStr;
  }

  getDateRanges() {
    const preDay = moment().subtract(1, 'day'),
      preWeek = moment().subtract(1, 'week'),
      preMon = moment().subtract(1, 'month'),
      preQua = moment().subtract(1, 'quarter'),
      preYear = moment().subtract(1, 'year');
    return {
      day: [moment().toDate(), moment().toDate()],
      preDay: [preDay.toDate(), preDay.toDate()],
      week: [
        moment()
          .startOf('week')
          .toDate(),
        moment()
          .endOf('week')
          .toDate(),
      ],
      preWeek: [preWeek.startOf('week').toDate(), preWeek.endOf('week').toDate()],
      month: [
        moment()
          .startOf('month')
          .toDate(),
        moment()
          .endOf('month')
          .toDate(),
      ],
      preMonth: [preMon.startOf('month').toDate(), preMon.endOf('month').toDate()],
      quarter: [
        moment()
          .startOf('quarter')
          .toDate(),
        moment()
          .endOf('quarter')
          .toDate(),
      ],
      preQuarter: [preQua.startOf('quarter').toDate(), preQua.endOf('quarter').toDate()],
      year: [
        moment()
          .startOf('year')
          .toDate(),
        moment()
          .endOf('year')
          .toDate(),
      ],
      preYear: [preYear.startOf('year').toDate(), preYear.endOf('year').toDate()],
    };
  }
}