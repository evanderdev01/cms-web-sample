import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LuckyNumberComponent} from "./lucky-number/lucky-number.component";
import {LuckyNumberDetailComponent} from "./lucky-number/lucky-number-detail/lucky-number-detail.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {path: 'luckynumber', component: LuckyNumberComponent},
      {path: 'luckynumber/detail/:id', component: LuckyNumberDetailComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule {
}
