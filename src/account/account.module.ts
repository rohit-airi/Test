import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountComponent } from './account.component';
import { LoginComponent } from './login.component';
import { ForgotPasswordComponent } from './forgotpassword.component';
import { NewPasswordComponent } from './newpassword.component';
import { AccountRoutingModule } from './account.routing.module';
import { UserApiService } from '../app/Shared/_services/api/user.api.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { LoadingModule } from 'ngx-loading';
import {GrowlModule,DropdownModule } from 'primeng/primeng';
import { SignUpComponent } from './signup.component';
import { AccountApiService } from '../app/Shared/_services/api/account.api.service';
import { OnlyNumberDirective } from '../app/Shared/_models/onlynumber.directive';
import { PrivacypolicyComponent } from './privacypolicy.component';
@NgModule({
    imports: [
        CommonModule,
        AccountRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        GrowlModule,
        LoadingModule,
      GrowlModule,
      DropdownModule
    ],
    declarations: [
      OnlyNumberDirective,
        AccountComponent,
        LoginComponent,
        ForgotPasswordComponent,
        NewPasswordComponent,
      SignUpComponent,
      PrivacypolicyComponent
    ],
    providers: [UserApiService, MessageService, AccountApiService]
})
export class AccountModule {
}
