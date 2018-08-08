import { ConfirmationService } from 'primeng/primeng';
import { Component, OnInit, ViewEncapsulation, Directive} from '@angular/core';
import { NotificationService } from '../../Shared/_services/notification.service';
import { get_All_region, get_MarketPlaces, add_Update_Merchant, get_All_Merchant } from '../../Shared/_services/api/api.url';
import { AmazonApiService } from '../../Shared/_services/api/amazon.api.service';
import { LoginModel } from '../../Shared/_models/loginModel';
@Component({
    templateUrl: './marketplaces.component.html',
    styleUrls: ['./marketplaces.component.css'],
    encapsulation:ViewEncapsulation.None
})
export class MarketplaceComponent implements OnInit {
  loading:boolean;
  selectedRegion: string;
  regionList:any;
  marketPlaceList:any[];
  selectedmarketPlace:any[];
  userInfo:LoginModel;
  MarketPlaceLoading:boolean;
  currentmarkeplace:any;
  currentMerchant:string;
  merchantListModel:any;
  constructor(private _confirmServices:ConfirmationService, private _amazonApIService: AmazonApiService,
    private _notification: NotificationService) {
  }
  ngOnInit() {
    this.selectedRegion='0';
    this.marketPlaceList=[];
    this.selectedmarketPlace=[];
    this.userInfo = JSON.parse(localStorage.getItem('auth_token'));
    this.currentMerchant=this.userInfo.MerchantId;
    this.loadAllmerchant();
    this.getAllMarketPlace();
  }
  getAllRegionList() {
    this.MarketPlaceLoading=true;
    this._amazonApIService.getAllRegion(get_All_region).subscribe(
      result=> {
        this.MarketPlaceLoading=false;
        if (result.StatusCode===200) {
          this.regionList=result.Data;
        }
      },
      error=> {
        this.MarketPlaceLoading=false;
      });
  }
  loadAllmerchant() {
    // this.loading=true;
    this._amazonApIService.getAllmerchant(get_All_Merchant).subscribe(
      res=> {
        this.loading=false;
        if(res.StatusCode===200) {
          this.merchantListModel=res.Data;
        }
      },
      error=> {
        this.loading=false;
      }
    );
  }
  getAllMarketPlace() {
    this.MarketPlaceLoading=true;
    this.selectedmarketPlace=[];
    const merchantModel= {'MerchantId': this.currentMerchant};
    this._amazonApIService.getMarketPlace(get_MarketPlaces,merchantModel).subscribe(
      result=> {
        this.MarketPlaceLoading=false;
        if(result.StatusCode===200) {
          this.marketPlaceList=result.Data.AmazonMarketPlace;
          this.selectedmarketPlace=result.Data.SeletedModel;
          this.currentmarkeplace=result.Data.SeletedModel;
        }
      },
      error=> {
        this.MarketPlaceLoading=false;
      });
  }
  addUpdatemarketPlace () {
    this._confirmServices.confirm({
      message: 'Are you sure to update marketplaces? This action will effect the report scheduling & daily data downloading?',
      accept: () => {
          // Actual logic to perform a confirmation
          this.loading=true;
          const marketJsonModel= {'MerchantId':this.currentMerchant,'MarketPlaceIdJson':JSON.stringify(this.selectedmarketPlace)};
          this._amazonApIService.addOrUpdatemarketPlace(add_Update_Merchant,marketJsonModel).subscribe(
            result=> {
              this.loading=false;
              if(result.StatusCode===200) {
                if(result.Data==='A') {
                  this._notification.showSuccess('success','Merchant added successfully');
                } else {
                  this._notification.showSuccess('success','Merchant Updated successfully');
                }
              } else {
                this._notification.showSuccess('warn','Unable to add merchant');
              }
            },
            err=> {
              this.loading=false;
              this._notification.showError('error','Some error found, Please contact your admin');
            });
      }
  });

  }

}
