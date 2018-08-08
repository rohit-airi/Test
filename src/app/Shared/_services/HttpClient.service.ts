import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import { HttpParams } from '@angular/common/http';
@Injectable()
export class HttpClient {

  constructor(private http: Http) {}

  createAuthorizationHeader(headers: Headers) {
    const loginUser=JSON.parse(localStorage.getItem('auth_token'));
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization','Bearer '+loginUser.access_token+'');
  }

  get(url) {
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(url, {
      headers: headers
    });
  }

  post(url, data) {
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.post(url, data, {
      headers: headers
    });
  }
  getWithParams(url,data) {
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(url,{
      headers: headers,
      params:data
    });
  }
  delete(url,data) {
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(url,{
      headers: headers,
      params:data,
    });
  }
}
