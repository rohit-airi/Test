import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { AccountApiService } from '../app/Shared/_services/api/account.api.service';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/components/common/messageservice';
import { Get_All_Country,register_User } from '../app/Shared/_services/api/api.url';
import { PasswordValidation } from '../app/Shared/_models/passwordvalidaion';
import { UserForm } from '../app/Shared/_models/signupForm';
@Component({
    moduleId: module.id,
    templateUrl: './signup.component.html',
    styleUrls:['./signup.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class SignUpComponent implements OnInit {
    model: any = {};
    countryList:any[];
    loading: boolean;
    form: FormGroup;
    selectedCountry:number;
    userForm: UserForm=new UserForm();
    emailRegex:any=/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    passwordRegex:any=/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,100})/;
    constructor(private _fb:FormBuilder, private messageService: MessageService,
        private router: Router,
        private accountService: AccountApiService,
        private _cookieService: CookieService
    ) {
        if (_cookieService.get('remember')) {
            this.model.email = this._cookieService.get('email');
            this.model.password = this._cookieService.get('password');
            this.model.rememberme = this._cookieService.get('remember');
        }
    }
    ngOnInit() {
        this.form =this._fb.group({
          companyName: ['',Validators.compose([Validators.required, Validators.maxLength(75)])],
          firstName: ['',Validators.compose([Validators.required,Validators.maxLength(25)])],
          lastName: ['',Validators.maxLength(25)],
          email: [null, Validators.compose([ Validators.required,Validators.pattern(this.emailRegex),Validators.maxLength(256)])],
          password: ['', Validators.compose([Validators.required, Validators.minLength(6),Validators.maxLength(15)])],
          confirmPassword: ['',Validators.compose([Validators.required, Validators.min(6),Validators.maxLength(15)])],
          mobileNo: ['',Validators.compose([Validators.minLength(10),Validators.maxLength(10)])],
          address: [''],
          countryId: ['',Validators.required],
          state:[''],
          city: ['']
        }, {
            validator: PasswordValidation.MatchPassword
          }
          );
        this.getAllCountry();
    }
    getAllCountry() {
      this.accountService.getAllCountry(Get_All_Country).subscribe(
        result=> {
          if(result.StatusCode===200) {
            this.countryList=result.Data;
          }
        },
        error => {
        }
      );
    }
    numberOnly(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;

    }
    onSubmit(model) {
        this.loading = true;
        this.accountService.registerUser(register_User,this.userForm).subscribe(
          result=> {
            this.loading=false;
            if(result.StatusCode===200) {
              this.messageService.add({severity:'success', summary:'Register', detail:'Signup successfully!'});
              this.router.navigate(['/account/login']);
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
    remember(e) {
        if (e.target.checked) {
            // this.remeberStatus = true;
        }
    }
}

