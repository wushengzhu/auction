import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

export interface LazyResult {
  path: string;
  loaded: boolean;
  status: 'ok' | 'error';
  error?: {};
}

@Component({
  selector: 'app-ckeditor',
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.less'],
})
// https://ckeditor.com/docs/ckeditor5/latest/api/module_core_editor_editorconfig-EditorConfig.html
export class CkeditorComponent implements OnInit {
  editor: any;
  @ViewChild('ck') ck: ElementRef;
  private list: { [key: string]: boolean } = {};
  private cached: { [key: string]: LazyResult } = {};

  constructor(@Inject(DOCUMENT) private doc: any) {
    this.load('assets/ckeditor5-build-classic/ckeditor.js').then((r) => {
      // 用eval是为了规避掉CKEDITOR打包是报错：不存在当前name的错误
      eval("CKEDITOR.replace(this.ck.nativeElement);window.parent.CKEDITOR.tools.callFunction(2, '/uploads/ckImage', '');");
    });
  }

  private initConfig() {
    this.editor = CKEDITOR.replace('editor');
    // 界面语言，默认为 'en'
    this.editor.config.language = 'zh-cn';
    // 样式
    // this.editor.config.uiColor = '#66AB16';
    // 工具栏（基础'Basic'、全能'Full'、自定义）plugins/toolbar/plugin.js
    this.editor.config.toolbar = 'Basic';
    //工具栏是否可以被收缩
    this.editor.config.toolbarCanCollapse = true;
    //工具栏的位置
    this.editor.config.toolbarLocation = 'top'; //可选：bottom
    //工具栏默认是否展开
    this.editor.config.toolbarStartupExpanded = true;
    //设置HTML文档类型
    // this.editor.config.docType =
    //   '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd%22';
    //是否使用HTML实体进行输出 plugins/entities/plugin.js
    this.editor.config.entities = true;
    // //是否使用完整的html编辑模式 如使用，其源码将包含：<html><body></body></html>等标签
    // this.editor.config.fullPage = true;
    // //是否忽略段落中的空字符 若不忽略 则字符将以“”表示 plugins/wysiwygarea/plugin.js
    // this.editor.config.ignoreEmptyParagraph = true;
    // this.editor.config.extraPlugins = [extraPlugins];
    // this.editor.config.filebrowserImageBrowseUrl = 'http://192.168.11.10:8080/api/new_pic?id=1';
    // this.editor.config.filebrowserBrowseUrl = '/App/Back/Public/ckfinder/ckfinder.html';
    // this.editor.config.filebrowserBrowseUrl = '/apps/ckfinder/3.4.5/ckfinder.html'
    // 上传图片路径
    // this.editor.config.filebrowserImageUploadUrl =
    //   environment.restBaseUrl + '/news';
    // this.editor.config.filebrowserImageUploadUrl = '/news';
    // this.editor.config.removeDialogTabs='image:advanced;link:advanced'
    // this.editor.config.removeDialogTabs='image:advanced;';
    // this.editor.config.removeDialogTabs='image:advanced;image:linkId';
    this.editor.config.removeDialogTabs = 'image:advanced;image:Link';
    //预览区域显示内容
    this.editor.config.image_previewText = ' ';
    // this.editor.on('fileUploadResponse', (evt: any) => {
    //   // Prevent the default response handler.
    //   evt.stop();

    //   // Get XHR and response.
    //   const data = evt.data,
    //     xhr = data.fileLoader.xhr,
    //     response = xhr.responseText.split('|');

    //   if (response[1]) {
    //     // An error occurred during upload.
    //     data.message = response[1];
    //     evt.cancel();
    //   } else {
    //     const str = JSON.parse(response[0]);
    //     if (str && str['status'] === MessageCode.success) {
    //       data.url =
    //         environment.restBaseUrl + '/new_pic?name=' + str['pic_name'];
    //       this.pic_ids.push('' + str['pic_name']);
    //     } else {
    //       evt.cancel();
    //       this.modal.error({
    //         nzTitle: Message.error,
    //         nzContent: str['msg'],
    //         nzOnOk: () => {
    //         }
    //       });
    //     }
    //   }
    // });
    this.editor.on('fileUploadRequest', (evt: any) => {
      const fileLoader = evt.data.fileLoader;
      const formData = new FormData();
      const xhr = fileLoader.xhr;
      // 上传图片，发送请求保存到服务器
      xhr.open('POST', fileLoader.uploadUrl, true);
      formData.append('upload', fileLoader.file, fileLoader.fileName);
      fileLoader.xhr.send(formData);

      //  this.savePic(fileLoader);
      // Prevented the default behavior.
      evt.stop();
    });
    this.editor.on('instanceReady', (e: any) => {
      // console.log(e);
      // e.editor.widgets.on('instanceCreated', function(params: any) {
      //   console.log('editor创建', params)
      // });
      // var upload = e.editor.uploadRepository
      // upload.on('instanceCreated', function(eve: any) {
      //   alert('112233')
      // });
      // e.editor.on('change', (change: any) => {
      //   this.globalVariableService.isEdit = true;
      // });
    });
  }

