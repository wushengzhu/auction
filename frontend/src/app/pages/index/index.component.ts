import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuctionService } from 'src/app/services/auction.service';
import * as echarts from 'echarts';
import moment from 'moment';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less'],
})
export class IndexComponent implements OnInit, AfterViewInit {
  auctionList: Array<any> = [];
  exchangeList: Array<any> = [];
  @ViewChild('cylinder') cylinder: ElementRef;
  @ViewChild('pie') pie: ElementRef;
  dateType: string = 'month';
  dateRange = [
    { value: 'month', label: '本月' },
    { value: 'preMonth', label: '上月' },
    { value: 'quarter', label: '本季度' },
    { value: 'preQuarter', label: '上季度' },
    { value: 'year', label: '本年' },
    { value: 'preYear', label: '上一年' },
  ];
  yearRange: any;
  loading: boolean = false;
  timeArr: any = [moment().startOf('month').toDate(), moment().endOf('month').toDate()]; // 默认本月
  constructor(private auctionSvc: AuctionService, private nzMsgSvc: NzMessageService) {}
  ngAfterViewInit(): void {
    this.getPeriodData();
  }

  setPieChart() {
    const piechart = echarts.init(this.pie.nativeElement);
    piechart.setOption({
      title: {
        text: '部门参与度扇形统计',
        subtext: 'Fake Data',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    });
  }

  setCylinderChart(dataSource: Array<any>) {
    const cylinderchart = echarts.init(this.cylinder.nativeElement);
    cylinderchart.setOption({
      legend: {},
      tooltip: {},
      dataset: {
        source: dataSource,
      },
      xAxis: { type: 'category' },
      yAxis: {},
      // Declare several bar series, each will be mapped
      // to a column of dataset.source by default.
      series: [
        { type: 'bar', seriesLayoutBy: 'row' },
        { type: 'bar', seriesLayoutBy: 'row' },
        { type: 'bar', seriesLayoutBy: 'row' },
        { type: 'bar', seriesLayoutBy: 'row' },
        { type: 'bar', seriesLayoutBy: 'row' },
        { type: 'bar', seriesLayoutBy: 'row' },
        { type: 'bar', seriesLayoutBy: 'row' },
        { type: 'bar', seriesLayoutBy: 'row' },
      ],
    });
  }

  ngOnInit() {
    this.auctionSvc.stat.getPublishStat().subscribe((data: any) => {
      this.auctionList = data.Data.slice(0, 4);
      this.exchangeList = data.Data.slice(4);
    });
  }

  getPeriodData() {
    this.loading = true;
    const type = this.dateType === 'custom' ? 'year' : this.dateType;
    this.auctionSvc.stat.getPeriodStat(this.timeArr[0], this.timeArr[1], type).subscribe((data: any) => {
      this.setCylinderChart(data?.Data);
      this.loading = false;
    });
  }

  changeDateType(ev) {
    if (ev !== 'custom') {
      this.timeArr = this.getDateData(ev);
      this.getPeriodData();
    }
  }

  changeYearType(event) {
    this.timeArr = [moment(new Date(this.yearRange)).startOf('year').toDate(), moment(new Date(this.yearRange)).endOf('year').toDate()];
    this.getPeriodData();
  }

  getDateData(type: string) {
    // const preMon = moment().subtract(1, 'month'),
    //   preQua = moment().subtract(1, 'quarter'),
    //   preYear = moment().subtract(1, 'year');
    let timeArr = [];
    switch (type) {
      case 'month':
        // 本月
        timeArr = [moment().startOf('month').toDate(), moment().endOf('month').toDate()];
        break;
      // case 'preMonth':
      //   // 上月
      //   timeArr = [preMon.startOf('month').toDate(), preMon.endOf('month').toDate()];
      //   break;
      case 'quarter':
        // 本季度
        timeArr = [moment().startOf('quarter').toDate(), moment().endOf('quarter').toDate()];
        break;
      // case 'preQuarter':
      //   // 上季度
      //   timeArr = [preQua.startOf('quarter').toDate(), preQua.endOf('quarter').toDate()];
      //   break;
      case 'year' || 'custom':
        // 本年
        timeArr = [moment().startOf('year').toDate(), moment().endOf('year').toDate()];
        break;
      // case 'preYear':
      //   // 上一年
      //   timeArr = [preYear.startOf('year').toDate(), preYear.endOf('year').toDate()];
      //   break;
    }
    return timeArr;
  }

  disabledDate = (current: Date): boolean => {
    return moment(current).isAfter(moment());
  };
}
