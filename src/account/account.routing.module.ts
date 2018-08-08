import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { AccountComponent } from './account.component';
import { ForgotPasswordComponent } from './forgotpassword.component';
import { SignUpComponent } from './signup.component';
import { PrivacypolicyComponent } from './privacypolicy.component';
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AccountComponent,
                children: [
                    { path: 'login', component: LoginComponent },
                    { path: 'login/returnUrl:', component: LoginComponent },
                    { path: 'forgot', component: ForgotPasswordComponent },
                    { path: 'signup',component:SignUpComponent},
                    { path: 'privacy',component:PrivacypolicyComponent}
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AccountRoutingModule { }
