import { Router } from '@angular/router';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private router: Router, private authSvc: AuthService, private mesSvc: NzMessageService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = req.url;
    const token = localStorage.getItem('token');
    // 排除登录接口
    if ((!url.includes('Login') || !url.includes('Register')) && token) {
      req = req.clone({
        url,
        setHeaders: {
          authorization: token,
        },
        // 请求头统一添加token
      });
    }

    return next.handle(req).pipe(
      tap(
        (val) => {
          if (token) {
            this.authSvc.isLoginIn = true;
          } else {
            // 注册时上传图片时
            !url.includes('Upload') && this.router.navigate(['/login']);
          }
        },
        (err) => {
          if (err.status) {
            this.router.navigate(['/login']);
          } else {
            this.mesSvc.error(`请求失败：${err?.status} ${err?.statusText}`);
          }
          // this.router.navigate(['/login']);
          // localStorage.removeItem('token');
        }
      )
    );
  }
}
