import {DashboardComponent} from './dashboard/dashboard.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from './admin.component';

const routes: Routes = [
  {
    path: '', component: AdminComponent,
    children: [
      {path: 'dashboard', component: DashboardComponent},
      {path: 'library', loadChildren: () => import('./library/library.module').then((m) => m.LibraryModule)},
      {path: 'game', loadChildren: () => import('./game/game.module').then((m) => m.GameModule)},
      {
        path: 'activity-log',
        loadChildren: () => import('./activity-log/activity-log.module').then((m) => m.ActivityLogModule)
      },
      {
        path: 'permission',
        loadChildren: () => import('./permission-manage/permission-manage.module').then((m) => m.PermissionManageModule)
      },
      {path: 'revamp', loadChildren: () => import('./revamp/revamp.module').then((m) => m.RevampModule)},
      {path: 'apidoc', loadChildren: () => import('./apidoc/apidoc.module').then((m) => m.ApidocModule)},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutAdminRoutingModule {
}
