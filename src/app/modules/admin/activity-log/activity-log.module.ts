import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivityLogRoutingModule} from './activity-log-routing.module';
import {ActivityLogComponent} from './activity-log.component';
import {SharedModule} from "../../../shared/shared.module";
import {DetailChartComponent} from './detail-chart/detail-chart.component';

@NgModule({
  declarations: [
    ActivityLogComponent,
    DetailChartComponent,
  ],
  imports: [
    CommonModule,
    ActivityLogRoutingModule,
    SharedModule,
  ]
})
export class ActivityLogModule {
}
