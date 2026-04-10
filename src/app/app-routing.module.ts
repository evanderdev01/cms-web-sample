import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "./_services/auth/auth.guard";

const routes: Routes = [
  {path: '', redirectTo: 'api/auth/dashboard', pathMatch: 'full'},
  {
    path: 'api/auth',
    loadChildren: () => import('./modules/admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'guest',
    loadChildren: () => import('./modules/guest/guest.module').then((m) => m.GuestModule)
  },
  {path: 'health', loadChildren: () => import('./modules/health/health.module').then((m) => m.HealthModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
