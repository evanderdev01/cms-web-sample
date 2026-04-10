import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GameRoutingModule} from './game-routing.module';
import {LuckyNumberComponent} from './lucky-number/lucky-number.component';
import {SharedModule} from "../../../shared/shared.module";
import {LuckyNumberDetailComponent} from './lucky-number/lucky-number-detail/lucky-number-detail.component';


@NgModule({
  declarations: [
    LuckyNumberComponent,
    LuckyNumberDetailComponent
  ],
  imports: [
    CommonModule,
    GameRoutingModule,
    SharedModule
  ]
})
export class GameModule {
}
