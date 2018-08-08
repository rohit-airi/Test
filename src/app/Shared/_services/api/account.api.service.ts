import { Injectable } from '@angular/core';
import { Configuration } from '../../../app.configuration';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
@Injectable()
export class AccountApiService {
  public actionUrl: string;
  constructor(private _configuration: Configuration, private _http: Http) {
    this.actionUrl = this._configuration.ServerWithApiUrl;
  }
  getAllCountry(url:string) {
    return this._http.get(this.actionUrl+url).map((res: Response) => this.extractData(res)).catch(this.handleError);
  }
  registerUser(url:string,registerModel:any) {
    return this._http.post(this.actionUrl+url,registerModel).map((res:Response)=>this.extractData(res)).catch(this.handleError);
  }
  userForgotPassword(url: string, mail: string) {
    return this._http.post(this.actionUrl + url + '?email=' + mail, null).map((res: Response) => res.json()).catch(this.handleError);
  }
  public extractData(res: Response) {
    const body = JSON.parse(res.json());
    return body;
  }
  public handleError(error: Response | any) {
    return Observable.throw(error.message || error);
  }
}
