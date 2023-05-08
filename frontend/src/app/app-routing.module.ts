import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ArticleComponent } from './pages/article/article.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ArticleEditComponent } from './shared/components/article-edit/article-edit.component';
import { MaterialComponent } from './pages/material/material.component';
import { PublishComponent } from './pages/publish/publish.component';
import { MyBidComponent } from './pages/my-bid/my-bid.component';
import { AuctionBidComponent } from './pages/auction-bid/auction-bid.component';
import { ReturnComponent } from './pages/return/return.component';
import { ReceiveComponent } from './pages/receive/receive.component';
import { DictionaryComponent } from './pages/dictionary/dictionary.component';
import { PublishEditComponent } from './components/publish-edit/publish-edit.component';
import { BidDetailComponent } from './components/bid-detail/bid-detail.component';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: '首页' },
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      {
        path: 'home',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            component: HomeComponent,
            children: [
              {
                path: 'auction',
                children: [
                  {
                    path: 'material',
                    component: MaterialComponent,
                  },
                  {
                    path: 'publish',
                    component: PublishComponent,
                  },
                  {
                    path: 'publish-edit',
                    component: PublishEditComponent,
                  },
                  {
                    path: 'auction-bid',
                    component: AuctionBidComponent,
                  },
                  {
                    path: 'my-bid',
                    component: MyBidComponent,
                  },
                  {
                    path: 'bid-detail',
                    component: BidDetailComponent,
                  },
                ],
              },
              {
                path: 'receive',
                component: ReceiveComponent,
              },
              {
                path: 'return',
                component: ReturnComponent,
              },
              {
                path: 'article',
                children: [
                  { path: 'publish', component: ArticleComponent },
                  { path: 'edit', component: ArticleEditComponent },
                ],
              },
              {
                path: 'dictionary',
                component: DictionaryComponent,
              },
              {
                path: 'person',
                children: [
                  { path: 'list', component: UserListComponent },
                  { path: 'info', component: UserInfoComponent },
                  // { path: 'setting' },
                ],
              },
              { path: '**', component: PageNotFoundComponent },
            ],
          },
          { path: '**', component: PageNotFoundComponent },
        ],
      },
    ],
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
