import { HttpClient } from './../HttpClient.service';
import { Injectable } from '@angular/core';
import { Configuration } from '../../../app.configuration';
import { Response} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
@Injectable()
export class DashBoardApiService {
    public actionUrl: string;
    constructor(private _congiguration: Configuration, private authHttp: HttpClient) {
        this.actionUrl = this._congiguration.ServerWithApiUrl;
    }
    getUsers(url: string) {
      return this.authHttp.get(this.actionUrl + url)
        .map((res:Response) =>this.extractData(res)).catch(this.handleError);
    }
    private extractData(res: Response) {
        const body =JSON.parse(res.json());
        return body;
    }
    private handleError(error: Response | any) {
        return Observable.throw(error.message || error);
    }
}
