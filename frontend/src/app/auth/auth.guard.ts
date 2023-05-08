// auth.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  // 引入服务
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): true | UrlTree {
    const url: string = state.url; // 将要跳转的路径
    return this.checkLogin(url);
  }

  private checkLogin(url: string): true | UrlTree {
    // 已经登录，直接返回true
    if (this.authService.isLoginIn) {
      return true;
    }
    // 修改登陆后重定向的地址
    this.authService.redirectUrl = url;
    this.authService.isLoginIn = true;
    // 重定向到登录页面
    return this.router.parseUrl(url);
  }
}