  ngOnInit(): void {
    this.initConfig();
  }

  load(paths: string | string[]): Promise<LazyResult[]> {
    if (!Array.isArray(paths)) {
      paths = [paths];
    }

    const promises: Array<Promise<LazyResult>> = [];
    paths.forEach((path) => {
      let p = path;
      const queIndex = path.indexOf('?');
      if (queIndex !== -1) {
        p = p.substring(0, queIndex);
      }
      if (p.endsWith('.js')) {
        promises.push(this.loadScript(path));
      } else {
        promises.push(this.loadStyle(path));
      }
    });
    // 假如script引入多个
    return Promise.all(promises).then((res) => {
      return Promise.resolve(res);
    });
  }

  // 加载script
  loadScript(path: string, innerContent?: string): Promise<LazyResult> {
    return new Promise((resolve) => {
      if (this.list[path] === true) {
        resolve(this.cached[path]);
        return;
      }
      this.list[path] = true;
      const onSuccess = (item: LazyResult) => {
        this.cached[path] = item;
        resolve(item);
      };
      setTimeout(() => {
        // tslint:disable-next-line:no-any
        const node = this.doc.createElement('script') as any;
        // 创建一个script标签
        node.type = 'text/javascript';
        node.src = path;
        node.charset = 'utf-8';
        if (innerContent) {
          node.innerHTML = innerContent;
        }
        if (node.readyState) {
          // IE
          node.onreadystatechange = () => {
            if (node.readyState === 'loaded' || node.readyState === 'complete') {
              node.onreadystatechange = null;
              onSuccess({
                path,
                loaded: true,
                status: 'ok',
              });
            }
          };
        } else {
          node.onload = () =>
            onSuccess({
              path,
              loaded: true,
              status: 'ok',
            });
        }
        node.onerror = (error: {}) =>
          onSuccess({
            path,
            loaded: false,
            status: 'error',
            error,
          });
        // 在head标签加入子标签script
        this.doc.getElementsByTagName('head')[0].appendChild(node);
      });
    });
  }

  // 加载样式
  loadStyle(path: string, rel: string = 'stylesheet', innerContent?: string, target?: HTMLElement): Promise<LazyResult> {
    return new Promise((resolve) => {
      if (this.list[path] === true) {
        resolve(this.cached[path]);
        return;
      }
      this.list[path] = true;
      const node = this.doc.createElement('link') as HTMLLinkElement;
      node.rel = rel;
      node.type = 'text/css';
      node.href = path;
      if (innerContent) {
        node.innerHTML = innerContent;
      }
      if (!target) {
        target = this.doc.getElementsByTagName('head')[0];
      }
      target.appendChild(node);
      const item: LazyResult = {
        path,
        loaded: true,
        status: 'ok',
      };
      this.cached[path] = item;
      resolve(item);
    });
  }
}
