import {Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Get_All_Country, register_User, user_email_check_api_url } from '../Shared/_services/api/api.url';
import 'rxjs/add/operator/map';
import { UserApiService } from '../Shared/_services/api/user.api.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { UserForm } from '../Shared/_models/signupForm';
import { PasswordValidation } from '../Shared/_models/passwordvalidaion';
import { AccountApiService } from '../Shared/_services/api/account.api.service';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/primeng';

@Component({
    selector:'app-register',
    templateUrl: './register.component.html',
    styleUrls:['./register.component.css']
})
export class RegisterComponent implements  OnInit {
  model: any = {};
  countryList:SelectItem[];
  loading: boolean;
  form: FormGroup;
  selectedCountry:number;
  userForm: UserForm=new UserForm();
  emailRegex:any=/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  passwordRegex:any=/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,100})/;
  userInfo:any;
    constructor(private _router:Router, private accountService: AccountApiService, private _fb:FormBuilder,
      private userapi: UserApiService, private messageService: MessageService) {
        this.userInfo=JSON.parse(localStorage.getItem('auth_token'));
        this.userForm.addedby=this.userInfo.UserId;
        this.form =this._fb.group({
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
        this.getAllCountry();
    }
    ngOnInit() {
    }
    getAllCountry() {
      this.accountService.getAllCountry(Get_All_Country).subscribe(
        result=> {
          if(result.StatusCode===200) {
            this.countryList=[];
            result.Data.forEach(element=> {
              this.countryList.push({label: element.CountryName,value: element.CountryId});
            });
          }
        },
        error => {
        }
      );
    }
    onSubmit() {
      this.loading = true;
      this.accountService.registerUser(register_User,this.userForm).subscribe(
        result=> {
          this.loading=false;
          if(result.StatusCode===200) {
            this.messageService.add({severity:'success', summary:'Register', detail:'User Created successfully!'});
            this._router.navigate(['/app/User']);
          } else {
            this.messageService.add({severity:'warning',summary:'Warning',detail:'Unable to create User!'});
          }
        },
        error=> {
          this.loading=false;
          this.messageService.add({severity :'error',summary:'Error',detail:'Unable to create user!'});
        }
      );
    }
    CheckEmail(event) {
        const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
        if (event.target.value !== '' && (event.target.value <= 5 || !EMAIL_REGEXP.test(event.target.value))) {
            return { 'Please provide a valid email': true };
        } else {
            this.userapi.EmailCheckApi(user_email_check_api_url, event.target.value).subscribe(res => {
                if (res.Data === 'Already exists') {
                    this.messageService.add
                        ({ severity: 'error', summary: 'Email', detail: res.Data });
                    this.form.patchValue({ 'email': null });
                }
            }
            );
        }
    }
    numberOnly(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;

    }
}
