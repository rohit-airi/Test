import { Component, OnInit} from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { user_password_setting_api_url } from '../../Shared/_services/api/api.url';
import { UserApiService } from '../../Shared/_services/api/user.api.service';
import { NotificationService } from '../../Shared/_services/notification.service';
import { PasswordValidation } from './../../Shared/_models/passwordvalidaion';
import { ChangePassword } from '../../Shared/_models/changePassword';
 @Component({
    templateUrl: './password.component.html',
    styleUrls: ['./password.comment.css']
})

export class PasswordComponent implements OnInit {
    changePasswordModel: ChangePassword;
    form: FormGroup;
    currentUser: any;
    user: number;
    loading:boolean;
    constructor(private _frmbuilder: FormBuilder, private _userService: UserApiService, private _notification: NotificationService) {
        this.CreateForm();
    }
    ngOnInit() {
      this.changePasswordModel=new ChangePassword();
      this.currentUser =JSON.parse(localStorage.getItem('auth_token'));
    }
    CreateForm() {
        this.form = this._frmbuilder.group({
            UserId: [''],
            hashPassword: ['', Validators.required],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6),Validators.maxLength(15)])],
            confirmPassword: ['',Validators.compose([Validators.required, Validators.min(6),Validators.maxLength(15)])]
        },
        {
          validator: PasswordValidation.MatchPassword
        }
        );
    }
    OnSubmit() {
      this.loading=true;
        this._userService.userPasswordSettingApi(user_password_setting_api_url,this.changePasswordModel).subscribe(res => {
            this.loading=false;
            if (res.StatusCode === 200) {
              this._notification.showSuccess('success','Password Updated Successfully');
                this.form.reset();
            }  else {
              this._notification.showError('error','Current Password Not Matching');
            }
        });
    }
}
