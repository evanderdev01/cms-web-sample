import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PermissionManageRoutingModule} from './permission-manage-routing.module';
import {PermissionRuleComponent} from './permission-rule/permission-rule.component';
import {PermissionHistoryComponent} from './permission-history/permission-history.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NgxPaginationModule} from "ngx-pagination";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../../shared/shared.module";
import {
  PermissionHistoryDetailComponent
} from './permission-history/permission-history-detail/permission-history-detail.component';
import {PermissionDetailComponent} from './permission-rule/permission-detail/permission-detail.component';


@NgModule({
  declarations: [
    PermissionRuleComponent,
    PermissionHistoryComponent,
    PermissionHistoryDetailComponent,
    PermissionDetailComponent
  ],
  imports: [
    CommonModule,
    PermissionManageRoutingModule,
    MatDatepickerModule,
    MatTooltipModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class PermissionManageModule {
}
