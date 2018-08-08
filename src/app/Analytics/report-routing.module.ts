import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { InventoryReportComponent } from './InventoryReport/inventory-report.component';
import { ProfitReportComponent } from './ProfitReport/profit-report.component';
import { ProfitlossEstimateComponent } from './profit&LossEstimate/profitlossestimate.component';
import { AdreportComponent } from './adreport/adreport.component';
@NgModule({
  imports: [
      RouterModule.forChild([
      { path: 'inventoryreport', component: InventoryReportComponent},
      { path: 'profitreport', component: ProfitReportComponent},
      { path: 'plestimate', component: ProfitlossEstimateComponent },
      { path: 'ads-report', component: AdreportComponent}
        ])
        ],
        exports: [RouterModule]
      })
      export class ReportRoutingModule { }
