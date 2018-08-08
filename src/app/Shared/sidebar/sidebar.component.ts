import { Component, OnInit,ChangeDetectionStrategy,ChangeDetectorRef } from '@angular/core';
import { CommonService } from '../_services/common.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {
  public  userInfoModel:any;
  isAuthorize:boolean;
  constructor(private cd:ChangeDetectorRef,private commonservice: CommonService ) {
    this.userInfoModel = JSON.parse(localStorage.getItem('auth_token'));
    if(this.userInfoModel.Role=== 'User' || this.userInfoModel.AuthTokenId!==''
    || ((this.userInfoModel.Role==='Admin' || this.userInfoModel.Role==='SuperAdmin')
    && this.userInfoModel.MerchantId !=='')) {
      this.isAuthorize=true;
      this.commonservice.toggleSidebar = false;
    }else {
      this.commonservice.toggleSidebar = true;
    }
  }
  ngOnInit() {
  }
}
