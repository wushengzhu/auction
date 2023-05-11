import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ArticleComponent } from './pages/article/article.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { SharedModule } from './shared/shared.module';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { MaterialComponent } from './pages/material/material.component';
import { PublishComponent } from './pages/publish/publish.component';
import { AuctionBidComponent } from './pages/auction-bid/auction-bid.component';
import { MyBidComponent } from './pages/my-bid/my-bid.component';
import { ReceiveComponent } from './pages/receive/receive.component';
import { ReturnComponent } from './pages/return/return.component';
import { MaterialEditComponent } from './components/material-edit/material-edit.component';
import { PublishEditComponent } from './components/publish-edit/publish-edit.component';
import { BidDetailComponent } from './components/bid-detail/bid-detail.component';
import { BidRecordComponent } from './components/bid-record/bid-record.component';
import { DictionaryComponent } from './pages/dictionary/dictionary.component';
import { ReceiveEditComponent } from './components/receive-edit/receive-edit.component';

registerLocaleData(zh);
const components = [
  PageNotFoundComponent,
  UserListComponent,
  RegisterComponent,
  LoginComponent,
  HomeComponent,
  ArticleComponent,
  UserInfoComponent,
  MaterialComponent,
  PublishComponent,
  AuctionBidComponent,
  MyBidComponent,
  ReceiveComponent,
  ReturnComponent,
  MaterialEditComponent,
  PublishEditComponent,
  BidDetailComponent,
  BidRecordComponent,
  DictionaryComponent,
  ReceiveEditComponent,
];
@NgModule({
  declarations: [AppComponent, ...components],
  imports: [BrowserAnimationsModule, CommonModule, BrowserModule, AppRoutingModule, HttpClientModule, SharedModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
