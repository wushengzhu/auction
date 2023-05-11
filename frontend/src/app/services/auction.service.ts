import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuctionService {
  token: any;
  constructor(private http: HttpClient) {}
  getData(url: string, entity?: any, option?) {
    return this.http.post(url, entity).pipe(map((r: any) => r?.Data));
  }

  loginRecord = {
    save: (entity: any) => {
      return this.http.post(`/api/Auction/LoginRecord/Save`, entity);
    },
    getList: (curPage: number = 1, pageSize: number = 10) => {
      return this.http
        .post(`/api/Auction/LoginRecord/GetList`, {
          pageSize: pageSize,
          curPage: curPage,
        })
        .pipe(map((item: any) => item.Data));
    },
  };

  loginPage = {
    login: (entity: any) => {
      return this.http.post(`/api/Auction/User/Login`, entity);
    },
  };

  articlePage = {
    articleList: (pageSize = 10, curPage) => {
      return this.http
        .post(`/api/Auction/LoginRecord/GetList`, {
          pageSize: pageSize,
          curPage: curPage,
        })
        .pipe(map((item: any) => item.Data));
    },
  };

  dict = {
    getList: (curPage = 1, pageSize = 10, dictName: string = '') => {
      return this.http
        .post(`/api/Auction/Dictionary/GetList`, {
          pageSize: pageSize,
          curPage: curPage,
          filters: [{ field: 'DictName', op: '$in', value: dictName }],
        })
        .pipe(map((item: any) => item.Data));
    },
    getById: (id: any) => {
      return this.http.get(`/api/Auction/Dictionary/getById?userId=${id}`);
    },
    detele: (id: any) => {
      return this.http.post('/api/Auction/Dictionary/Delete', { id: id });
    },
    save: (entity: any) => {
      return this.http.post('/api/Auction/Dictionary/Save', entity);
    },
  };

  material = {
    getList: (curPage = 1, pageSize = 0) => {
      return this.http
        .post(`/api/Auction/Material/GetList`, {
          pageSize: pageSize,
          curPage: curPage,
          filters: [],
        })
        .pipe(map((item: any) => item.Data));
    },
    getById: (id: any) => {
      return this.http.get(`/api/Auction/Material/getById?userId=${id}`);
    },
    detele: (id: any) => {
      return this.http.post('/api/Auction/Material/Delete', { id: id });
    },
    save: (entity: any) => {
      return this.http.post('/api/Auction/Material/Save', entity);
    },
  };

  publish = {
    getList: (curPage = 1, pageSize = 0, queryStatus: number = -1) => {
      return this.http
        .post(`/api/Auction/Publish/GetList`, {
          queryStatus: queryStatus,
          pageSize: pageSize,
          curPage: curPage,
          filters: [],
        })
        .pipe(map((item: any) => item.Data));
    },
    getById: (id: any) => {
      return this.http.get(`/api/Auction/Publish/getById?publishId=${id}`);
    },
    detele: (id: any) => {
      return this.http.post('/api/Auction/Publish/Delete', { id: id });
    },
    confirm: (ids: Array<any>) => {
      return this.http.post('/api/Auction/Publish/UpdateStatus', { ids: ids, status: 4 });
    },
    save: (entity: any) => {
      return this.http.post('/api/Auction/Publish/Save', entity);
    },
  };

  bidRecord = {
    getList: (curPage = 1, pageSize = 0) => {
      return this.http
        .post(`/api/Auction/BidRecord/GetList`, {
          pageSize: pageSize,
          curPage: curPage,
          filters: [],
        })
        .pipe(map((item: any) => item.Data));
    },
    getById: (id: any) => {
      return this.http.get(`/api/Auction/BidRecord/getById?userId=${id}`);
    },
    detele: (id: any) => {
      return this.http.post('/api/Auction/BidRecord/Delete', { id: id });
    },
    save: (entity: any) => {
      return this.http.post('/api/Auction/BidRecord/Save', entity);
    },
  };

  file = {
    image: (name: string, file: any) => {
      return this.http.post(`/api/File/Image/Upload`, {
        imageName: name,
        imageData: file,
      });
    },
    attachInfo: (entity: any) => {
      return this.http.post(`/api/File/Attachment/Save`, entity);
    },
    download: (id) => {
      return this.http.get(`/api/File/Attachment/Download?id=${id}`);
    },
    fileList: (modCode: string, objectId: number) => {
      return this.http.post(`/api/File/Attachment/GetFileList`, { modCode, objectId });
    },
  };

  userPage = {
    userList: (curPage = 1, pageSize = 10) => {
      return this.http
        .post(`/api/Auction/User/GetList`, {
          pageSize: pageSize,
          curPage: curPage,
        })
        .pipe(map((item: any) => item.Data));
    },
    getById: (id: any) => {
      return this.http.get(`/api/Auction/User/getById?userId=${id}`);
    },
    detele: (id: any) => {
      return this.http.post('/api/Auction/User/Delete', { id: id });
    },
    save: (entity: any) => {
      return this.http.post('/api/Auction/User/Save', entity);
    },
    updatePwd: (entity: any) => {
      return this.http.post('/api/Auction/User/UpdatePassword', entity);
    },
  };
}
