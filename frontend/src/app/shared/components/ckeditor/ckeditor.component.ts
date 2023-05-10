import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { CkEditorConfig } from './config';

@Component({
  selector: 'app-ckeditor',
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.less'],
})
// https://ckeditor.com/docs/ckeditor5/latest/installation/frameworks/angular.html
export class CkeditorComponent implements OnInit, AfterViewInit {
  @ViewChild('toobar') toobar: ElementRef;
  @ViewChild('ck') ck: ElementRef;
  editor: any;
  config: any = CkEditorConfig;
  isDisabled: boolean = false;
  public onReady(editor: any): void {
    //using `any` is a temporary workaround for https://github.com/ckeditor/ckeditor5/issues/13838
    const decoupledEditor = editor;
    const element = decoupledEditor.ui.getEditableElement()!;
    const parent = element.parentElement!;
    // Array.from(editor.ui.componentFactory.names()); // 为了解决toolbarview-item-unavailable错误
    parent.insertBefore(decoupledEditor.ui.view.toolbar.element!, element);
  }
  constructor() {
    this.config = CkEditorConfig;
    this.editor = DecoupledEditor;
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {}

  onChange({ editor }: ChangeEvent) {
    // if (editor.getData()) {
    // const data = editor.getData();
    console.log(editor);
    // }
  }
}
