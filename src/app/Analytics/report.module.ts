import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UrlSerializer } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/*Component */
import { InventoryReportComponent } from './InventoryReport/inventory-report.component';
import { ProfitReportComponent } from './ProfitReport/profit-report.component';
import { ProfitlossEstimateComponent } from './profit&LossEstimate/profitlossestimate.component';
import { AdreportComponent } from './adreport/adreport.component';
/*End Here */

/*Services */
import { ProfitApiService } from '../Shared/_services/api/profit.api.service';
/* End Here */

/*Module */
import { ReportRoutingModule } from './report-routing.module';
import { LoadingModule } from 'ngx-loading';
import { AutoCompleteModule,RadioButtonModule,SplitButtonModule,ConfirmDialogModule } from 'primeng/primeng';
import { BsDatepickerModule   } from 'ngx-bootstrap';
/* End Here */
@NgModule({
  declarations:[
    InventoryReportComponent,
    ProfitReportComponent,
    ProfitlossEstimateComponent,
    AdreportComponent
  ],
  imports:[CommonModule,ReportRoutingModule,
    LoadingModule,
    FormsModule,
  ReactiveFormsModule,
  AutoCompleteModule,
  BsDatepickerModule,
  RadioButtonModule,
  SplitButtonModule,
  ConfirmDialogModule],
  providers:[ProfitApiService],
  bootstrap:[]
})
export class ReportModule { }
