import { Router } from '@angular/router';
import { Component, OnInit, TemplateRef } from '@angular/core';
import {delete_parent_Child,
  parent_import_list_api_url, parent_child_list_by_id_api_url,
  parent_upload_Parent_Child_excel_api_url, parent_Sameple_Download, child_Sameple_Download,get_All_Merchant
} from '../Shared/_services/api/api.url';
import { ParentApiService } from '../Shared/_services/api/parent.api.service';
import { AmazonApiService } from '../Shared/_services/api/amazon.api.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Message } from 'primeng/components/common/api';
import { NotificationService } from '../Shared/_services/notification.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ConfirmationService } from 'primeng/primeng';
import { LoginModel } from '../Shared/_models/loginModel';
import { AmazonsetupComponent } from '../amazonsetup/amazonsetup.component';
@Component({
    templateUrl: './inventory.component.html'

})

export class InventoryComponent implements OnInit {
    file: any;
    ParentList: any = [];
    childList: any = [];
    filterList: any[];
    loading: boolean;
    grdParentloading:boolean;
    grdChildloading:boolean;
    currentUser: LoginModel;
    msgs: Message[] = [];
    uploadedFiles: any[] = [];
    currentParent: string;
    currentParentSku: string;
    modalRef: BsModalRef;
    config = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: false
    };
    currentMerchant:string;
    merchantListModel:any;
    constructor(private _amazonService:AmazonApiService ,private confirmServise: ConfirmationService,
      private _parentService: ParentApiService, private modalService: BsModalService, private _notification: NotificationService) {
                  this.currentUser = JSON.parse(localStorage.getItem('auth_token'));
                 }
    ngOnInit() {
        this.currentMerchant=this.currentUser.MerchantId;
      this.loadParentData();
      this.loadAllmerchant();
    }

    loadParentData() {
      this.grdParentloading=true;
      const merchantModel= {'merchantId':this.currentMerchant};
      this._parentService.ParentListApi(parent_import_list_api_url,merchantModel).subscribe(
        res => {
          this.grdParentloading=false;
          if(res[0].StatusCode===200) {
            this.ParentList = res[0].Data;
          }
      }, error=> {
        this.grdParentloading=false;
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
    openModal(template: TemplateRef<any>, event) {
      this.childList=[];
      this.grdChildloading=true;
        this.modalRef = this.modalService.show(
            template,
            Object.assign({}, this.config, { class: 'gray modal-xlg' })
        );
        this.currentParent = event.data.Name;
        this.currentParentSku= event.data.AmazonSku;
        const skuModel= {'sku':event.data.AmazonSku,'merchantId':this.currentMerchant};
        return this._parentService.ChildListApi(parent_child_list_by_id_api_url, skuModel).subscribe(
            result => {
              this.grdChildloading=false;
                if (result.StatusCode === 200) {
                    this.childList = result.Data;
                }
            },error=> {
              this.grdChildloading=false;
            }
        );
    }

    //#region Parent Excel Upload
    getFiles(files: any) {
        this.filterList = null;
        const taskExcelFiles: FileList = files.files;
        this.file = taskExcelFiles[0];
        const name = this.file.name;
        const validExts = new Array('.xlsx', '.xls');
        const fileExt = name.substring(name.lastIndexOf('.'));
        if (validExts.indexOf(fileExt) < 0) {
            this._notification.showError('error','Invalid file type');
        } else {
            if (this.file !== undefined) {
                this.loading = true;
              this.postfile();
            }
        }
    }
    postfile() {
        if (this.file !== undefined) {
            this._parentService.UploadExcelApi(parent_upload_Parent_Child_excel_api_url, this.file,
              'parent',this.currentUser.UserId,this.currentMerchant).subscribe(res => {
                this.loading = false;
                if(res.StatusCode === 200) {
                  this.loadParentData();
                    if (res.Data.RowSkipped !== 0) {
                        this._notification.showSuccess('success','Records Uploaded');
                        this._notification.showWarn('warn','There are ' + res.Data.RowSkipped + ' rows skipped');
                    }  else {
                      this._notification.showSuccess('success','Records Uploaded successfully');
                    }
              } else if(res.StatusCode === 400) {
                this._notification.showWarn('warn',res.Data.Message);
              } else {
                this._notification.showWarn('warn','Some probelm occured, Please contact your administrator');
              }
            },err=> {
              this.loading = false;
              this._notification.showWarn('warn','Some probelm occur');
            });
        }
    }
    //#endregion

    //#region Child Excel upload
    getChildFiles(files: any) {
        this.filterList = null;
        const taskExcelFiles: FileList = files.files;
        this.file = taskExcelFiles[0];
        const name = this.file.name;
        const validExts = new Array('.xlsx', '.xls');
        const fileExt = name.substring(name.lastIndexOf('.'));

        if (validExts.indexOf(fileExt) < 0) {
          this._notification.showError('error','Invalid file type');
        } else {
            if (this.file !== undefined) {
                this.loading = true;
              this.postChildfile();
            }
        }
    }

    postChildfile() {
        if (this.file !== undefined) {
            this._parentService.UploadExcelApi(parent_upload_Parent_Child_excel_api_url, this.file,
              'child',this.currentUser.UserId,this.currentMerchant).subscribe(res => {
              this.loading = false;
              if(res.StatusCode===200) {
              if (res.Data.RowSkipped !== 0) {
                this._notification.showSuccess('success','Records uploaded Uploaded');
                this._notification.showWarn('error','There are ' + res.Data.RowSkipped + ' rows skipped');
              } else {
                this._notification.showSuccess('success','Records uploaded Uploaded');
              }
            } else if(res.StatusCode===400) {
              this._notification.showWarn('warn',res.Data.Message);
            } else {
              this._notification.showWarn('warn','Some probelm occur');
            }
            }, err=> {
              this.loading=false;
              this._notification.showError('error','Some probelm occur');
            });
        }
    }
    //#endregion
  OnParentorChildDelete(parentOrChild:string) {
    this.confirmServise.confirm({
      message: 'It will delete all the record from '+parentOrChild+' !',
      accept: () => {
        const deleteParams= {'ParentOrChild':parentOrChild,'merchantId':this.currentMerchant};
        this._parentService.DeleteparentOrChild(delete_parent_Child,deleteParams).subscribe(
          result => {
            if (result.StatusCode===200) {
              this._notification.showSuccess('success','All '+parentOrChild+' Deleted successfully');
              this.ParentList=[];
            }
          },
          err=> {
            this._notification.showWarn('warn','Some probelm occur');
          }
        );
      }
    });
  }
  OnParentorChildSample(SampleType:number) {
  let NaavigationUrl='';
  if(SampleType===1) {
    NaavigationUrl=parent_Sameple_Download;
  } else {
    NaavigationUrl=child_Sameple_Download;
  }
  this._parentService.SampleFileNavigation(NaavigationUrl);
  }
}
