import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "./auth.service";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const arrayUrl = window.location.href.split('?code=');

    if (!this.authService.getAccessToken() && !arrayUrl[1]) {
      this.authService.deleteLocalStorage();
      if (state.url.includes('/login')) {
        return true;
      } else {
        this.router.navigate(['/guest/login']);
        return false;
      }
    } else if (!this.authService.getAccessToken() && arrayUrl[1]) {
      this.authService.deleteLocalStorage();
      const content = {
        code: arrayUrl[1].split('&session_state')[0]
      };
      this.authService.getToken(content).subscribe((res) => {
        if (res && res.statusCode === 1) {
          localStorage.setItem('userToken', res.data.userToken);
          const tokenContent = {
            userToken: this.authService.getUserToken(),
            grantType: "account_credentials_grant",
            refreshToken: "",
            lang: "vi"
          };
          this.authService.getARToken(tokenContent, res.data.timeToken).subscribe((res2) => {
            if (res2 && res2.statusCode === 1) {
              localStorage.setItem('accessToken', res2.data.accessToken);
              localStorage.setItem('refreshToken', res2.data.refreshToken);
              this.authService.getInfoUser().subscribe((res3) => {
                if (res3 && res3.statusCode === 1) {
                  sessionStorage.setItem('userInfo', JSON.stringify(res3.data));
                  this.authService.emitChange('user_info');
                }
              });
            }
          });
        }
      });
      return true;
    } else if (this.authService.getAccessToken()) {
      if (state.url.includes('/login')) {
        this.router.navigate(['/api/auth/dashboard']);
      } else {
        this.authService.getInfoUser().subscribe((res) => {
          if (res && res.statusCode === 1) {
            sessionStorage.setItem('userInfo', JSON.stringify(res.data));
            this.authService.emitChange('user_info');
          }
        });
      }
      return true;
    }
    return false;
  }
}
