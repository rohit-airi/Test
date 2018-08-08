import { Component,ViewChild,ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InventoryApiService } from '../../Shared/_services/api/inventory.api.service';
import { ProfitApiService } from '../../Shared/_services/api/profit.api.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { JwtHelper } from 'angular2-jwt';
import { get_markteplace_By_merchantId,profit_search_filter_report,profit_download_report,
  get_All_Merchant } from '../../Shared/_services/api/api.url';
import {saveAs} from 'file-saver';
import { MenuItem } from 'primeng/primeng';
import { AmazonApiService } from '../../Shared/_services/api/amazon.api.service';
import { AmazonsetupComponent } from '../../amazonsetup/amazonsetup.component';
import { LoginModel } from '../../Shared/_models/loginModel';
@Component({
  selector: 'app-profit-report',
  templateUrl: './profit-report.component.html',
  styleUrls:['./profit-report.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfitReportComponent implements OnInit {
  selectedUnit: string;
  @ViewChild('myDiv') myDiv: ElementRef;
  jwtHelper: JwtHelper = new JwtHelper();
  inventoryItemdata: any[];
  selectedValue: string;
  saleItemData:any[];
  results: string[];
  displays: boolean;
  date1:Date;
  date2:Date;
  public myForm: FormGroup;
  public reportForm:FormGroup;
  payLoad: any;
  inventoryForm: FormBuilder;
  ProfitReport:any[];
  IsDownloadEnable: boolean;
  SalesReport:any;
  ChildList: any[];
  ParentChildList:any[];
  ControlArray: any = [];
  filterList: any = [];
  dynamicHeader: any = [];
  loading: boolean;
  message: any = [];
  display: string;
  auto: string;
  value: Date;
  searchResult: any[];
  filterConcat: string;
  qtd: any[] = [];
  obj: any = {
    Templates: '',
    Day: '',
    Month: '',
    Week: '',
    Custom: ''

  };
  cols: any[] = [];
  count: number;
  data: any;
  bsConfig: Partial<BsDatepickerConfig>;
  isuserAdmin: boolean;
  listManager: any[];
  lstManager: any;
  parentSku: string;
  parentSkuList: any[];
  childSku: string;
  childSkuList: any[];
  category: string;
  categoryList: any[];
  fromDate: Date;
  toDate: Date;
  UserInfo:LoginModel;
  items: MenuItem[];
  todayDate:Date;
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
    this.todayDate=new Date();
    this.UserInfo = JSON.parse(localStorage.getItem('auth_token'));
    this.currentMerchant=this.UserInfo.MerchantId;
  }

  ngOnInit() {
    this.isuserAdmin = true;
    this.parentSku = '';
    this.childSku = '';
    this.category = '';
    if (this.isuserAdmin) {
      this.lstManager = '';
    } else {
      this.lstManager = '';// this.UserInfo.Data.user.FirstName;
    }
    this.reportForm = this.frmbuilder.group({
      FromDate:['',Validators.required],
      ToDate:['',Validators.required],
      ChildSku:[''],
      Category: [''],
      MarketPlace:['',Validators.required],
      Merchant:['',Validators.required]
    });
    this.ControlArray = [];
    this.items = [
      {label: 'Download Datewise', icon: 'fa-download', command: () => {
          this.downloadProfitReport(true);
      }}
  ];
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
  selectparentSku() {
    this.childSku = '';
  }
  searchFilter2Childsku(event) {
    const childSkuModel = {parentSkuName: this.parentSku, userName: this.lstManager, chilsSkuName: event.query,
      MerchantId:this.currentMerchant};
    this._inventoryService.GetChildSkuByparentSkuOrUserName(childSkuModel).subscribe(
      result1 => {
        if (result1.StatusCode === 200) {
          this.childSkuList = result1.Data.skulist;
        }
      }
    );
  }
  searchCategory(event) {
    const searchModel = {UserName:this.lstManager, searchCategory: event.query, MerchantId:this.currentMerchant };
    this._inventoryService.getCategories(searchModel).subscribe(
      result => {
        if (result.StatusCode === 200) {
          this.categoryList = result.Data.skulist;
        }
      }
    );
  }

  ReportChart(ProfitReportData:any) {
    let days:any[];
    days=[];
    Highcharts.chart('profitReport', {
      chart: {
        type: 'area',
        zoomType: 'x',
        panning: true,
        panKey: 'shift',
        borderWidth: 0,
        resetZoomButton: {
          position: {
            x: -20,
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
        text: 'Profit Report'
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        x: 0,
        y: 0
      },
      xAxis: {
        categories:ProfitReportData.Day,
      },
      yAxis: {
        title: {
          text: 'Amount($)'
        }
      },
      tooltip: {
        valueDecimals: 3,
        valuePrefix: '$',
        shared: true,
      },
      credits: {
        enabled: true
      },
      plotOptions: {
        series: {
          stacking: this.selectedUnit,
          fillOpacity: 0.2
        }
      },
      series: [{
        name: 'COST',
        data: ProfitReportData.COST,
        color:'#ffa366'
      }, {
        name: 'COMMISSION',
        data: ProfitReportData.COMMISSION,
        color:'#b366ff'
      }, {
        name: 'PROMOTION',
        data: ProfitReportData.PROMOTION,
        color:'#66ccff'
      },{
        name: 'HANDLING',
        data: ProfitReportData.HANDLING,
        color:'#ffcc66'
      }, {
        name: 'SHIPPING',
        data: ProfitReportData.SHIPPING,
        color:'#b3b3b3'
      },{
        name: 'ADVERTISEMENT',
        data: ProfitReportData.ADVERTISEMENT,
        color:'#ffff66'
      }
      ,{
        name: 'REMOVAL FEE',
          data: ProfitReportData.REMOVALORDERS,
          color:'#ff8566'
        }, {
        name: 'REFUND',
        data: ProfitReportData.REFUND,
          color:'#ff66b3'
      },
        {
        name: 'STORAGE FEE',
        data: ProfitReportData.STORAGEFEE,
          color:'#cbcb9a'
      }, {
        name: 'LONG STORAGE FEE',
        data: ProfitReportData.LONGSTORAGEFEE,
          color:'#d98c8c'
      },{
          name: 'PROFIT',
          data: ProfitReportData.PROFIT,
          color: '#66ff66'
        }]
    });
  }

  onChange(value) {
    this.display = value;
  }
  onChangeUnit(currentUnit:any) {
    this.ReportChart(this.ProfitReport);
  }
  selectListManager() {
    this.childSku = '' ;
    this.parentSku = '';
    this.category = '';
  }
  onsubmitFilter() {
    this.loading = true;
    this.IsDownloadEnable=false;
    const modal= {MerchantId:this.currentMerchant, MarketPlaceId:this.currentmarketPlace, AssignUser:this.lstManager,
    parentSku:this.parentSku, amazonSku: this.childSku, category: this.category,
      fromDate: this.fromDate.toLocaleString(), toDate: this.toDate.toLocaleString()};
    this._profitServices.searchResultByFilterApi(profit_search_filter_report,modal).subscribe(
      res => {
        this.loading = false;
        this.ProfitReport=res.Data;
        this.IsDownloadEnable =true;
        this.ReportChart(this.ProfitReport);

      },error=> {
        this.loading = false;
      });
  }
  downloadProfitReport(isDownloadWithDate) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
     this.loading =true;
      const modal = { MerchantId:this.currentMerchant, MarketPlaceId: this.currentmarketPlace, AssignUser:this.lstManager,
      parentSku:this.parentSku, amazonSku: this.childSku, category: this.category,
      fromDate: this.fromDate.toLocaleString(), toDate: this.toDate.toLocaleString(), IsDownloadWithDate: isDownloadWithDate};
     this._profitServices.downloadResultByFilter(profit_download_report,modal).subscribe(
       res=> {
          const currentdate =new Date();
         const CurrentDateString =monthNames[currentdate.getMonth()];
          this.loading = false;
          const blob = new Blob([res._body], {type: 'text/csv'});
          saveAs(blob,'ProfitReport_'+currentdate.getDate() +'' +CurrentDateString+''+currentdate.getFullYear()+'.csv');
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
