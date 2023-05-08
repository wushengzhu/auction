import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // 登录状态
  isLoginIn = false;
  // 保存登录后重定向的路径
  redirectUrl: string;
  constructor(private storageSvc:StorageService, private router: Router,private nzMessageSvc:NzMessageService){}
  login(): Observable<boolean> {
    return of(true).pipe(
      delay(1000),
      // 用于执行来自源 Observable 发出的副作用
      tap(() => (this.isLoginIn = true))
    );
  }

  loginOut(): void {
    this.isLoginIn = false;
    this.nzMessageSvc.success('退出成功！')
    this.storageSvc.remove('token');
    this.router.navigate(['/login']);
  }
}
