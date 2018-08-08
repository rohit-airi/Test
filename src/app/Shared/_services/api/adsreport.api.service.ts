import { Injectable } from '@angular/core';
import { Configuration } from '../../../app.configuration';
import { Response} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { HttpClient } from '../HttpClient.service';
@Injectable()
export class AdsReportApiService {
    public actionUrl: string;
    constructor(private _congiguration: Configuration, private authhttp: HttpClient) {
        this.actionUrl = this._congiguration.ServerWithApiUrl;
    }
    private extractData(res: Response) {
        const body = res.json();
        return body;
    }
    private handleError(error: Response | any) {
        return Observable.throw(error.message || error);
    }
}
