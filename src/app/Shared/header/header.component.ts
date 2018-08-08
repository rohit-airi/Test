import { Component, OnInit, AfterViewInit,ElementRef, ViewChild } from '@angular/core';
import { CommonService } from '../_services/common.service';
import { AuthService } from '../_services/auth.service';
import { Router} from '@angular/router';
import { get_markteplace_By_merchantId,update_Default_Marketplace } from '../_services/api/api.url';
import { AmazonApiService } from '../_services/api/amazon.api.service';
import { MarketPlaceModel } from '../_models/marketPlaceModel';
import { MarketplaceComponent } from '../../Settings/Marketplaces/marketplaces.component';
import { NotificationService } from '../_services/notification.service';
import * as $ from 'jquery';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  userInfoModel: any;
  isAuthorize:boolean;
  marketPlaceModel:MarketPlaceModel[];
  currentmarketPlace:string;
  headerloading:boolean;
  @ViewChild('headerType') headerType:ElementRef;
  constructor(private _notification: NotificationService, private _amazonService:AmazonApiService, private _commonservice: CommonService,
    private _authService:AuthService,private _router: Router ) { }
  ngOnInit() {
     this.userInfoModel = JSON.parse(localStorage.getItem('auth_token'));
     if(this.userInfoModel.Role === 'User' || this.userInfoModel.AuthTokenId!==''
     || ((this.userInfoModel.Role==='Admin' || this.userInfoModel.Role==='SuperAdmin')
     && this.userInfoModel.MerchantId !=='')) {
      this.isAuthorize=true;
      // this.getMarketPlace(this.userInfoModel.MerchantId);
    } else {
      this.isAuthorize=false;
       this._router.navigate(['/app/amazonsetup']);
    }
  }
  ngAfterViewInit() {
  }
  toggleSidebar() {
    this._commonservice.toggleSidebar = !this._commonservice.toggleSidebar;
  }
  logOut() {
    this._authService.logout();
    this._router.navigate(['/account/login']);
  }
  // refreshDropdown():void {
  //   $('#select option').remove();
  //   this.marketPlaceModel.forEach(element => {
  //     $('#select').append('<option value="'+element.MWSMarketPlaceId+'">'+element.MarketPlaceName+'</option>');
  //   });
  // }

  // getMarketPlace(merchantId:string) {
  //   const merchantModel= { 'MerchantId': merchantId};
  //   this._amazonService.getMarketPlaceBymerchant(get_markteplace_By_merchantId,merchantModel).subscribe(
  //     result=> {
  //       this.marketPlaceModel=JSON.parse(result.Data.MarketPlaceinfo);
  //       this.currentmarketPlace=result.Data.CurrentSelectedmarketPlace;
  //       this.refreshDropdown();
  //     }, error=> {
  //     });
  // }
  updateMarketPlace() {
    this.headerloading=true;
    const marketPlaceModel= {'MarketPlaceId': this.currentmarketPlace,'MerchantId': this.userInfoModel.MerchantId};
    this._amazonService.updateDefaultMarketPlaceId(update_Default_Marketplace,marketPlaceModel).subscribe(
      result=> {
        this.headerloading=false;
        if(result.StatusCode===200) {
          this._notification.showSuccess('success','Marketplace Updated successfully');
          window.location.reload();
        } else {
          this._notification.showError('error','Some problem found, Please contact your administrator.');
        }
      }, error=> {
        this._notification.showError('error','Some problem found, Please contact your administrator.');
      });
   }
}
