import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuctionService } from 'src/app/services/auction.service';
import * as echarts from 'echarts';
import { forkJoin } from 'rxjs';

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
        text: '竞品年度情况统计'
      },
      tooltip: {},
      xAxis: {
        data: ['已取消', '未发布', '已发布', '已流拍', '已收货', '已退货', '已付款']
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
          text: '部门参与度扇形统计',
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
      this.auctionSvc.stat.getPublishStat().subscribe((data:any)=>{
       this.auctionList = data.Data.slice(0,4);
       this.exchangeList = data.Data.slice(4);
      })
  }

  edit(entity?: any): void {

  }
}
