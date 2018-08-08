import { CommonModule } from '@angular/common';
import { NgModule, Injectable } from '@angular/core';
import { UrlSerializer } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { AppComponent } from './app.component';
import { DashBoardComponent } from './Dashboard/dashboard.component';
import { InventoryComponent } from './Inventory/inventory.component';
import { RegisterComponent } from './RegisterUser/register.component';
import { LogCommentComponent } from './LogComment/log.comment.component';
import { MismatchComponent } from './Maintenance/mismatch.component';
import { UserComponent } from './UserList/user.component';
import { UserApiService } from './Shared/_services/api/user.api.service';
import { AccountApiService } from './Shared/_services/api/account.api.service';
import { DashBoardApiService } from './Shared/_services/api/dashboard.api.service';
import { ImportApiService } from './Shared/_services/api/import.api.service';
import { AdsReportApiService } from './Shared/_services/api/adsreport.api.service';
import { AppRoutingModule } from './app-routing.module';
import { LogApiService } from './Shared/_services/api/log.api.service';
import { ParentApiService } from './Shared/_services/api/parent.api.service';
import { HttpClient } from './Shared/_services/HttpClient.service';
import { CalendarModule, ButtonModule, SplitButtonModule } from 'primeng/primeng';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { PaginatorModule } from 'primeng/primeng';
import { GrowlModule, MessagesModule, InputSwitchModule } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { InputTextModule } from 'primeng/primeng';
import { DropdownModule,StepsModule } from 'primeng/primeng';
import { InputTextareaModule } from 'primeng/primeng';
import { TooltipModule } from 'primeng/primeng';
import { PasswordModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { RadioButtonModule } from 'primeng/primeng';
import { DataScrollerModule } from 'primeng/primeng';
import {MultiSelectModule,TabViewModule} from 'primeng/primeng';
import {PanelModule} from 'primeng/primeng';
import {ConfirmationService, ConfirmDialogModule} from 'primeng/primeng';
import {AutoCompleteModule, FileUploadModule} from 'primeng/primeng';
import { BsDropdownModule, TabsModule, ModalModule, BsDatepickerModule   } from 'ngx-bootstrap';
import { LoadingModule } from 'ngx-loading';
import { AuthGuard } from './Shared/_guards/auth.guard';
import { HeaderComponent } from './Shared/header/header.component';
import { SidebarComponent } from './Shared/sidebar/sidebar.component';
import { CommonService } from './Shared/_services/common.service';
import { DropdownDirective } from './Shared/sidebar/dropdown.directive';
import { DSTBCIComponent } from './Dstbci/dstbci.component';
import { AuthHttp,AuthConfig } from 'angular2-jwt/angular2-jwt';
import { PageNotFoundComponent} from './404/PageNotFound.Component';
import { CustomUrlSerializer } from './Shared/common/CustomUrlSerializer';
import { SettingModule } from './Settings/setting.module';
import { NotificationService } from './Shared/_services/notification.service';
import { InventoryApiService } from './Shared/_services/api/inventory.api.service';
export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp( new AuthConfig({}), http, options);
}
@NgModule({
  declarations: [
    AppComponent,
    DSTBCIComponent,
    DashBoardComponent,
    UserComponent,
    InventoryComponent,
    RegisterComponent,
    LogCommentComponent,
    MismatchComponent,
    HeaderComponent,
    SidebarComponent,
    DropdownDirective,
    PageNotFoundComponent
  ],
  imports: [
    SettingModule,
    InputSwitchModule,
    SplitButtonModule,
    StepsModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    MessagesModule,
    CommonModule,
    HttpModule,
    FormsModule,
    AppRoutingModule,
    CalendarModule,
    DataTableModule,
    SharedModule,
    GrowlModule,
    PaginatorModule,
    InputTextModule,
    DropdownModule,
    InputTextareaModule,
    ButtonModule,
    TooltipModule,
    PasswordModule,
    DialogModule,
    CheckboxModule,
    RadioButtonModule,
    DataScrollerModule,
    LoadingModule,
    MultiSelectModule,
    PanelModule,
    AutoCompleteModule,
    FileUploadModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TabViewModule
  ],
  providers: [
    {
      provide: UrlSerializer,
      useClass: CustomUrlSerializer
    },
    NotificationService,
    CommonService,
    UserApiService,
    AuthGuard,
    {
      provide:AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [ Http, RequestOptions ]
    },
    ConfirmationService,
    DashBoardApiService,
    ImportApiService,
    MessageService,
    AdsReportApiService,
    LogApiService,
    ParentApiService,
    AccountApiService,
    InventoryApiService,
    HttpClient,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
