import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface IconNav{
  icon:string,
  color:string,
  title:string,
  path:string,
}

@Component({
  selector: 'app-index-navs',
  templateUrl: './index-navs.component.html',
  styleUrls: ['./index-navs.component.less'],
})
export class IndexNavsComponent implements OnInit {
  iconNavs:Array<IconNav> = [
    {
      icon: "fa fa-user-o",
      color: "rgba(14, 165, 233, 1)",
      title: "用户",
      path: "/home/person/list"
    },
    {
      icon: "fa fa-shopping-bag",
      color: "rgba(139, 92, 246, 1)",
      title: "物资",
      path: "/home/auction/material"
    },
    {
      icon: "fa fa-gavel",
      color: "rgba(217, 70, 239, 1)",
      title: "竞品",
      path: "/home/auction/auction-bid"
    },
    {
      icon: "fa fa-handshake-o",
      color: "rgba(20, 184, 166, 1)",
      title: "拍品",
      path: "/home/auction/my-bid"
    },
    {
      icon: "fa fa-get-pocket",
      color: "rgba(16, 185, 129, 1)",
      title: "领取",
      path: "/image/list"
    },
    {
      icon: "fa fa-file-o",
      color: "rgba(245, 158, 11, 1)",
      title: "字典",
      path: "/home/dictionary"
    },
    {
      icon: "fa fa-newspaper-o",
      color: "rgba(244, 63, 94, 1)",
      title: "公告",
      path: ""
    },
    {
      icon: "fa fa-cogs",
      color: "grey",
      title: "设置",
      path: ""
    },
  ];
  constructor(private router:Router) {}

  ngOnInit() {

  }


  routeLink(path:string){
    if(path){
      this.router.navigate([path]);
    }
  }
}
