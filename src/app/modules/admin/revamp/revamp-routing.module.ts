import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RevampComponent} from "./revamp.component";

const routes: Routes = [
  {path: '', component: RevampComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RevampRoutingModule {
}
