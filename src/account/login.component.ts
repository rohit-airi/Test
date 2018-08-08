import { Component, OnInit, Compiler   } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/components/common/messageservice';
import { AuthService } from '../app/Shared/_services/auth.service';
import { TokenService } from 'angular2-auth';
@Component({
    moduleId: module.id,
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    model: any = {};
    loading: boolean;
    returnUrl: string;
    form: FormGroup;
    remeberStatus: boolean;
    constructor(
      private _compiler:Compiler,
      private messageService: MessageService,
        private route: ActivatedRoute,
        private router: Router,
        private _cookieService: CookieService,
      private _authService:AuthService,
      private _tokenService: TokenService
    ) {
        if (_cookieService.get('remember')) {
            this.model.email = this._cookieService.get('email');
            this.model.password = this._cookieService.get('password');
            this.model.rememberme = this._cookieService.get('remember');
        }
    }
    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.form = new FormGroup({
            email: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
            rememberme: new FormControl('')
        });
        // Testing to clear cookies after closing browser
        // this._authService.deleteCoockies();
       if(this._authService.loggedIn()) {

         this.router.navigate(['/app/dashboard'], {relativeTo: this.route});
       }
    }

    onSubmit(loginForm) {
      const loginmodel='username='+loginForm.email+'&password='+loginForm.password+'&grant_type=password';
        this.loading = true;
       this._authService.login(loginmodel).subscribe(
         response=> {
           this.loading = false;
               if(response.status===200) {

                 this._tokenService.setToken(response['_body']);
                       this.messageService.add({severity:'success', summary:'Login', detail:'Login successfully'});
                             if (this.model.rememberme === true || this.model.rememberme === 'true') {
                                 this._cookieService.set('email', this.model.email);
                                 this._cookieService.set('password', this.model.password);
                                 this._cookieService.set('remember', this.model.rememberme);
                             } else {
                                 this._cookieService.deleteAll();
                             }
                             this.router.navigate(['/app/dashboard']);
           } else {
                 this.messageService.add({severity:'error', summary:'Login Error', detail:'Username or Password is Invalid!'});
               }
         },
         error=> {
           if (error.status===400) {
             this.loading = false;
             this.messageService.add({severity:'error', summary:'Login Error', detail:'Username or Password is Invalid!'});
           }
         }
       );
    }
    remember(e) {
        if (e.target.checked) {
            this.remeberStatus = true;
        }
    }
}
