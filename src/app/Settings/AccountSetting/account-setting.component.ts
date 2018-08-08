import { Component,OnInit,TemplateRef,ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { BsModalRef,BsModalService } from 'ngx-bootstrap/modal';
import { MenuItem, Message, ConfirmationService } from 'primeng/primeng';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { get_Merchant,update_merchant } from '../../Shared/_services/api/api.url';
import { AmazonApiService } from '../../Shared/_services/api/amazon.api.service';
import { NotificationService } from '../../Shared/_services/notification.service';
import * as $ from 'jquery';
@Component({
  templateUrl:'./account-setting.component.html',
  styleUrls:['./account-setting.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class AccountSettingComponent implements OnInit {
  isNewMerchantClicked:boolean;
  loading:boolean;
  merchantLoader:boolean;
  Newmerchantloading:boolean;
  merchantList:any;
  modalRef: BsModalRef;
  config = {
    animated: true,
    keyboard: false,
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'model-dialog'
  };
  msgsMerchant:Message[]=[];
constructor (private cdRef: ChangeDetectorRef,private _confirmServise:ConfirmationService,
  private _notifications: NotificationService,private _amazonService:AmazonApiService,private _fb:FormBuilder,
private modalService: BsModalService) {
  this.isNewMerchantClicked=true;
}
ngOnInit() {
  this.getAllmerchant();
}
displayModalData(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(
    template,
    Object.assign({}, this.config, { class: 'gray modal-lg' })
  );
}
getAllmerchant() {
  this.merchantLoader=true;
  this._amazonService.getAllmerchant(get_Merchant).subscribe(
    result=> {
      this.merchantLoader=false;
      if(result.StatusCode===200) {
        this.merchantList=result.Data;
      }
    },
    error=> {
      this.merchantLoader=false;
    });
}
enableOrDisable(currentMerchant:any) {
  this.cdRef.detectChanges();
   this._confirmServise.confirm({
     message: 'Are you sure to update this Merchant?',
     accept: () => {
      this.loading=true;
      this._amazonService.UpdateMerchant(update_merchant, currentMerchant).subscribe(
        result => {
          this.loading=false;
          if (result.StatusCode===200) {
            if(result.Data==='Can not be disable last one') {
              this._notifications.showWarn('Merchant Info',result.Data);
            }else {
              this._notifications.showSuccess('Merchant Info','Merchant added successfully');
            }
            this.getAllmerchant();
          } else {
            this._notifications.showError('Merchant Info','result.Result.Message');
          }
        },error=> {
          this.loading=false;
        }
      );
   },
    reject:()=> {
      this.getAllmerchant();
    }
 });

}
  receiveMessage($event) {
      this.msgsMerchant=[];
      if($event.StatusCode===200) {
        // this.msgsMerchant.push({severity:'success', summary:'Success Message', detail:'Merchant added!'});
        this.modalRef.hide();
        this.getAllmerchant();
        this._notifications.showSuccess('Success','Merchant added!');
      } else {
        $('#testDiv').animate({scrollTop:'top'});
        this.msgsMerchant.push({severity:'warn', summary:'Warn Message', detail:$event.Data});
      }
  }
}
