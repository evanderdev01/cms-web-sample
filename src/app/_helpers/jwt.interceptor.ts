import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, filter, switchMap, take} from 'rxjs/operators';
import {AuthService} from '../_services/auth/auth.service';
import {Router} from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService, private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.getAccessToken()) {
      request = this.addToken(request, this.authService.getAccessToken());
    }
    return next.handle(request).pipe(
      catchError(err => {
        if (err.error) {
          if (err.error.statusCode === 7) {
            // Token expired, attempt refresh
            return this.handle401Error(request, next);
          } else if (err.error.statusCode === 3) {
            // Session invalid, redirect to login
            this.authService.deleteLocalStorage();
            this.router.navigate(['/guest/login']);
          }
        }
        return throwError(err);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: any) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const content = {
        accessToken: this.authService.getAccessToken(),
        refreshToken: this.authService.getRefreshToken()
      };

      return this.authService.getARToken(content, this.authService.getUserToken()).pipe(
        switchMap((res: any) => {
          this.isRefreshing = false;
          if (res && res.statusCode === 1) {
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            this.refreshTokenSubject.next(res.data.accessToken);
            return next.handle(this.addToken(request, res.data.accessToken));
          } else {
            this.authService.deleteLocalStorage();
            this.router.navigate(['/guest/login']);
            return throwError('Token refresh failed');
          }
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.authService.deleteLocalStorage();
          this.router.navigate(['/guest/login']);
          return throwError(err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addToken(request, jwt));
        })
      );
    }
  }
}
