import { Directive, TemplateRef, Input } from '@angular/core';

@Directive({
  selector: '[ck-editor]',
})
export class CkEditorDirective {
  @Input()
  name: string;

  init: boolean = false;

  constructor(public templateRef: TemplateRef<any>) {}
}
