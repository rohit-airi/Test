import { Injectable } from '@angular/core';
import { Configuration } from '../../../app.configuration';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { inventory_sales_report_filter_url, searchparent_Sku_List,
  child_Sku_List_By_Loginuser_Or_ParentSku, get_All_User_list, get_Categoris} from './api.url';
import { HttpClient } from '../HttpClient.service';
@Injectable()
export class InventoryApiService {
    public actionUrl: string;
    constructor(private _configuration: Configuration
    ,public authHttp: HttpClient) {
        this.actionUrl = this._configuration.ServerWithApiUrl;
    }
    inventoryFilterApi(model:any) {
      return this.authHttp.post(this.actionUrl + inventory_sales_report_filter_url, model)
      .map((res: Response) => this.extractData(res)).catch(this.handleError);
    }
    ImportNotAmazonApi(url: string) {
        return this.authHttp.get(this.actionUrl + url).map((res: Response) => this.extractData(res)).catch(this.handleError);
    }
    AmazonNotImportApi(url: string) {
        return this.authHttp.get(this.actionUrl + url).map((res: Response) => this.extractData(res)).catch(this.handleError);
    }
    InventorySettingAddApi(url: string, model: any) {
        return this.authHttp.post(this.actionUrl + url, model).map((res: Response) => this.extractData(res)).catch(this.handleError);
    }
    InventorySettingDetailAddApi(url: string) {
        return this.authHttp.get(this.actionUrl + url).map((res: Response) => this.extractData(res)).catch(this.handleError);
    }
      getAlluser(model: any) {
        return this.authHttp.post(this.actionUrl  + get_All_User_list, model).map((res: Response) => this.extractData(res))
        .catch(this.handleError);
      }
      getCategories(model: any) {
        return this.authHttp.post(this.actionUrl + get_Categoris, model).map((res: Response) => this.extractData(res))
        .catch(this.handleError);
      }
      GetParentSkuList(model: any) {
        return this.authHttp.post(this.actionUrl + searchparent_Sku_List, model).map((res: Response) => this.extractData(res))
        .catch(this.handleError);
      }
      GetChildSkuByparentSkuOrUserName(model: any) {
        return this.authHttp.post(this.actionUrl + child_Sku_List_By_Loginuser_Or_ParentSku, model).
        map((res: Response) => this.extractData(res)).catch(this.handleError);
      }
      public extractData(res: Response) {
        const body =JSON.parse(res.json());
        return body;
      }
      public handleError(error: Response | any) {
        if(error.message==='No JWT present or has expired') {
        } else  {
      return Observable.throw(error.message || error);
        }
      }
}
