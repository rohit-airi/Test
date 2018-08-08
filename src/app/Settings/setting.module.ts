import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingModule } from 'ngx-loading';
import {
  DataTableModule, InputSwitchModule, GrowlModule, ConfirmDialogModule, TabViewModule, PanelModule,
  RadioButtonModule,DropdownModule
} from 'primeng/primeng';
// Component, Services
import { AdvertisementSettingComponent } from './AdvertisementSetting/advertisement-setting';
import { AccountSettingComponent } from './AccountSetting/account-setting.component';
import { AmazonsetupComponent } from '../amazonsetup/amazonsetup.component';
import { InventorySettingComponent } from './InventorySettings/inventory-setting.component';
import { PasswordComponent } from './PasswordManagement/password.component';
import { SchedulerComponent } from './ReportScheduling/ReportScheduling.component';
import { MarketplaceComponent } from './Marketplaces/marketplaces.component';
import { AmazonDataComponent } from './AdvertisementSetting/amazondata';
import { SettingService } from './setting.service';
// End here
import { AmazonApiService } from '../Shared/_services/api/amazon.api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingRoutingModule } from './setting-routing.module';
@NgModule({
  imports: [CommonModule,
    LoadingModule,
    DataTableModule,
    InputSwitchModule,
    GrowlModule,
    ConfirmDialogModule,
    PanelModule,
    TabViewModule,
    FormsModule,
    ReactiveFormsModule,
    SettingRoutingModule,
    RadioButtonModule,
    DropdownModule
  ],
  declarations: [AdvertisementSettingComponent,
    AccountSettingComponent,
    AmazonsetupComponent,
    InventorySettingComponent,
    PasswordComponent,
    SchedulerComponent,
    MarketplaceComponent,
    AmazonDataComponent],
  providers: [AmazonApiService, SettingService],
  bootstrap: []
})
export class SettingModule {

}
