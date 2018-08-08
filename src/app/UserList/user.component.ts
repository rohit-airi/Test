import { Component, OnInit, TemplateRef} from '@angular/core';
import { users_update_api_url,user_email_check_api_url,register_User,
  user_delete_api_url,all_User_By_parentId, Get_All_Country } from '../Shared/_services/api/api.url';
import { UserApiService } from '../Shared/_services/api/user.api.service';
import { Validators, FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NotificationService } from '../Shared/_services/notification.service';
import { ConfirmationService } from 'primeng/primeng';
import { PasswordValidation } from '../Shared/_models/passwordvalidaion';
import { AccountApiService } from '../Shared/_services/api/account.api.service';
import { UserForm } from '../Shared/_models/signupForm';
import {Message} from 'primeng/components/common/api';
@Component({
    selector: 'app-user',
    templateUrl: './user.component.html'
})

export class UserComponent implements OnInit {
    registerNotification: Message[] = [];
    userList: any[];
    countryList:any[];
    updateForm: any;
    loading: boolean;
    updateloading: boolean;
    registerloading: boolean;
    form: any;
    formUser: any;
  modalRef: BsModalRef;
  userForm: UserForm=new UserForm();
  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false
  };
  userInfo:any ;
  emailRegex:any=/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    constructor(private _accountService: AccountApiService,
      private confirmServise: ConfirmationService,
      private _notification: NotificationService, private modalService: BsModalService,
        private _userservice: UserApiService, private builder: FormBuilder) {
        this.userInfo=JSON.parse(localStorage.getItem('auth_token'));
        this.userForm.addedby=this.userInfo.UserId;
        this.form =this.builder.group({
          firstName: ['',Validators.compose([Validators.required,Validators.maxLength(25)])],
          lastName: ['',Validators.maxLength(25)],
          email: ['', Validators.compose([ Validators.required,Validators.pattern(this.emailRegex),Validators.maxLength(256)])],
          mobileNo: ['',Validators.compose([Validators.minLength(10),Validators.maxLength(10)])],
          address: [''],
          countryId: [''],
          state:[''],
          city: [''],
          addedBy: []
        });
    }
    ngOnInit() {
      this.getAlluserbyparentId();
    }
    numberOnly(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;

    }
    getAlluserbyparentId() {
      this.loading=true;
      const parentModel = { 'ParentId':this.userInfo.UserId};
      this._userservice.getallUserByParentId(all_User_By_parentId,parentModel).subscribe(
        result=> {
          this.loading=false;
          if (result.StatusCode===200) {
            this.userList=result.Data;
          }
        },error=> {
          this.loading=false;
        }
      );
    }
    displayModalData(template: TemplateRef<any>,id) {
      this.getAllCountry();
      if(id>0) {
        this.updateForm = this.userList.find(r => r.UserId === id);
      } else {
        this.userForm= new UserForm();
        this.initUserForm();
      }
      this.modalRef = this.modalService.show(
        template,
        Object.assign({}, this.config, { class: 'gray modal-xlg' })
      );
    }

    UpdateInfo() {
      this.updateloading=true;
        this._userservice.userInfoUpdateApi(users_update_api_url, this.updateForm).subscribe(
          result => {
            this.updateloading=false;
            if (result.StatusCode === 200) {
              this._notification.showSuccess('success','User details updated successfully');
              this.modalRef.hide();
            } else {
              this._notification.showWarn('warn','Unable to update');
            }
        });
    }
    deleteUser(id) {
      this.confirmServise.confirm({
        message: 'Are you sure that you want to perform this action?',
        accept: () => {
          this.loading=true;
          const deleteModel= {'UserAccountId':id};
          this._userservice.userDelete(user_delete_api_url, deleteModel).subscribe(res => {
            if(res.StatusCode===200) {
              this.loading=false;
            this.getAlluserbyparentId();
            }
          });
        }
      });
    }
    getAllCountry() {
      this._accountService.getAllCountry(Get_All_Country).subscribe(
        result=> {
          if(result.StatusCode===200) {
            this.countryList=result.Data;
          }
        },
        error => {
        }
      );
    }
    // Adding New user start here
    initUserForm() {
      this.formUser =this.builder.group({
        firstName: ['',Validators.compose([Validators.required,Validators.maxLength(25)])],
        lastName: ['',Validators.maxLength(25)],
        email: [null, Validators.compose([ Validators.required,Validators.pattern(this.emailRegex),Validators.maxLength(256)])],
        password: ['', Validators.compose([Validators.required, Validators.minLength(6),Validators.maxLength(15)])],
        confirmPassword: ['',Validators.compose([Validators.required, Validators.min(6),Validators.maxLength(15)])],
        mobileNo: ['',Validators.compose([Validators.minLength(10),Validators.maxLength(10)])],
        address: [''],
        countryId: ['', Validators.required],
        state:[''],
        city: [''],
        addedBy: []
      }, {
          validator: PasswordValidation.MatchPassword
        });
        this.userForm.countryid=1;
    }
    CheckEmail(event) {
      const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
      if (event.target.value !== '' && (event.target.value <= 5 || !EMAIL_REGEXP.test(event.target.value))) {
          return { 'Please provide a valid email': true };
      } else {
          this._userservice.EmailCheckApi(user_email_check_api_url, event.target.value).subscribe(res => {
            if (res.Data === 'Already exists') {
                  // this.messageService.add
                  //     ({ severity: 'error', summary: 'Email', detail: res.Data });
                  this.registerNotification = [];
        this.registerNotification.push({severity:'warning', summary:'Warn Message',detail:'Email ' + res.Data});
                  this.formUser.patchValue({ 'email': null });
              }
          }
          );
      }
  }
  onSubmit() {
    this.registerNotification = [];
    this.registerloading = true;
    this._accountService.registerUser(register_User,this.userForm).subscribe(
      result=> {
        this.registerloading=false;
        if(result.StatusCode===200) {
          this._notification.showSuccess('success','User Created successfully');
          this.modalRef.hide();
          this.getAlluserbyparentId();
        } else {
          this.registerNotification.push({severity:'warning', summary:'Warning Message',detail:'Unable to create User!'});
        }
      },
      error=> {
        this.registerloading=false;
        this.registerNotification.push({severity:'warning', summary:'Warning Message',detail:'Unable to create User!'});
      }
    );
  }
    // End Here
}
