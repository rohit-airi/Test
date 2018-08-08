import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  get_markteplace_By_merchantId, log_add_comment_api_url, log_delete_api_url,
  log_comment_list_api_url, log_childbyparent_list_api_url,
  log_parent_list_api_url, upload_log_image, get_All_Merchant
} from '../Shared/_services/api/api.url';
import { LogApiService } from '../Shared/_services/api/log.api.service';
import { Message } from 'primeng/primeng';
import { NotificationService } from '../Shared/_services/notification.service';
import { ConfirmationService } from 'primeng/primeng';
import { InventoryApiService } from '../Shared/_services/api/inventory.api.service';
import { LoginModel } from '../Shared/_models/loginModel';
import { AmazonApiService } from '../Shared/_services/api/amazon.api.service';
@Component({
  templateUrl: './log.comment.component.html',
  styleUrls: ['./log.comment.css'],
  encapsulation: ViewEncapsulation.None
})
export class LogCommentComponent implements OnInit {
  msgs: Message[] = [];
  form: FormGroup;
  ParentList: any[];
  ChildList: any[];
  ChangeID: any[];
  loading: boolean;
  logList: any[];
  currentUser: any;
  UserId: number;
  userInfo: LoginModel;
  selectedchangeType: number;
  file: any;
  OldBidValue: string;
  NewBidValue: string;
  ImangeName: string;
  logCommentModel: any;
  selectedParent: string;
  selectedChild: string;
  imageSrc: string;
  imageSrcNew: string;
  oldBid: string;
  newBid: string;
  currentLogCommentId: number;
  buttonText: number;
  marketPlaceModel: any;
  currentmarketPlace: any;
  currentMerchant: any;
  merchantListModel: any;
  constructor(private _amazonService: AmazonApiService,private _inventoryService: InventoryApiService,
    private confirmServise: ConfirmationService,
    private logService: LogApiService,
    private fb: FormBuilder, private _notification: NotificationService) {
    this.userInfo = JSON.parse(localStorage.getItem('auth_token'));
    this.CreateForm();
    this.file = [];
    this.selectedParent = '';
    this.currentMerchant = this.userInfo.MerchantId;
  }

