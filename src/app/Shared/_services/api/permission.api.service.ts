import { Injectable } from '@angular/core';
import { Configuration } from '../../../app.configuration';
import { Http, Headers, RequestOptions, URLSearchParams, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
@Injectable()
export class PermissionApiService {
    public actionUrl: string;
    constructor(private _configuration: Configuration, private _http: Http) {
        this.actionUrl = this._configuration.ServerWithApiUrl;
    }
    userPermissionListApi(url: string) {
        return this._http.get(this.actionUrl + url).map((res: Response) => res.json()).catch(this.handleError);
    }
    userPermissionAuditApi(url: string, model: any) {
        const _headers = new Headers();
        _headers.set('Content-Type', 'application/json');
        _headers.set('Accept', 'application/json');
        const _params = new URLSearchParams();
        const options = new RequestOptions({ headers: _headers, params: _params });
        return this._http.post(this.actionUrl + url, model, options).map((res: Response) => res.json()).catch(this.handleError);
    }
    public handleError(error: Response | any) {
        return Observable.throw(error.message || error);
    }
}
