import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { get_All_Merchant, get_markteplace_By_merchantId,adsReport_search_filter_result_api_url
} from '../../Shared/_services/api/api.url';
import { InventoryApiService } from '../../Shared/_services/api/inventory.api.service';
import { ProfitApiService } from '../../Shared/_services/api/profit.api.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { profit_download_report } from '../../Shared/_services/api/api.url';
import {saveAs} from 'file-saver';
import { LoginModel } from '../../Shared/_models/loginModel';
import { AmazonApiService } from '../../Shared/_services/api/amazon.api.service';
@Component({
  selector: 'app-adreport',
  templateUrl: './adreport.component.html',
  styleUrls: ['./adreport.component.css']
})
export class AdreportComponent implements OnInit {
  selectedUnit: string;
  selectedValue: string;
  results: string[];
  public reportForm:FormGroup;
  ParentList: any[];
  AdReportReport:any[];
  IsDownloadEnable: boolean;
  ChildList: any[];
  ControlArray: any = [];
  loading: boolean;
  message: any = [];
  display: string;
  auto: string;
  value: Date;
  searchResult: any[];
  count: number;
  data: any;
  bsConfig: Partial<BsDatepickerConfig>;
  isuserAdmin: boolean;
  listManager: any[];
  lstManager: any;
  parentSku: string;
  parentSkuList: any[];
  childSku: string;
  category: string;
  categoryList: any[];
  fromDate: Date;
  toDate: Date;
  todayDate:Date;
  UserInfo:LoginModel;
  marketPlaceModel:any;
  currentmarketPlace:any;
  currentMerchant:string;
  merchantListModel:any;
  constructor(private _amazonService:AmazonApiService, private _profitServices: ProfitApiService, private frmbuilder: FormBuilder,
               private _inventoryService: InventoryApiService) {
    this.selectedUnit = 'normal';
    this.IsDownloadEnable = false;
    this.selectedValue = 'OR';
    this.auto= 'auto';
    this.count = 0;
    this.UserInfo = JSON.parse(localStorage.getItem('auth_token'));
    this.currentMerchant=this.UserInfo.MerchantId;
    this.isuserAdmin = true; // UserInfo.Data.IsAdmin;
    this.parentSku = '';
    this.category = '';
    if (this.isuserAdmin) {
      this.lstManager = '';
    } else {
      this.lstManager = '';// UserInfo.Data.user.FirstName;
    }
    this.todayDate=new Date();
  }

