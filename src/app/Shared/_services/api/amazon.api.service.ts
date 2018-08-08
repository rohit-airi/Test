import { Injectable } from '@angular/core';
import { Configuration } from '../../../app.configuration';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { HttpClient } from '../HttpClient.service';
import { reset_Advertisement } from './api.url';
@Injectable()
export class AmazonApiService {
    private actionUrl: string;
    constructor(private _congiguration: Configuration, private _authHttp:HttpClient) {
        this.actionUrl =this._congiguration.ServerWithApiUrl;
    }
    validateSignUpAccount(url:string,accountModel:any) {
        return this._authHttp.post(this.actionUrl+url,accountModel)
        .map((res:Response) =>this.extractData(res)).catch(this.handleError);
    }
    getAllRegion(url:string) {
      return this._authHttp.get(this.actionUrl + url)
      .map((res:Response)=> this.extractData(res)).catch(this.handleError);
    }
    getMarketPlace(url:string,MerchantidModel:any) {
      return this._authHttp.post(this.actionUrl + url, MerchantidModel)
      .map((res:Response)=> this.extractData(res)).catch(this.handleError);
    }
    updateAdvMerchant(url:string,advMerchantModel:any) {
      return this._authHttp.post(this.actionUrl + url, advMerchantModel)
      .map((res:Response)=> this.extractData(res)).catch(this.handleError);
    }
    getAllmerchant(url:string) {
     return this._authHttp.get(this.actionUrl+url)
      .map((res:Response)=>this.extractData(res))
      .catch(this.handleError);
    }
    getAllmerchantForAdv(url:string) {
      return this._authHttp.get(this.actionUrl+url)
       .map((res:Response)=>this.extractData(res))
       .catch(this.handleError);
     }
    addOrUpdatemarketPlace(url: string, model: any) {
      return this._authHttp.post(this.actionUrl + url,model)
      .map((res:Response)=> this.extractData(res)).catch(this.handleError);
    }
    UpdateMerchant(url: string, model: any) {
      return this._authHttp.post(this.actionUrl + url,model)
      .map((res:Response)=> this.extractData(res)).catch(this.handleError);
    }
    getMarketPlaceBymerchant(url:string, merchantModel:any) {
      return this._authHttp.post(this.actionUrl+url,merchantModel)
      .map((res:Response)=> this.extractData(res)).catch(this.handleError);
    }
    updateDefaultMarketPlaceId(url:string,marketplaceModel:any) {
      return this._authHttp.post(this.actionUrl+url,marketplaceModel)
      .map((res:Response)=> this.extractData(res)).catch(this.handleError);
    }
    resetAdvertisement(resetModel) {
     return this._authHttp.post(this.actionUrl+reset_Advertisement,resetModel)
      .map((res:Response)=>this.extractData(res)).catch(this.handleError);
    }

    private extractData(res: Response) {
        const body = JSON.parse(res.json());
        return body;
    }
    private handleError(error: Response | any) {
        return Observable.throw(error.message || error);
    }


}
