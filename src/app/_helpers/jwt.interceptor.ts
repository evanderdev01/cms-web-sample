import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import {BehaviorSubject, empty, filter, Observable, of, take, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {catchError, switchMap} from 'rxjs/operators';
import {AuthService} from '../_services/auth/auth.service';
import {NgxSpinnerService} from "ngx-spinner";
import Swal from "sweetalert2";

@Injectable()
export class JwtInterceptors implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = request;
    const token = this.authService.getAccessToken();
    if (token) {
      authReq = this.addTokenHeader(request, token);
    }
    return next.handle(authReq).pipe(
      switchMap((res: any) => {
        if (res instanceof HttpResponse && res.body.statusCode === 7) {
          return this.handleRefreshToken(authReq, next, res.body);
        } else if (res instanceof HttpResponse && res.body.statusCode === 3) {
          this.authService.deleteLocalStorage();
          this.router.navigate(['/guest/login']);
          return empty();
        }
        return of(res);
      }),
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          Swal.fire('Error', 'Please try again later!', 'error');
          this.spinner.hide();
          console.error(error);
        }
        return throwError(error);
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    if (request.url.includes('/auth-api/user-token')) {
      return request;
    } else {
      return request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + token)
      });
    }
  }

  private handleRefreshToken(request: HttpRequest<any>, next: HttpHandler, res) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const content = {
        userToken: this.authService.getUserToken() || '',
        grantType: "refresh_token",
        refreshToken: this.authService.getRefreshToken() || '',
        lang: "vi"
      };
      return this.authService.getARToken(content, res.data.extoken).pipe(
        switchMap((res2: any) => {
          if (res2 && res2.statusCode === 3) {
            this.authService.deleteLocalStorage();
            this.router.navigate(['/guest/login']);
            return empty();
          } else {
            this.isRefreshing = false;
            localStorage.removeItem('accessToken');
            localStorage.setItem('accessToken', res2.data.accessToken);
            this.refreshTokenSubject.next(res2.data.accessToken);
            return next.handle(this.addTokenHeader(request, res2.data.accessToken));
          }
        }),
        catchError((err) => {
          this.isRefreshing = false;
          return throwError(err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap((token) => {
          return next.handle(this.addTokenHeader(request, token));
        })
      );
    }
  }
}
