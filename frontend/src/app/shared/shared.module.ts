import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuctionService } from '../services/auction.service';
import { ArticleEditComponent } from './components/article-edit/article-edit.component';
import { GridColumnTemplateDirective } from './components/grid-list/grid-column-template.directive';
import { GridListComponent } from './components/grid-list/grid-list.component';
import { GridUtilService } from './components/grid-list/grid-util.service';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { ThirdExportModule, ThirdModule } from './thrid.module';
import { ColumnEnumComponent } from './components/grid-list/column-enum/column-enum.component';
import { ResetPwdComponent } from './components/reset-pwd/reset-pwd.component';
import { PageFooterComponent } from './components/page-footer/page-footer.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { MomentDatePipe, SimplifyPathPipe, TimeFormaterPipe, PricePipe } from './pipes';
import { AttachmentComponent } from './components/attachment/attachment.component';
import { CkeditorComponent } from './components/ckeditor/ckeditor.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DictSelectComponent } from './components/dict-select/dict-select.component';

const SharedPipes = [MomentDatePipe, SimplifyPathPipe, TimeFormaterPipe, PricePipe];
const components = [
  CkeditorComponent,
  AttachmentComponent,
  PageHeaderComponent,
  PageFooterComponent,
  ResetPwdComponent,
  UserEditComponent,
  GridListComponent,
  ArticleEditComponent,
  ColumnEnumComponent,
  DictSelectComponent,
];
const directives = [GridColumnTemplateDirective];

@NgModule({
  declarations: [...SharedPipes, ...components, ...directives],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ...ThirdModule, CKEditorModule],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, ...directives, ...ThirdExportModule, ...components, ...SharedPipes],
  providers: [AuctionService, GridUtilService],
})
export class SharedModule {}
