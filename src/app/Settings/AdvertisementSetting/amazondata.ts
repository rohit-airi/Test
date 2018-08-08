import { async } from '@angular/core/testing';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { get_AmazonData } from '../../Shared/_services/api/api.url';
import { AdvMerchantInfo } from '../../Shared/_models/advMerchantInfo';
import { AmazonApiService } from '../../Shared/_services/api/amazon.api.service';
import { NotificationService } from '../../Shared/_services/notification.service';
import { SettingService } from '../setting.service';
@Component({
  template:'<ngx-loading [show]="loading"></ngx-loading>'
})
export class AmazonDataComponent implements OnInit {
  code:string;
  scope:string;
  loading:boolean;
  constructor(private _settingService:SettingService,private _notification:NotificationService,private _amazonService:AmazonApiService,
    private _route:Router,private activatedRoute:ActivatedRoute) {
      this.loading=true;
  }
ngOnInit() {
  this.activatedRoute.queryParams.subscribe((params: Params) => {
    this.code = params['code'];
    this.scope = params['scope'];
  });
  this.updateMerchantWithAdvertisement();
}
  updateMerchantWithAdvertisement() {
    const advMerchantData= {Code:this.code,Scope:this.scope,SelectedRegion:this._settingService.getRegion()};
    this._amazonService.updateAdvMerchant(get_AmazonData,advMerchantData).subscribe(
      result=> {
        this.loading=false;
        if(result.StatusCode===200) {
          this._notification.showSuccess('Success',result.Message,5);
        } else if(result.StatusCode===403) {
          this._notification.showWarn('Warn',result.Message,5);
        } else {
          this._notification.showError('Error','Some problem found, Please try again',5);
        }
        setTimeout(() => {
          this._route.navigate(['/app/settings/advertisement']);
        }, 1000);
      },
      error=> {
        this.loading=false;
        this._notification.showError('Error','Some problem found, Please try again',5);
        this._route.navigate(['/app/settings/advertisement']);
      }
    );
  }
}
