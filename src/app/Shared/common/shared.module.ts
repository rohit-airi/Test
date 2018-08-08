import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingModule } from 'ngx-loading';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  DataTableModule,
  InputSwitchModule,
  GrowlModule,
  ConfirmDialogModule,
  TabViewModule,
  PanelModule,
  RadioButtonModule,
  DropdownModule
} from 'primeng/primeng';
@NgModule({
  imports: [
    CommonModule,
    LoadingModule,
    DataTableModule,
    InputSwitchModule,
    GrowlModule,
    ConfirmDialogModule,
    PanelModule,
    TabViewModule,
    RadioButtonModule,
    DropdownModule
  ],
  declarations: [],
  exports: [
    LoadingModule,
    DataTableModule,
    InputSwitchModule,
    GrowlModule,
    ConfirmDialogModule,
    PanelModule,
    TabViewModule,
    RadioButtonModule,
    DropdownModule
  ]
})
export class SharedModule {}
