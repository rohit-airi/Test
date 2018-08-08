import { Injectable } from '@angular/core';
import { Configuration } from '../../../app.configuration';
import { Response} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
@Injectable()
export class ImportApiService {
  public actionUrl: string;
  constructor(private _congiguration: Configuration) {
    this.actionUrl = this._congiguration.ServerWithApiUrl;
  }
  public extractData(res: Response) {
    const body = res.json();
    return body;
  }
  public handleError(error: Response | any) {
    return Observable.throw(error.message || error);
  }
}
