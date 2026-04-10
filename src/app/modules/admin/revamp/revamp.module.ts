import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RevampRoutingModule} from './revamp-routing.module';
import {RevampComponent} from './revamp.component';
import {SharedModule} from "../../../shared/shared.module";
import {DetailRevampComponent} from './detail-revamp/detail-revamp.component';

@NgModule({
  declarations: [
    RevampComponent,
    DetailRevampComponent
  ],
  imports: [
    CommonModule,
    RevampRoutingModule,
    SharedModule,
  ]
})
export class RevampModule {
}
