import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InventoryApiService } from '../../Shared/_services/api/inventory.api.service';
import { AmazonApiService } from '../../Shared/_services/api/amazon.api.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { LoginModel } from '../../Shared/_models/loginModel';
import { get_markteplace_By_merchantId,get_All_Merchant } from '../../Shared/_services/api/api.url';
import { debug } from 'util';
@Component({
  selector: 'app-inventory-report',
  templateUrl: './inventory-report.component.html',
  styleUrls:['./inventory-report.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class InventoryReportComponent implements OnInit,AfterViewInit {
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
  InventoryReport:any;
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
  logcommentarray: any;
  logCommentData: any[];
  todayDate:Date;
  UserInfo:LoginModel;
  currentmarketPlace:string;
  marketPlaceModel:any;
  currentMerchant:string;
  merchantListModel:any;
  constructor(private _amazonService: AmazonApiService ,private frmbuilder: FormBuilder, private _inventoryService: InventoryApiService) {
    this.selectedValue = 'OR';
    this.auto= 'auto';
    this.count = 0;
    this.UserInfo = JSON.parse(localStorage.getItem('auth_token'));
    this.currentMerchant=this.UserInfo.MerchantId;
    this.isuserAdmin = true;
      this.parentSku = '';
      this.childSku = '';
      this.category = '';
      if (this.isuserAdmin) {
        this.lstManager = '';
      } else {
        this.lstManager = this.UserInfo.userName;
      }
      this.todayDate=new Date();
  }

  ngOnInit() {
    this.loading=true;
    this.reportForm = this.frmbuilder.group({
      FromDate:['',Validators.required],
      ToDate:['',Validators.required],
      ChildSku:[''],
      Category: [''],
      MarketPlace: ['',Validators.required],
      Merchant:['',Validators.required]
    });
    this.ControlArray = [];
    this.getMarketPlace();
  }
  ngAfterViewInit () {
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
    const skumodel = {skuName: event.query, userName: this.lstManager, MerchantId:this.currentMerchant};
    this._inventoryService.GetParentSkuList(skumodel).subscribe(
      result => {
        if (result.StatusCode === 200) {
          this.parentSkuList = result.Data.skulist;
        }
      },error=> {

      }
    );
  }
  selectparentSku() {
    this.childSku = '';
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
    const searchModel = {UserName:this.lstManager, searchCategory: event.query,MerchantId:this.currentMerchant };
    this._inventoryService.getCategories(searchModel).subscribe(
      result => {
        if (result.StatusCode === 200) {
          this.categoryList = result.Data.skulist;
        }
      }
    );
  }

  ReportChart(InventoryReportData:any,SalesReportData:any) {
    let days:any[];
    days=[];
    let count:number;
    count = 0;
    let i:number;
    i=0;
    let salereportseriesdate:any;
    salereportseriesdate=new Array();
    SalesReportData.forEach(element => {
        salereportseriesdate[count]=[];
        for(let j=0;j<=salereportseriesdate[count];j++) {
        salereportseriesdate[count][0]=element.Day;
        salereportseriesdate[count][1]=element.Count;
        }
        count++;
    });
    let InventoryseriesDate:any;
    InventoryseriesDate= new Array();
    InventoryReportData.forEach(element => {
      InventoryseriesDate[i]=[];
      for(let x=0;x<=InventoryseriesDate[i];x++) {
        InventoryseriesDate[i][0]=element.Day;
        InventoryseriesDate[i][1]=element.Count;
      }
      i++;
    });
    let logCommantSeariesData:any;
    logCommantSeariesData = new Array();
    i=0;
    this.logCommentData.forEach(element => {
      logCommantSeariesData[i]=[];
      for(let x=0;x<=logCommantSeariesData[i];x++) {
        logCommantSeariesData[i][0]=element.Day;
        logCommantSeariesData[i][1]=element.Count;
      }
      i++;
    });
    Highcharts.chart('inventoryChart', {
      chart: {
          type: 'area',
          zoomType: 'x',
          panning: true,
          panKey: 'shift',
          scrollablePlotArea: {
              minWidth: 600
          }
      },
      title: {
        text: 'Inventory Vs Sales'
      },
      legend: {
        align: 'right',
        verticalAlign: 'middle',
        layout: 'vertical'
      },
      annotations: [{
          labelOptions: {
              backgroundColor: 'rgba(255,255,255,0.5)',
              y: -70
          },
          labels: this.logcommentarray,
      }],
      xAxis: {
          labels: {
              format: '{value}',
               formatter: function(){
                const eValue = this.value;
                const date =  new Date( parseFloat( eValue));
                const newDate = (date.getMonth() + 1) + '/' +  date.getDate() + '/' + date.getFullYear();
                return newDate;
              }
          },
          title: {
              text: ''
          }
      },
      yAxis: {
          startOnTick: true,
          endOnTick: false,
          maxPadding: 0.35,
          title: {
              text: 'Unit'
          },
          labels: {
              format: '{value} m'
          }
      },
      tooltip: {
        formatter: function () {
          if(this.series.name === 'LogComment') {
            return false;
          } else {
            return '<b>'+ new Date(this.x).toDateString()+'</b><br/>'+
            this.series.name+' : '+ this.y ;
          }
        },
          headerFormat: '<span style="font-size: 10px">{point.key:%Y-%m-%d}</span><br/>',
           shared: false
      },
      series: [{
          data:salereportseriesdate,
          lineColor: Highcharts.getOptions().colors[1],
          color: Highcharts.getOptions().colors[2],
          fillOpacity: 0.5,
          name: 'Sales',
          marker: {
              enabled: false
          },
          threshold: null
     },
    {
      data: InventoryseriesDate,
      name:'Inventory',
      type:'line'
    }
    ,
    {
      data: logCommantSeariesData,
      name: 'LogComment',
      type: 'line',
      showInLegend: false,
      marker:{
        enabled:false
      }
    }
  ]
  });
  }

  onChange(value) {
    this.display = value;
  }
  selectListManager() {
    this.childSku = '' ;
    this.parentSku = '';
    this.category = '';
  }
  changeDate(event) {
    if(this.fromDate > this.toDate) {
      this.fromDate=null;
    } else {
    }
  }
  onsubmitFilter() {
    this.loading=true;
     const modal= {AssignUser:this.lstManager, parentSku:this.parentSku, amazonSku: this.childSku, category: this.category,
      fromDate: this.fromDate.toLocaleString(), toDate: this.toDate.toLocaleString(),MerchantId:this.currentMerchant,
      MarketPlaceId:this.currentmarketPlace};
    this._inventoryService.inventoryFilterApi(modal).subscribe(
      res => {
        this.loading=false;
        if( res.StatusCode===200) {
          this.InventoryReport=res.Data.InventoryReportData;
          this.SalesReport=res.Data.SalesReportData;
          this.logCommentData=res.Data.logCommentList;
          this.logcommentarray=res.Data.logcommentarray;
          this.ReportChart(this.InventoryReport,this.SalesReport);
        } else {
          this.loading=false;
        }
      }, error=> {
        this.loading=false;
      });
  }
  updateMarketPlace() {
  }
  updateMerchant() {
    this.parentSku='';
    this.childSku='';
    this.category='';
    this.getMarketPlace();
  }
  getMarketPlace() {
    this.loading=true;
    const merchantModel= { 'MerchantId': this.currentMerchant};
    this._amazonService.getMarketPlaceBymerchant(get_markteplace_By_merchantId,merchantModel).subscribe(
      result=> {
        this.loading=false;
        if(result.StatusCode===200) {
          this.marketPlaceModel=JSON.parse(result.Data.MarketPlaceinfo);
          this.currentmarketPlace=result.Data.CurrentSelectedmarketPlace;
        }
      }, error=> {
        this.loading=false;
      });
  }
}
