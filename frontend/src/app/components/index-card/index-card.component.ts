import { Component, Input, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuctionService } from 'src/app/services/auction.service';

@Component({
  selector: 'app-index-card',
  templateUrl: './index-card.component.html',
  styleUrls: ['./index-card.component.less'],
})
export class IndexCardComponent implements OnInit {
  @Input() title:string;
  @Input() tagTpl:string;
  @Input() statusList:Array<any>;
  constructor(private auctionSvc: AuctionService, private nzMsgSvc: NzMessageService) {}

  ngOnInit() {

  }
}
