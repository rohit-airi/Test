import { HttpClient } from './../HttpClient.service';
import { Injectable } from '@angular/core';
import { Configuration } from '../../../app.configuration';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
@Injectable()
export class LogApiService {
    public actionUrl: string;
    constructor(private _congiguration: Configuration, private _http: Http, private authHttp:HttpClient) {
      this.actionUrl = this._congiguration.ServerWithApiUrl;
    }

    logCommentUploadApi(url: string,files:File,uploadType: string,fileToDelete: string[]) {
      const formlength=files['length'];
      const formData: any = new FormData();
      for(let i=0; i<formlength; i++) {
        formData.append('file', files[i]);
      }
        return this._http.post(this.actionUrl + url + '?UserId=1234&uploadType='+uploadType+'&filetodelete='+fileToDelete+'', formData)
        .map((res: Response) => this.extractData(res)).catch(this.handleError);
    }

    logCommentAddApi(url: string, model: any) {
        return this.authHttp.post(this.actionUrl + url, model)
        .map((res: Response) => this.extractData(res)).catch(this.handleError);
    }

    logCommentListApi(url: string,merchantModel:any) {
         return this.authHttp.post(this.actionUrl + url,merchantModel).map(
           (res: Response) => this.extractData(res)).catch(this.handleError);
    }
    ParentListApi(url: string) {
        return this.authHttp.get(this.actionUrl + url).map((res: Response) => this.extractData(res)).catch(this.handleError);
    }
    ChildByParentListApi(url: string, sku: string) {
        return this.authHttp.get(this.actionUrl + url + '?sku=' + sku).map((res: Response) => this.extractData(res))
        .catch(this.handleError);
    }
    logDeleteApi(url: string, logDeleteModel: any) {
        return this.authHttp.post(this.actionUrl + url,logDeleteModel).map((res: Response) => this.extractData(res))
        .catch(this.handleError);
    }
    public extractData(res: Response) {
        const body = JSON.parse(res.json());
        return body;
    }
    public handleError(error: Response | any) {
        return Observable.throw(error.message || error);
    }
}
