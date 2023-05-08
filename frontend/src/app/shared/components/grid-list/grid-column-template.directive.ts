import { Directive, TemplateRef, Input } from '@angular/core';

@Directive({
  selector: '[gridColumnTemplate]',
})
export class GridColumnTemplateDirective {
  @Input()
  name: string;

  init: boolean = false;

  constructor(public templateRef: TemplateRef<any>) {}
}