import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminComponent} from './admin.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {LayoutAdminRoutingModule} from './admin-routing.module';
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    LayoutAdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule {
}
