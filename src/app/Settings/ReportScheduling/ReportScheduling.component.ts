import { Component, OnInit} from '@angular/core';
import {SelectItem} from 'primeng/primeng';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { ConfirmationService } from 'primeng/primeng';
import { ParentApiService } from '../../Shared/_services/api/parent.api.service';
import { NotificationService } from '../../Shared/_services/notification.service';
import { get_markteplace_By_merchantId, update_ReportType, add_Or_Update_ReportSetting,
  get_All_ReportSeetings, get_All_Merchant } from '../../Shared/_services/api/api.url';
import { Message } from 'primeng/components/common/api';
import { LoginModel} from '../../Shared/_models/loginModel';
import { AmazonApiService } from '../../Shared/_services/api/amazon.api.service';
@Component ({
  templateUrl: './ReportScheduling.component.html'
})
export class SchedulerComponent implements OnInit {
  msgs: Message[] = [];
  allReport:any;
  marketPlace: SelectItem[];
  selectedMarketPlace:any;
  interval: SelectItem[];
  intervalH: SelectItem[];
  loading: boolean;
  currentmarketPlace:string;
  marketPlaceModel:any;
  UserInfo:LoginModel;
  currentMerchant:string;
  merchantListModel:any;
  ReportSchedulingLoading:boolean;
  constructor(private _amazonService:AmazonApiService, private _parentService:ParentApiService,
    private confirmServise: ConfirmationService, private _notification:NotificationService) {
      this.currentmarketPlace='';
      this.allReport=[];
    this.interval = [
      {label: 'Monthly', value: 'monthly'},
      {label: 'Weekly', value: 'weekly'},
      {label: 'Daily', value: 'daily'}
    ];
    this.intervalH =[
      {label: 'Half yearly', value:'halfyearly'}
    ];
    this.marketPlace = [
      {label: 'US', value: 'us'},
      {label: 'UK', value: 'uk'}
    ];
    this.UserInfo = JSON.parse(localStorage.getItem('auth_token'));
    this.currentMerchant=this.UserInfo.MerchantId;
  }
  changeInterval(currentAPI:any) {
    const ReportModel= {
      'merchantId':currentAPI.MerchantId,
      'marketPlaceId': currentAPI.MarketPlaceId,
      'reportType': currentAPI.ReportType,
      'interval': currentAPI.Interval,
      'IsInUse': currentAPI.IsInUse
    };
    this.confirmServise.confirm({
      message: 'Are you sure to change Interval to '+ currentAPI.Interval +' ?',
      accept: () => {
        this.loading=true;
        this._parentService.AddOrUpdateReportSeeting(add_Or_Update_ReportSetting, ReportModel).subscribe(
          result => {
            this.loading=false;
            if (result.StatusCode===200) {
              this._notification.showSuccess('success','Interval changed successfully');
            } else {
              this._notification.showError('error',result.Result.Message);
              this.getAllReportSetting(0);
            }
          },error=> {
            this.loading=false;
          }
        );
      },
      reject:()=> {
        this.getAllReportSetting(0);
      }
    });
  }
  getAllReportSetting(callByValue) {
    this.ReportSchedulingLoading=true;
   const amazonModel= {'marketPlaceId':this.currentmarketPlace,'merchantId':this.currentMerchant};
   const merchantModel= { 'MerchantId': this.currentMerchant};
    this._parentService.getAllReportByMerchantIdandMarketPlcaeId(get_All_ReportSeetings,amazonModel).subscribe(
      result=> {
        this.ReportSchedulingLoading=false;
        if(result[0].StatusCode===200) {
          this.allReport = result[0].Data;
        }
      },error=> {
        this.ReportSchedulingLoading=false;
      });
      if(callByValue===1) {
      this.getMarketPlace();
      }
  }
  ngOnInit() {
    this.loadAllmerchant();
    this.getAllReportSetting(1);
  }
  enableOrDisable(currentReport:any) {
    this.confirmServise.confirm({
      message: 'Are you sure to update this report?',
      accept: () => {
        this.loading=true;
        const ReportModel= {
          'merchantId':currentReport.MerchantId,
          'marketPlaceId': currentReport.MarketPlaceId,
          'reportType': currentReport.ReportType,
          'interval': currentReport.Interval,
          'IsInUse': currentReport.IsInUse
        };
        this._parentService.AddOrUpdateReportSeeting(add_Or_Update_ReportSetting, ReportModel).subscribe(
          result => {
            this.loading=false;
            if (result.StatusCode===200) {
              this._notification.showSuccess('success','Reports changed successfully');
            } else {
              this._notification.showError('Error',result.Result.Message);
              this.getAllReportSetting(0);
            }
          },error=> {
            this.loading=false;
          }
        );
      },
      reject:()=> {
        this.getAllReportSetting(0);
      }
    });
  }
  getMarketPlace() {
    const merchantModel= { 'MerchantId': this.currentMerchant};
    this._amazonService.getMarketPlaceBymerchant(get_markteplace_By_merchantId,merchantModel).subscribe(
      result=> {
        if(result.StatusCode===200) {
          this.marketPlaceModel=JSON.parse(result.Data.MarketPlaceinfo);
          this.currentmarketPlace=result.Data.CurrentSelectedmarketPlace;
        }
      }, error=> {
      });
  }
  loadAllmerchant() {
    this._amazonService.getAllmerchant(get_All_Merchant).subscribe(
      res=> {
        if(res.StatusCode===200) {
          this.merchantListModel=res.Data;
        }
      },
      error=> {
      }
    );
  }
}
