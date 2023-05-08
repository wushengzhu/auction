import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  ErrorHandler,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

export interface LazyResult {
  path: string;
  loaded: boolean;
  status: 'ok' | 'error';
  error?: {};
}

@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.less'],
})
export class ArticleEditComponent implements OnInit {
  form: FormGroup;
  @ViewChild('ck') ck: ElementRef;
  private list: { [key: string]: boolean } = {};
  private cached: { [key: string]: LazyResult } = {};
  details: any;
  /**
   * 富文本
   */
  editorContent;

  setDetails(details: string): void {
    this.editorContent = details;
  }
  // tslint:disable-next-line:no-any
  constructor(@Inject(DOCUMENT) private doc: any, private fb: FormBuilder) {}
  ngOnInit() {
    this.form = this.fb.group({
      Id: [null],
      Title: [null],
      Content: [null],
      Creator: [null],
      CreateTime: [null],
    });
    this.load('http://127.0.0.1:2022/ckeditor/ckeditor.js').then((r) => {
      // 用eval是为了规避掉CKEDITOR打包是报错：不存在当前name的错误
      eval(
        "CKEDITOR.replace(this.ck.nativeElement);window.parent.CKEDITOR.tools.callFunction(2, '/uploads/ckImage', '');"
      );
    });
  }

  clear(): void {
    this.list = {};
    this.cached = {};
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
            if (
              node.readyState === 'loaded' ||
              node.readyState === 'complete'
            ) {
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
  loadStyle(
    path: string,
    rel: string = 'stylesheet',
    innerContent?: string,
    target?: HTMLElement
  ): Promise<LazyResult> {
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
