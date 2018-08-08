import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Configuration } from '../../../app.configuration';
import { Http, Response} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { HttpClient } from '../HttpClient.service';
@Injectable()
export class ParentApiService {
  public actionUrl: string;
  constructor(private _router:Router, private _congiguration: Configuration, private _http: Http, private authHttp:HttpClient) {
    this.actionUrl = this._congiguration.ServerWithApiUrl;
  }
  UploadExcelApi(url: string, file: File,type:string,userId:string,merchantId:string) {
    const formData: any = new FormData();
    formData.append('file', file, file.name);
    return this._http.post(this.actionUrl + url + '?type='+type+'&UserId='+userId+'&merchantId='+merchantId , formData)
      .map((res: Response) => this.extractData(res)).catch(this.handleError);
  }
  ChildListApi(url: string, params: any) {
    return this.authHttp.getWithParams(this.actionUrl + url,params)
    .map((res: Response) => this.extractData(res))
    .catch(this.handleError);
  }
  DeleteparentOrChild(url: string, ParentOrChildModel:any) {
    return this.authHttp.getWithParams(this.actionUrl+url,ParentOrChildModel)
      .map((res: Response) => this.extractData(res)).catch(this.handleError);
  }
  ParentListApi(url: string,params:any) {
    return Observable.forkJoin(
    this.authHttp.getWithParams(this.actionUrl + url,params).
    map((res: Response) => this.extractData(res)).catch(this.handleError),
    );
  }
  AddOrUpdateReportSeeting(url:string, ReportSettingModel: any) {
    return this.authHttp.post(this.actionUrl + url, ReportSettingModel,)
      .map((res:Response)=>this.extractData(res)).catch(this.handleError);
  }
  getAllReportByMerchantIdandMarketPlcaeId(url:string, amazonModel:any) {
    return Observable.forkJoin(
    this.authHttp.post(this.actionUrl+url, amazonModel)
      .map((res:Response)=>this.extractData(res)).catch(this.handleError)
    );
  }
  updateReportType(url:string, reportModel:any) {
    return this.authHttp.post(this.actionUrl+url,reportModel)
    .map((res:Response)=>this.extractData(res)).catch(this.handleError);
  }
  UploadDSTBCIReport(url: string, file: any, reportDate: string,mercahntId: string,marketPlaceId:string) {
    const formData: any = new FormData();
    formData.append('file', file, file.name);
    const uploadUrl= this.actionUrl + url +'?reportDate='+ reportDate +'&merchantId='+mercahntId+'&marketplaceId='+marketPlaceId;
    return this._http.post(uploadUrl,formData)
      .map((res: Response) => this.extractData(res)).catch(this.handleError);
  }
  getLastUploadFileDate(marketPlaceUrl:string,url:string,merchantModel:any) {
    return Observable.forkJoin(
    this.authHttp.getWithParams(this.actionUrl +url,merchantModel).
      map((res:Response)=> this.extractData(res)).catch(this.handleError),
    this.authHttp.post(this.actionUrl+marketPlaceUrl,merchantModel)
      .map((res:Response)=> this.extractData(res)).catch(this.handleError)
    );
  }
  SampleFileNavigation (url:string) {
    window.location.href=this._congiguration.Server + url;
  }
  private extractData(res: Response) {
    const body = JSON.parse(res.json());
    return body;
  }
  private handleError(error: Response | any) {
    return Observable.throw(error.message || error);
  }
}
