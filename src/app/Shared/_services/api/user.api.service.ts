import { HttpClient } from '../../../Shared/_services/HttpClient.service';
import { Injectable } from '@angular/core';
import { Configuration } from '../../../app.configuration';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
@Injectable()
export class UserApiService {
  public actionUrl: string;
  public _header: Headers;
  constructor(private _http: Http,private authHttp:HttpClient, private _congiguration: Configuration) {
    const loginUser=JSON.parse(localStorage.getItem('auth_token'));
    this.actionUrl = this._congiguration.ServerWithApiUrl;
      this._header = new Headers();
      this._header.set('Content-Type', 'application/json');
      this._header.set('Authorization','Bearer '+loginUser.access_token+'');
  }
  registerApi(url: string, model: any) {
    return this._http.post(this.actionUrl + url, model)
      .map((res: Response) => res.json()).catch(this.handleError).subscribe(data => console.log(data));
  }
  EmailCheckApi(url: string, email: string) {
    return this.authHttp.post(this.actionUrl + url + '?email=' + email, null)
    .map((res: Response) => this.extractData(res)).catch(this.handleError);
  }
  userInfoUpdateApi(url: string, model: any): any {
    return this.authHttp.post(this.actionUrl + url,model).map(this.extractData);
  }
  userPasswordSettingApi(url: string, model: any) {
    return this._http.post(this.actionUrl + url, model,{ headers: this._header },)
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }
  userDelete(url: string, deleteModel: any) {
    return this.authHttp.post(this.actionUrl + url, deleteModel)
      .map((res: Response) => this.extractData(res)).catch(this.handleError);
  }
  getallUserByParentId(url: string, model:any) {
    return this.authHttp.post(this.actionUrl + url,model)
    .map((res:Response)=>this.extractData(res)).catch(this.handleError);
  }
  public extractData(res: Response) {
    const body =JSON.parse(res.json());
    return body;
  }
  public handleError(error: Response | any) {
    return Observable.throw(error.message || error);
  }
}
