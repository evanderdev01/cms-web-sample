import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PermissionRuleComponent} from "./permission-rule/permission-rule.component";
import {PermissionHistoryComponent} from "./permission-history/permission-history.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {path: 'rule', component: PermissionRuleComponent},
      {path: 'history', component: PermissionHistoryComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionManageRoutingModule {
}
