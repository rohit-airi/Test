import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InventoryApiService } from '../../Shared/_services/api/inventory.api.service';
import { ProfitApiService } from '../../Shared/_services/api/profit.api.service';
import { get_All_Merchant, get_markteplace_By_merchantId,profit_Loss_Estimated,
  profit_Loss_Estimate_Download } from '../../Shared/_services/api/api.url';
import { saveAs } from 'file-saver';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AmazonApiService } from '../../Shared/_services/api/amazon.api.service';
import { LoginModel } from '../../Shared/_models/loginModel';
@Component({
  selector: 'app-profitloss-report',
  templateUrl: './profitlossestimate.component.html',
  styleUrls: ['./profitlossestimate.component.css']
})
export class ProfitlossEstimateComponent implements OnInit {
  loading: boolean;
  reportForm: FormGroup;
  isuserAdmin: boolean;
  UserInfo: LoginModel;
  listManager: any[];
  lstManager: any;
  parentSku: string;
  parentSkuList: any[];
  childSku: string;
  childSkuList: any[];
  category: string;
  categoryList: any[];
  fromDate: Date;
  IsDownloadEnable: boolean;
  selectedUnit: string;
  ProfitLossEstimateReport: any[];
  bsConfig: Partial<BsDatepickerConfig>;
  todayDate:Date;
  marketPlaceModel:any;
  currentmarketPlace:any;
  currentMerchant:string;
  merchantListModel:any;
  constructor(private _amazonService:AmazonApiService, private _profitServices: ProfitApiService,
    private _frmbuilder: FormBuilder, private _inventoryService: InventoryApiService) {
    this.reportForm = this._frmbuilder.group({
      AsonDate: ['', Validators.required],
      ChildSku: [''],
      Category: [''],
      MarketPlace:['',Validators.required],
      Merchant:['',Validators.required]
    });
    this.selectedUnit = 'normal';
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
    this.getMarketPlace();
    this.loadAllmerchant();
  }
  searchparentSku(event) {
    const skumodel = { skuName: event.query, userName: this.lstManager,MerchantId:this.currentMerchant };
    this._inventoryService.GetParentSkuList(skumodel).subscribe(
      result => {
        if (result.StatusCode === 200) {
          this.parentSkuList = result.Data.skulist;
          // this.childSku = '';
        }
      }
    );
  }
  searchListManager(event) {
    const searchuserModel = { searchUserName: event.query };
    this._inventoryService.getAlluser(searchuserModel).subscribe(
      result => {
        if (result.StatusCode === 200) {
          this.listManager = result.Data.skulist;
        }
      });
  }
  selectListManager() {
    this.childSku = '';
    this.parentSku = '';
    this.category = '';
  }
  onsubmitFilter() {
    this.loading = true;
    this.IsDownloadEnable = false;
    const profitLossEstimatemodel = {
      MerchantId: this.currentMerchant, MarketPlaceId:this.currentmarketPlace, AssignUser: this.lstManager,
      parentSku: this.parentSku, amazonSku: this.childSku, category: this.category,
      fromDate: this.fromDate.toLocaleString(), toDate: ''
    };
    this._profitServices.searchResultByProfitLoss(profit_Loss_Estimated, profitLossEstimatemodel).subscribe(
      result => {
        this.loading = false;
        if (result.StatusCode === 200) {
          this.ProfitLossEstimateReport = result.Data;
          this.ReportChart();
        } else {

        }
      },
      error => {
        this.loading = false;
      });
  }
  downloadProfitReport(isDownloadWithDate) {
    const monthNames = this.ProfitLossEstimateReport['Day'];
    this.loading = true;
    const modal = {
      MerchantId: this.currentMerchant, MarketPlaceId: this.currentmarketPlace, AssignUser: this.lstManager,
      parentSku: this.parentSku, amazonSku: this.childSku, category: this.category,
      fromDate: this.fromDate.toLocaleString(), toDate: '', IsDownloadWithDate: isDownloadWithDate
    };
    this._profitServices.downloadProfitLossResultByFilter(profit_Loss_Estimate_Download, modal).subscribe(
      res => {
        const currentdate = new Date();
        const CurrentDateString = monthNames[currentdate.getMonth()];
        this.loading = false;
        const blob = new Blob([res._body], { type: 'text/csv' });
        saveAs(blob, 'ProfitReport_' + currentdate.getDate() + '' + CurrentDateString + '' + currentdate.getFullYear() + '.csv');
      });
  }
  onChangeUnit(currentUnit: any) {
    this.ReportChart();
  }
  selectparentSku() {
    this.childSku = '';
  }
  searchFilter2Childsku(event) {
    const childSkuModel = { parentSkuName: this.parentSku, userName: this.lstManager, chilsSkuName: event.query,
      MerchantId:this.currentMerchant };
    this._inventoryService.GetChildSkuByparentSkuOrUserName(childSkuModel).subscribe(
      result1 => {
        if (result1.StatusCode === 200) {
          this.childSkuList = result1.Data.skulist;
        }
      }
    );
  }
  searchCategory(event) {
    const searchModel = { UserName: this.lstManager, searchCategory: event.query,MerchantId:this.currentMerchant };
    this._inventoryService.getCategories(searchModel).subscribe(
      result => {
        if (result.StatusCode === 200) {
          this.categoryList = result.Data.skulist;
        }
      }
    );
  }
  ReportChart() {
    this.IsDownloadEnable = true;
    Highcharts.chart('profitEstimateReport', {
      chart: {
        zoomType: 'xy'
      },
      title: {
        text: 'Profit and Loss Estimate Report'
      },
      xAxis: [{
        categories: this.ProfitLossEstimateReport['Day'],
        crosshair: true
      }],
      yAxis: [{ // Primary yAxis
        labels: {
          format: '{value}',
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        },
        title: {
          text: 'Amount ($)',
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        }
      }, { // Secondary yAxis
        title: {
          text: 'Ads Cost Amount ($)',
          style: {
            color: Highcharts.getOptions().colors[0]
          }
        },
        labels: {
          format: '{value}',
          style: {
            color: Highcharts.getOptions().colors[0]
          }
        },
        opposite: true
      }],
      tooltip: {
        shared: true
      },
      plotOptions: {
        series: {
          stacking: this.selectedUnit,
          fillOpacity: 0.2
        }
      },
      series: [{
        name: 'Ads-Cost',
        type: 'spline',
        yAxis: 1,
        data: this.ProfitLossEstimateReport['ADVERTISEMENT'],
        tooltip: {
          valueSuffix: ' $'
        },
        color: '#000000'

      }, {
        name: 'Sale',
        type: 'spline',
        data: this.ProfitLossEstimateReport['TOTALSALES'],
        tooltip: {
          valueSuffix: '$'
        },
        color: '#ffa366'
      },
      {
        name: 'Profit',
        type: 'spline',
        data: this.ProfitLossEstimateReport['PROFIT'],
        tooltip: {
          valueSuffix: '$'
        },
        color: '#66ff66'
      }
      ]
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
