import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {HealthComponent} from "./modules/health/health.component";
import {AuthGuard} from "./_services/auth/auth.guard";

const routes: Routes = [
  {path: 'api/auth', redirectTo: 'api/auth/dashboard'},
  {path: '', redirectTo: 'api/auth/dashboard', pathMatch: 'full'},
  {path: 'health', component: HealthComponent},
  {
    path: 'api/auth',
    loadChildren: () => import(`./modules/admin/admin.module`).then(m => m.AdminModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'guest',
    loadChildren: () => import(`./modules/guest/guest.module`).then(m => m.GuestModule)
  },
  {path: '**', redirectTo: 'api/auth/dashboard'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false,
    useHash: false,
    anchorScrolling: 'enabled',
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
