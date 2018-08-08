import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ParentApiService } from '../Shared/_services/api/parent.api.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Message } from 'primeng/components/common/api';
import { NotificationService } from '../Shared/_services/notification.service';
import { get_All_Merchant, get_markteplace_By_merchantId,upload_DSTBCI_Report,
  Get_Last_Upload_File_Date } from '../Shared/_services/api/api.url';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { LoginModel } from '../Shared/_models/loginModel';
import { AmazonApiService } from '../Shared/_services/api/amazon.api.service';
@Component({
  templateUrl: './dstbci.component.html',
  styleUrls:['./dstbci.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class DSTBCIComponent implements OnInit {
  bsConfig: Partial<BsDatepickerConfig>;
  loading: boolean;
  reportDate: Date;
  file: any;
  lastUploadDate:any;
  msgs: Message[] = [];
  userInfo:LoginModel;
  maxdate:Date;
  marketPlaceModel:any;
  currentmarketPlace:any;
  currentMerchant:string;
  merchantListModel:any;
  constructor(private _amazonService:AmazonApiService, private _parentService:ParentApiService,private _notification: NotificationService) {
    this.loading=false;
    this.maxdate=new Date();
    this.userInfo=JSON.parse(localStorage.getItem('auth_token'));
    this.currentMerchant=this.userInfo.MerchantId;
  }
ngOnInit() {
this.getLastUploadFileDate();
this.loadAllmerchant();
}
getLastUploadFileDate() {
  this.loading=true;
const merchantModel= { 'MerchantId': this.currentMerchant};
this._parentService.getLastUploadFileDate(get_markteplace_By_merchantId,Get_Last_Upload_File_Date,merchantModel).subscribe(
  data=> {
    this.loading=false;
    if(data[0].StatusCode === 200) {
      this.lastUploadDate = data[0].Data;
    }
    if(data[1].StatusCode === 200) {
          this.marketPlaceModel=JSON.parse(data[1].Data.MarketPlaceinfo);
          this.currentmarketPlace=data[1].Data.CurrentSelectedmarketPlace;
    }
  },
  error=> {
    this.loading=false;
  });
}
  getChildFiles(files: any) {
    const taskExcelFiles: FileList = files.files;
    this.file = taskExcelFiles[0];
    const name = this.file.name;
    const validExts = new Array('.csv');
    const fileExt = name.substring(name.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      this._notification.showError('error','Invalid file type');
    } else {
      if (this.file !== undefined) {
        this.loading = true;
        this._parentService.UploadDSTBCIReport(upload_DSTBCI_Report , this.file,this.reportDate.toLocaleString(),
        this.currentMerchant,this.currentmarketPlace).subscribe(res => {
          this.loading=false;
          if (res.Data) {
            this.getLastUploadFileDate();
            this._notification.showSuccess('success','File Uploaded successfully');
          }
        },
          error=> {
            this.loading=false;
            this._notification.showError('error','Some problem found');
          });
      }
    }
  }
  loadAllmerchant() {
    this.loading=true;
    this._amazonService.getAllmerchant(get_All_Merchant).subscribe(
      res=> {
        if(res.StatusCode===200) {
          this.merchantListModel=res.Data;
        }
      },
      error=> {
        this.loading=false;
      }
    );
  }
}