  ngOnInit() {
    this.reportForm = this.frmbuilder.group({
      FromDate:['',Validators.required],
      ToDate:['',Validators.required],
      Category: [''],
      MarketPlace:['',Validators.required],
      Merchant: ['',Validators.required]
    });
    this.ControlArray = [];
    this.getMarketPlace();
    this.loadAllmerchant();
  }
  searchListManager(event) {
    const searchuserModel = { searchUserName: event.query};
    this._inventoryService.getAlluser(searchuserModel).subscribe(
      result => {
        if (result.StatusCode === 200) {
          this.listManager = result.Data.skulist;
        }
      });
  }
  searchparentSku(event) {
    const skumodel = {skuName: event.query, userName: this.lstManager,MerchantId:this.currentMerchant};
    this._inventoryService.GetParentSkuList(skumodel).subscribe(
      result => {
        if (result.StatusCode === 200) {
          this.parentSkuList = result.Data.skulist;
        }
      }
    );
  }
  searchCategory(event) {
    const searchModel = {UserName:this.lstManager, searchCategory: event.query,MerchantId:this.currentMerchant };
    this._inventoryService.getCategories(searchModel).subscribe(
      result => {
        if (result.StatusCode === 200) {
          this.categoryList = result.Data.skulist;
        }
      }
    );
  }
  ReportChart(adsReportData:any) {
    Highcharts.chart('adsconversion', {
      chart: {
        type: 'area',
        zoomType: 'x',
        panning: true,
        panKey: 'shift',
        borderWidth: 0,
        resetZoomButton: {
          position: {
            x: -10,
            y: 10
          },
          relativeTo: 'chart'
        }
      },
      dateRangeGrouping: {
        dayFormat: { month: 'numeric', day: 'numeric', year: 'numeric' },
        weekFormat: { month: 'numeric', day: 'numeric', year: 'numeric' },
        monthFormat: { month: 'numeric', year: 'numeric'  }
      },
      title:{
        text: 'Adds Conversion'
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        x: 0,
        y: 0
      },
      xAxis: {
        categories:adsReportData.ConversionReport.Day,
        scrollbar: {
          enabled: false
  },
      },
      yAxis: {
        title: {
          text: 'Number'
        }
      },
      tooltip: {
        // valueDecimals: 2,
       // valuePrefix: '$',
        shared: true,
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        series: {
          stacking: this.selectedUnit,
          fillOpacity: 0.2
        }
      },
      series: [{
        name: 'Clicks with No Order',
        data: adsReportData.ConversionReport.GMCLICKWITHNOORDER,
        color:'#ffa366'
      }, {
        name: 'Impressions with no click',
        data: adsReportData.ConversionReport.GMIMPRESSIONWITHNOCLICK,
        color:'#b366ff'
      }, {
        name: 'Clicks',
        data: adsReportData.ConversionReport.GMTOTALCLICK,
        color:'#66ccff'
      },{
        name: 'Orders',
        data: adsReportData.ConversionReport.GMTOTALORDER,
        color:'#ffcc66'
      }]
    });

    Highcharts.chart('adsconversionvsNatural', {
      chart: {
        type: 'area',
        zoomType: 'x',
        panning: true,
        panKey: 'shift',
        borderWidth: 0,
        resetZoomButton: {
          position: {
            x: -10,
            y: 10
          },
          relativeTo: 'chart'
        }
      },
      dateRangeGrouping: {
        dayFormat: { month: 'numeric', day: 'numeric', year: 'numeric' },
        weekFormat: { month: 'numeric', day: 'numeric', year: 'numeric' },
        monthFormat: { month: 'numeric', year: 'numeric'  }
      },
      title:{
        text: 'Adds Conversion vs Natural'
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        x: 0,
        y: 0
      },
      xAxis: {
        categories:adsReportData.Conversionvsnatural.Day,
      },
      yAxis: {
        title: {
          text: 'Number'
        }
      },
      tooltip: {
        shared: true,
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        series: {
          stacking: this.selectedUnit,
          fillOpacity: 0.2
        }
      },
      series: [{
        name: 'Ads orders',
        data: adsReportData.Conversionvsnatural.AddsOrder,
        color:'#ffcc66'
      }, {
        name: 'Ad clicks',
        data: adsReportData.Conversionvsnatural.DSTBCIADDCLICKS,
        color:'#66ff66'
      }, {
        name: 'Natural clicks',
        data: adsReportData.Conversionvsnatural.DSTBCINATURALCLICKS,
        color:'#d98c8c'
      },{
        name: 'Natural Orders',
        data: adsReportData.Conversionvsnatural.DSTBCINATURALORDER,
        color:'#ff66b3'
      }]
    });
  }

  onChange(value) {
    this.display = value;
  }
  onChangeUnit() {
    this.ReportChart(this.AdReportReport);
  }
  selectListManager() {
    this.parentSku = '';
    this.category = '';
  }
  onsubmitFilter() {
    this.loading = true;
    this.IsDownloadEnable=false;
    const modal= {AssignUser:this.lstManager, parentSku:this.parentSku, amazonSku: '', category: this.category,
      fromDate: this.fromDate.toLocaleString(), toDate: this.toDate.toLocaleString(),MerchantId:this.currentMerchant,
      MarketPlaceId:this.currentmarketPlace};
    this._profitServices.searchResultByFilterApi(adsReport_search_filter_result_api_url,modal).subscribe(
      res => {
        this.loading = false;
        this.AdReportReport=res.Data;
        this.IsDownloadEnable =true;
        this.ReportChart(this.AdReportReport);
      }, error=> {
        this.loading=false;
      });
  }
  downloadProfitReport() {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
     this.loading =true;
      const modal = {MerchantId:this.currentMerchant,AssignUser:this.lstManager, parentSku:this.parentSku, amazonSku: this.childSku,
        category: this.category, fromDate: this.fromDate.toLocaleString(), toDate: this.toDate.toLocaleString()};
     this._profitServices.downloadResultByFilter(profit_download_report,modal).subscribe(
       res=> {
          const currentdate =new Date();
         const CurrentDateString =monthNames[currentdate.getMonth()];
          this.loading = false;
          const blob = new Blob([res._body], {type: 'text/csv'});
          saveAs(blob,'ProfitReport_'+currentdate.getDate() +'' +CurrentDateString+''+currentdate.getFullYear()+'.csv');
       }, error=> {
         this.loading=false;
       });
  }
  getMarketPlace() {
    const merchantModel= {MerchantId: this.currentMerchant};
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
    this.loading=true;
    this._amazonService.getAllmerchant(get_All_Merchant).subscribe(
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
  updateMerchant() {
    this.parentSku='';
    this.childSku='';
    this.category='';
    this.getMarketPlace();
  }
}
