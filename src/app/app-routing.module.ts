import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './Shared/_guards/auth.guard';
import { DashBoardComponent } from './Dashboard/dashboard.component';
import { InventoryComponent } from './Inventory/inventory.component';
// import { InventoryReportComponent } from './Analytics/InventoryReport/inventory-report.component';
import { RegisterComponent } from './RegisterUser/register.component';
import { PasswordComponent } from './Settings/PasswordManagement/password.component';
import { UserComponent } from './UserList/user.component';
import { LogCommentComponent } from './LogComment/log.comment.component';
import { MismatchComponent } from './Maintenance/mismatch.component';
import { InventorySettingComponent } from './Settings/InventorySettings/inventory-setting.component';
import { DSTBCIComponent } from './Dstbci/dstbci.component';
import { SchedulerComponent } from './Settings/ReportScheduling/ReportScheduling.component';
// import { ProfitReportComponent } from './Analytics/ProfitReport/profit-report.component';
// import { AdreportComponent } from './Analytics/adreport/adreport.component';
import { AmazonsetupComponent } from './amazonsetup/amazonsetup.component';
import { MarketplaceComponent } from './Settings/Marketplaces/marketplaces.component';
// import { ProfitlossEstimateComponent } from './Analytics/profit&LossEstimate/profitlossestimate.component';
import { PageNotFoundComponent} from './404/PageNotFound.Component';
import { AccountSettingComponent } from './Settings/AccountSetting/account-setting.component';
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AppComponent,
                children: [
                    { path: 'dashboard', component: DashBoardComponent, canActivate: [AuthGuard] },
                    {
                      path: 'analytics',
                      loadChildren: './Analytics/report.module#ReportModule',
                      data: { preload: true },
                      canActivate: [AuthGuard]
                    },
                    { path: 'adduser', component: RegisterComponent, canActivate: [AuthGuard] },
                    { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
                    { path: 'inventory', component: InventoryComponent, canActivate: [AuthGuard] },
                    { path: 'log', component: LogCommentComponent, canActivate: [AuthGuard] },
                    { path: 'maintenance', component: MismatchComponent, canActivate: [AuthGuard] },
                    {
                      path: 'settings',
                      loadChildren: './Settings/setting.module#SettingModule',
                      data: { preload: false },
                      canActivate: [AuthGuard]
                    },
                    { path: 'dstbci', component: DSTBCIComponent, canActivate: [AuthGuard] },
                    { path: 'amazonsetup', component: AmazonsetupComponent },
                    { path: '**', component: PageNotFoundComponent }
                  ],
            }
        ]),
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
