import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuctionService } from 'src/app/services/auction.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less'],
})
export class IndexComponent implements OnInit,AfterViewInit {
  auctionList:Array<any>=[];
  exchangeList:Array<any>=[];
  @ViewChild('cylinder') cylinder: ElementRef;
  @ViewChild('pie') pie: ElementRef;
  constructor(private auctionSvc: AuctionService, private nzMsgSvc: NzMessageService) {}
  ngAfterViewInit(): void {
    const cylinderchart = echarts.init(this.cylinder.nativeElement);
    cylinderchart.setOption({
      title: {
        text: 'ECharts in Angular'
      },
      tooltip: {},
      xAxis: {
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {},
      series: [{
        name: 'Sales',
        type: 'bar',
        data: [120, 200, 150, 80, 70, 110, 130]
      }]
    });
    const piechart =echarts.init(this.pie.nativeElement);
    piechart.setOption({
        title: {
          text: 'Referer of a Website',
          subtext: 'Fake Data',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
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
              { value: 300, name: 'Video Ads' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
  }

  ngOnInit() {

  }

  edit(entity?: any): void {

  }
}
