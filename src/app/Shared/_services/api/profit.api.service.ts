import { Injectable } from '@angular/core';
import { Configuration } from '../../../app.configuration';
import { Headers, Response} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { HttpClient } from '../HttpClient.service';
@Injectable()
export class ProfitApiService {
    public actionUrl: string;
    public _header: Headers;
    constructor(private _configuration: Configuration, private authHttp:HttpClient) {
        this.actionUrl = this._configuration.ServerWithApiUrl;
    }
    searchResultByFilterApi(url: string, model: any) {
        return this.authHttp.post(this.actionUrl + url, model).map((res: Response) => this.extractData(res)).catch(this.handleError);
    }
    searchResultByProfitLoss(url: string, model: any) {
      return this.authHttp.post(this.actionUrl + url, model).map((res: Response) => this.extractData(res)).catch(this.handleError);
    }
    downloadResultByFilter(url: string, model:any) {
      return this.authHttp.post(this.actionUrl + url, model).map((res: Response) => res).catch(this.handleError);
    }
    downloadProfitLossResultByFilter(url: string, model:any) {
      return this.authHttp.post(this.actionUrl + url, model).map((res: Response) => res).catch(this.handleError);
    }
    public extractData(res: Response) {
        const body =JSON.parse(res.json());
        return body;
    }
    public handleError(error: Response | any) {
        return Observable.throw(error.message || error);
    }
}