  ngOnInit() {
    this.LoadData();
    this.logService.ParentListApi(log_parent_list_api_url).subscribe(res => {
      if (res.StatusCode === 200) {
        this.ParentList = res.Data.map(o => {
          return { label: o.AmazonSku, value: o.AmazonSku };
        });
      }
    });
    this.loadChild();
    this.getMarketPlace();
    this.loadAllmerchant();
  }
  CreateForm() {
    this.form = this.fb.group({
      LogCommentId: ['',],
      ParentItemId: ['', Validators.required],
      ChildItemId: ['', Validators.required],
      ChangeType: ['', Validators.required],
      Description: [''],
      CommentBy: [''],
      MerchantId: [''],
      Merchant:[''],
      NewValue: ['', Validators.required],
      OldValue: ['', Validators.required]
    });

    this.ChildList = [
      { label: 'Select Child', value: null }
    ];
    this.ChangeID = [
      { label: 'Select Change Type', value: 0 },
      { label: 'Image', value: 1 },
      { label: 'Bids Change', value: 2 },
      { label: 'Ad Optimization', value: 3 },
      { label: 'Title', value: 4 },
      { label: 'Bullet Points', value: 5 },
      { label: 'Keywords', value: 6 },
      { label: 'Price', value: 7 }
    ];
    this.selectedchangeType = 0;
    this.OldBidValue = '';
    this.NewBidValue = '';
    this.ImangeName = '';
    this.buttonText = 0;
    this.currentLogCommentId = 0;
  }
  OnSubmit(form) {
    const CurrentChangeType = this.ChangeID.find(x => x.value === this.selectedchangeType);
    this.loading = true;
    this.logCommentModel = {
      'Id': form.LogCommentId, 'ParentItemID': form.ParentItemId, 'ChildItemID': form.ChildItemId,
      'ChangeType': CurrentChangeType.label,
      'CommentBy': form.CommentBy, 'Description': '', 'MerchantId': this.currentMerchant,
      'MarketPlaceId': this.currentmarketPlace,
      'NewValue': form.NewValue, 'OldValue': this.oldBid
    };
    if (this.selectedchangeType >= 1) {
      if ((this.logCommentModel.ParentItemID !== undefined || this.logCommentModel.ParentItemID !== '') ||
        (this.logCommentModel.ChildItemID !== undefined || this.logCommentModel.ChildItemID !== '')) {
        if (this.selectedchangeType === 1) {
          if (this.file !== undefined) {
            let uploadType, fileToDelete;
            if (this.logCommentModel.Id !== null && this.logCommentModel.Id > 1) {
              uploadType = 'Update';
              fileToDelete = this.imageSrc;
            } else {
              uploadType = 'Insert';
              fileToDelete = '';
            }
            this.logService.logCommentUploadApi(upload_log_image, this.file, uploadType, fileToDelete).subscribe(res => {
              if (res.StatusCode === 200) {
                this.logCommentModel.NewValue = res.Data;
                this.logService.logCommentAddApi(log_add_comment_api_url, this.logCommentModel).subscribe(
                  result => {
                    this.loading = false;
                    if (result.StatusCode === 200) {
                      this._notification.showSuccess('Success','Successfully');
                      this.resetForm();
                      this.LoadData();
                    }
                  });
              } else {
                this.loading = false;
                this._notification.showError('error','Failed to submit');
              }
            });
          } else {
            this.loading = false;
            this._notification.showError('warn','Please select your Image');
          }
        } else {
          this.logService.logCommentAddApi(log_add_comment_api_url, this.logCommentModel).subscribe(
            result => {
              if (result.StatusCode === 200) {
                this._notification.showSuccess('Success','Successfully');
                this.resetForm();
                this.LoadData();
              }
            });
        }
      } else {
        this.loading = false;
        this._notification.showError('warn','Please fill required field');
      }
    } else {
      this.loading = false;
      this._notification.showError('warn','Please fill required field');
    }
  }
  resetForm() {
    this.form.reset();
    this.buttonText = 0;
    this.imageSrc = '';
    this.ImangeName = '';
    this.oldBid = '';
    this.newBid = '';
  }
  onSelectParent(event) {
    this.selectedChild = '';
    this.form.controls.ChildItemId['_status'] = 'VALID';
    if (event.value !== undefined) {
      this.logService.ChildByParentListApi(log_childbyparent_list_api_url, event.value).subscribe(res => {
        if (res.StatusCode === 200) {
          this.ChildList = [];
          this.ChildList = res.Data.map(o => {
            return { label: o.AmazonSku, value: o.AmazonSku };
          });
        }
      });
    } else {
      this.ChildList = [];
      this.loadChild();
    }
  }
  searchFilter2Childsku(event) {
    const childSkuModel = { parentSkuName: this.selectedParent, userName: '', chilsSkuName: event.query,MerchantId:this.currentMerchant };
    this._inventoryService.GetChildSkuByparentSkuOrUserName(childSkuModel).subscribe(
      result1 => {
        if (result1.StatusCode === 200) {
          this.ChildList = result1.Data.skulist;
        }
      }
    );
  }
  searchparentSku(event) {
    const skumodel = { skuName: event.query, userName: '',MerchantId:this.currentMerchant };
    this._inventoryService.GetParentSkuList(skumodel).subscribe(
      result => {
        if (result.StatusCode === 200) {
          this.ParentList = result.Data.skulist;
        }
      }
    );
  }
  onSelectChid(event) {
    this.form.controls.ParentItemId['_status'] = 'VALID';
  }
  loadChild() {
    this.logService.ChildByParentListApi(log_childbyparent_list_api_url, '').subscribe(res => {
      this.ChildList = res.Data.map(o => {
        return { label: o.AmazonSku, value: o.AmazonSku };
      });
    });
  }
  getFiles(files: any, filetype: string) {
    const taskExcelFiles: FileList = files.files;
    const name = files.files[0].name.toLowerCase();
    const validExts = new Array('.jpg', '.jpeg', '.png');
    const fileExt = name.substring(name.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      this._notification.showError('error','Invalid file type');
    } else {
      this.file.push(taskExcelFiles[0]);
      if (this.file !== undefined) {
        this.ImangeName = name;
      }
    }
  }
  OnDelete(item) {
    this.confirmServise.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
        this.loading = true;
        const deleteModel = { 'LogCommentId': item.Id };
        this.logService.logDeleteApi(log_delete_api_url, deleteModel).subscribe(res => {
          if (res.StatusCode === 200) {
            this.logList = res.Data;
          }
          this.loading = false;
        });
      }
    });
  }
  OnEdit(item) {
    // for updating button text to Update
    this.buttonText = 1;
    this.currentLogCommentId = item.Id;
    this.selectedParent = item.ParentItemID;
    this.selectedChild = item.ChildItemID;
    this.selectedchangeType = item.ChangeTypeValue;
    if (this.selectedchangeType === 1) {
      this.imageSrc = item.NewValue;
      // this.imageSrcNew=item.OldValue;
      this.oldBid = item.NewValue;
      this.form.controls.NewValue['_status'] = 'VALID';
      this.form.controls.OldValue['_status'] = 'VALID';
      this.form.updateValueAndValidity();
    } else {
      this.oldBid = item.OldValue;
      this.newBid = item.NewValue;
    }
    this.changeType();
  }
  updateControlByChangeType() {
    if (this.selectedchangeType === 1) {
      this.form.controls.NewValue['_status'] = 'VALID';
      this.form.controls.OldValue['_status'] = 'VALID';
      this.form.updateValueAndValidity();
    } else {
    }
  }
  changeType() {
    if (this.selectedParent !== undefined && this.selectedParent !== '') {
      if (this.selectedChild !== undefined && this.selectedChild !== '') {

      } else {
        this.form.controls.ChildItemId['_status'] = 'VALID';
        this.form.updateValueAndValidity();
      }
    } else if (this.selectedChild !== undefined && this.selectedChild !== '') {
      this.form.controls.ParentItemId['_status'] = 'VALID';
      this.form.updateValueAndValidity();
    }
    this.OldBidValue = 'Old Value';
    this.NewBidValue = 'New Value';
    this.updateControlByChangeType();
  }
  LoadData() {
    this.loading=true;
    const merchantModel = { 'MerchantId': this.currentMerchant==null?this.userInfo.MerchantId:this.currentMerchant};
    this.loading = true;
      this.logService.logCommentListApi(log_comment_list_api_url, merchantModel).subscribe(res => {
        this.loading=false;
        if(res.StatusCode===200) {
          this.logList = res.Data;
        }
      });
      this.loading = false;
  }
  getMarketPlace() {
    this.loading=true;
    const merchantModel = { 'MerchantId': this.currentMerchant };
    this._amazonService.getMarketPlaceBymerchant(get_markteplace_By_merchantId, merchantModel).subscribe(
      result => {
        this.loading=false;
        if (result.StatusCode === 200) {
          this.marketPlaceModel = JSON.parse(result.Data.MarketPlaceinfo);
          this.currentmarketPlace = result.Data.CurrentSelectedmarketPlace;
        }
      }, error => {
        this.loading=false;
      });
  }
  loadAllmerchant() {
    this.loading = true;
    this._amazonService.getAllmerchant(get_All_Merchant).subscribe(
      res => {
        this.loading = false;
        if (res.StatusCode === 200) {
          this.merchantListModel = res.Data;
        }
      },
      error => {
        this.loading = false;
      }
    );
  }
  updateMerchant() {
    this.selectedParent='';
    this.selectedChild='';
    this.selectedchangeType=0;
    this.getMarketPlace();
    this.LoadData();
  }
}
