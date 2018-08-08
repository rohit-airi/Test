import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdvertisementSettingComponent } from './AdvertisementSetting/advertisement-setting';
import { AccountSettingComponent } from './AccountSetting/account-setting.component';
import { InventorySettingComponent } from './InventorySettings/inventory-setting.component';
import { PasswordComponent } from './PasswordManagement/password.component';
import { SchedulerComponent } from './ReportScheduling/ReportScheduling.component';
import { MarketplaceComponent } from './Marketplaces/marketplaces.component';
import { AmazonDataComponent } from './AdvertisementSetting/amazondata';
@NgModule({
    imports: [
        RouterModule.forChild([
            {path: 'advertisement', component: AdvertisementSettingComponent},
            {path: 'accountsetting', component: AccountSettingComponent},
            {path:'inventorysettings',component:InventorySettingComponent},
            { path: 'changepassword', component: PasswordComponent},
            { path: 'scheduling', component: SchedulerComponent},
            { path: 'marketplaces', component: MarketplaceComponent},
            {path:'amazondata', component: AmazonDataComponent}
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class SettingRoutingModule {
 }
