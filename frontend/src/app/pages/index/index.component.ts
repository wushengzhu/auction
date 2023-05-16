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
  dateType: number = 0;
  dateRange = [
    { value: 'month', label: '本月' },
    { value: 'preMonth', label: '上月' },
    { value: 'quarter', label: '本季度' },
    { value: 'preQuarter', label: '上季度' },
    { value: 'year', label: '本年' },
    { value: 'preYear', label: '上一年' },
  ];
  constructor(private auctionSvc: AuctionService, private nzMsgSvc: NzMessageService) {}
  ngAfterViewInit(): void {
    const cylinderchart = echarts.init(this.cylinder.nativeElement);
    cylinderchart.setOption({
      legend: {},
      tooltip: {},
      dataset: {
        source: [
          ['product', '2015', '2016', '2017'],
          ['已取消', 43.3, 85.8, 93.7],
          ['未发布', 83.1, 73.4, 55.1],
          ['已发布', 86.4, 65.2, 82.5],
          ['已流拍', 72.4, 53.9, 39.1],
          ['已售出', 73.4, 53.9, 39.1],
          ['已收货', 75.4, 53.9, 39.1],
          ['已退货', 71.4, 53.9, 39.1],
          ['已付款', 78.4, 53.9, 39.1],
        ],
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
    // cylinderchart.setOption({
    //   title: {
    //     text: '竞品年度情况统计'
    //   },
    //   tooltip: {},
    //   xAxis: {
    //     data: ['已取消', '未发布', '已发布', '已流拍', '已收货', '已退货', '已付款']
    //   },
    //   yAxis: {},
    //   series: [{
    //     name: 'Sales',
    //     type: 'bar',
    //     data: [120, 200, 150, 80, 70, 110, 130]
    //   }]
    // });
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

  ngOnInit() {
    this.auctionSvc.stat.getPublishStat().subscribe((data: any) => {
      this.auctionList = data.Data.slice(0, 4);
      this.exchangeList = data.Data.slice(4);
    });
  }

  getDateData(type: string) {
    const preMon = moment().subtract(1, 'month'),
      preQua = moment().subtract(1, 'quarter'),
      preYear = moment().subtract(1, 'year');
    let timeArr = [];
    switch (type) {
      case 'month':
        timeArr = [moment().startOf('month').toDate(), moment().endOf('month').toDate()];
        break;
      case 'preMonth':
        timeArr = [preMon.startOf('month').toDate(), preMon.endOf('month').toDate()];
        break;
      case 'quarter':
        timeArr = [moment().startOf('quarter').toDate(), moment().endOf('quarter').toDate()];
        break;
      case 'preQuarter':
        timeArr = [preQua.startOf('quarter').toDate(), preQua.endOf('quarter').toDate()];
        break;
      case 'year':
        timeArr = [moment().startOf('year').toDate(), moment().endOf('year').toDate()];
        break;
      case 'preYear':
        break;
    }
    return [
      {
        text: '本月',
        value: () => [moment().startOf('month').toDate(), moment().endOf('month').toDate()],
      },
      {
        text: '上月',
        value: () => [preMon.startOf('month').toDate(), preMon.endOf('month').toDate()],
      },
      {
        text: '本季',
        value: () => [moment().startOf('quarter').toDate(), moment().endOf('quarter').toDate()],
      },
      {
        text: '上季',
        value: () => [preQua.startOf('quarter').toDate(), preQua.endOf('quarter').toDate()],
      },
      {
        text: '本年',
        value: () => [moment().startOf('year').toDate(), moment().endOf('year').toDate()],
      },
      {
        text: '本年',
        value: () => [preYear.startOf('year').toDate(), preYear.endOf('year').toDate()],
      },
    ];
  }
}
