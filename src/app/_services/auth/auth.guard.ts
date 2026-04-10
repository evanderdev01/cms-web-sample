import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Check for Azure AD callback code
    if (route.queryParams['code']) {
      this.authService.getToken({code: route.queryParams['code']}).subscribe((res) => {
        if (res && res.statusCode === 1) {
          localStorage.setItem('accessToken', res.data.accessToken);
          localStorage.setItem('refreshToken', res.data.refreshToken);
          localStorage.setItem('userToken', res.data.userToken);
          this.router.navigate(['/api/auth/dashboard']);
        } else {
          this.router.navigate(['/guest/login']);
        }
      }, () => {
        this.router.navigate(['/guest/login']);
      });
      return false;
    }

    // If on login page and already have token, redirect to dashboard
    if (state.url.includes('guest/login')) {
      if (this.authService.getAccessToken()) {
        this.router.navigate(['/api/auth/dashboard']);
        return false;
      }
      return true;
    }

    // For protected routes, check for token
    if (this.authService.getAccessToken()) {
      return true;
    }

    this.router.navigate(['/guest/login']);
    return false;
  }
}
