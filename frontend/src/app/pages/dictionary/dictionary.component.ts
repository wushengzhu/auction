import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { map } from 'rxjs';
import { AuctionService } from 'src/app/services/auction.service';
import { GridOption } from 'src/app/shared/components/grid-list/grid-option';
import { ButtonColumn } from 'src/app/shared/components/grid-list/models/button-column';
import { Column } from 'src/app/shared/components/grid-list/models/column';
import { StringColumn } from 'src/app/shared/components/grid-list/models/string-column';
import { RequestOption } from 'src/app/shared/components/grid-list/request-option';
import { Util } from 'src/app/shared/utills/utils';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.less'],
})
export class DictionaryComponent implements OnInit {
  treeNodes: Array<NzTreeNode> = [];
  rootNode = new NzTreeNode({ key: '0', title: '字典名称', expanded: true, isLeaf: false, children: [] });
  selectedKey: Array<string>;
  isVisible: boolean = false;
  title: string | undefined;
  entity: any;
  option: GridOption;
  columns: Array<Column> = [];
  form: FormGroup;
  reload: boolean = false;
  nodeId: number = 0;
  constructor(private fb: FormBuilder, private auctionSvc: AuctionService, private nzMsgSvc: NzMessageService) {
    this.form = this.fb.group({
      Id: [null],
      ModCode: ['Auction'],
      ParentId: [null],
      DictName: [null, [Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z]*/)]],
      Key: [null],
      Value: [null, [Validators.required, Validators.maxLength(20)]],
      CreateTime: [null],
    });
  }

  beforeRequest = (req: RequestOption) => {
    req.filters.push({
      field: 'ParentId',
      op: '$eq',
      value: this.nodeId,
    });
    return req;
  };

  ngOnInit() {
    this.buildTree().subscribe(() => {
      this.treeNodes = [this.rootNode];
      this.selectedKey = ['0'];
    });
    this.option = new GridOption({
      url: '/api/Auction/Dictionary/GetList',
      scroll: { x: '750px' },
    });

    this.columns = [
      new StringColumn({
        display: '模块编码',
        field: 'ModCode',
        width: '100px',
        left: '0px',
        isEllipsis: true,
      }),
      new StringColumn({
        display: '字典Key',
        field: 'DictName',
        width: '200px',
        // isEllipsis: true,
      }),
      new StringColumn({ display: '字典名称', field: 'Value' }),
      new ButtonColumn({
        display: '操作',
        field: 'Operate',
        onlyText: true,
        width: '90px',
        right: '0px',
        template: 'operate',
        inSearch: false,
      }),
    ];
    this.setDictNameValidate();
  }

  setDictNameValidate() {
    if (this.selectedKey && +this.selectedKey[0] > 0) {
      this.form.controls['DictName'].setValidators([]);
      this.form.updateValueAndValidity();
    }
  }

  buildTree() {
    return this.auctionSvc.dict.getList().pipe(
      map((resp) => {
        const dict = resp.Data.filter((item) => item.ParentId === 0);
        const nodes = this.createTreeNodesOptions(dict);
        this.rootNode.addChildren(nodes);
        return resp;
      })
    );
  }

  createTreeNodesOptions(data: Array<any>): NzTreeNodeOptions[] {
    let nodes: NzTreeNodeOptions[] = [];
    if (!Util.IsNullOrEmpty(data)) {
      nodes = data.map((entity) => {
        const option: NzTreeNodeOptions = {
          key: entity.Id,
          title: entity.Value,
          isLeaf: true,
          selected: false,
          dictName: entity.DictName,
        };
        return option;
      });
    }
    return nodes;
  }

  editUserInfo(id?: string): void {
    this.isVisible = true;
    if (Util.isUndefinedOrNull(id)) {
      this.title = '新增用户信息';
    } else {
      this.title = '编辑用户信息';
    }
  }

  nzEvent(ev) {
    const key = ev.node.key;
    this.nodeId = key;
    this.selectedKey[0] = key + '';
    this.reload = true;
    this.setDictNameValidate();
    this.form.controls['DictName'].patchValue(ev.node?.origin?.dictName);
  }

  deleteUser(id: any) {
    this.auctionSvc.userPage.detele(id).subscribe((item) => {
      this.nzMsgSvc.success('删除成功！');
      this.reload = true;
    });
  }

  edit() {
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
  }

  save() {
    for (const i in this.form.controls) {
      if (this.form.controls.hasOwnProperty(i)) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
      }
    }
    const entity = Object.assign({}, this.form.value, { ParentId: this.nodeId });
    if (this.form.valid) {
      this.auctionSvc.dict.save(entity).subscribe((data) => {
        this.reload = true;
        this.isVisible = false;
      });
    }
  }
}
