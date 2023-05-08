import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuctionService } from 'src/app/services/auction.service';
import { Util } from '../../utills/utils';
import { GridOption } from '../grid-list/grid-option';
import { Column } from '../grid-list/models/column';
import { StringColumn } from '../grid-list/models/string-column';
import { DatetimeColumn } from '../grid-list/models/datetime-column';
import { ButtonColumn } from '../grid-list/models/button-column';
import { RequestOption } from '../grid-list/request-option';

@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.less'],
})
export class AttachmentComponent implements OnInit {
  _objectId: number = 0;
  @Input() modCode: string;
  @Input() set objectId(val) {
    if (val > 0 && this._objectId !== val) {
      this._objectId = val;
      this.uploadImg();
    } else {
      this.reload = true;
    }
  }
  get objectId() {
    return this._objectId;
  }
  @ViewChild('uploadImgInput', { read: ElementRef, static: true })
  uploadImgEle: ElementRef;
  imgBase64: any;
  imgUrl: string = '';
  filesList: Array<any> = [];
  percent: Array<any>;
  option: GridOption;
  columns: Array<Column> = [];
  reload: boolean = false;
  beforeRequest = (req: RequestOption) => {
    console.log('没有跑进来吗？');
    if (this.objectId > 0) {
      req.filters.push({
        field: 'ObjectId',
        op: '$eq',
        value: this.objectId,
      });
      req.filters.push({
        field: 'ModCode',
        op: '$eq',
        value: this.modCode,
      });
    }
    return req;
  };
  @Output() loadFiles: EventEmitter<Array<any>> = new EventEmitter(); // reload双重绑定
  afterRequest = (res) => {
    const files = res.Data.map((item) => item.OriginName);
    this.loadFiles.emit(files);
    return res;
  };
  constructor(private nzMsgSvc: NzMessageService, private auctionSvc: AuctionService) {}

  ngOnInit(): void {
    this.initGrid();
  }

  initGrid() {
    this.option = new GridOption({
      url: '/api/File/Attachment/GetList',
      showHeader: false,
      simplePagination: true,
    });
    this.columns = [
      new StringColumn({
        display: '文件名',
        field: 'FileName',
        width: '120px',
        isEllipsis: true,
      }),
      new StringColumn({
        display: '文件类型',
        field: 'FileType',
        width: '120px',
      }),
      new StringColumn({
        display: '文件大小',
        field: 'FileByteLength',
        width: '120px',
      }),
      new DatetimeColumn({
        display: '上传时间',
        field: 'CreateTime',
      }),
      new ButtonColumn({
        display: '操作',
        field: '',
        width: '90px',
        template: 'operate',
      }),
    ];
  }

  edit(id) {}

  delete(id) {}

  download(id) {}

  changeImg() {
    const files = this.uploadImgEle.nativeElement.files;
    this.percent = new Array(files.length).fill(0);
    for (let item of files) {
      this.filesList.push(item);
    }
    if (this.objectId > 0) {
      console.log('dkadjad，没泡到吗');
      this.uploadImg();
    }
  }

  deleteById(id) {}

  deleteFile(index) {
    this.filesList.splice(index, 1);
    this.percent = new Array(this.filesList.length).fill(0);
  }

  uploadImg() {
    let that = this;
    if (!Util.IsNullOrEmpty(this.filesList)) {
      for (let i in this.filesList) {
        const item = this.filesList[i];
        const reader = new FileReader();
        reader.readAsDataURL(item);
        reader.onload = function () {
          that.imgBase64 = this.result; // 拿到的是base64格式的图片
          that.storageUploadImg(item.name, that.imgBase64);
          const attachInfo = {
            ObjectId: that.objectId,
            ModCode: that.modCode,
            FileName: item.name.split('.')[0],
            OriginName: item.name,
            FileType: item.type,
            FileByteLength: that.getFileByte(item.size),
            FileSize: item.size,
          };
          that.auctionSvc.file.attachInfo(attachInfo).subscribe(() => {
            that.percent[i] = 100;
          });
        };
      }
      this.reload = true;
    }
  }

  storageUploadImg(imgName: any, fileData: any) {
    this.auctionSvc.file.image(imgName, fileData).subscribe((item: any) => {
      if (item) {
        this.imgUrl = item.data;
        // this.nzMsgSvc.success(item?.msg);
      }
    });
  }

  clickUpload() {
    this.uploadImgEle.nativeElement.click();
  }

  getFileByte(size: number) {
    if (size > 1024 * 1024 * 1024) {
      return (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
    } else if (size > 1024 * 1024) {
      return (size / (1024 * 1024)).toFixed(2) + 'MB';
    } else if (size > 1024) {
      return (size / 1024).toFixed(2) + 'KB';
    }
    return size + 'B';
  }
}
