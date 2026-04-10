import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SharedModule} from "./shared/shared.module";
import {JwtModule} from "@auth0/angular-jwt";
import {AuthService} from "./_services/auth/auth.service";
import {GoogleLoginProvider, SocialAuthService, SocialAuthServiceConfig} from "angularx-social-login";
import {environment} from "../environments/environment";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {EnvironmentsService} from "./_services/environments.service";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HealthComponent} from './modules/health/health.component';
import {JwtInterceptors} from "./_helpers/jwt.interceptor";
import {AuthGuard} from "./_services/auth/auth.guard";

@NgModule({
  declarations: [
    AppComponent,
    HealthComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: jwtTokenGetter
      }
    }),
    BrowserAnimationsModule,
  ],
  providers: [
    AuthGuard,
    AuthService,
    SocialAuthService,
    EnvironmentsService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleClientId),
          },
        ],
      } as SocialAuthServiceConfig,
    },
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptors, multi: true},
    {
      provide: APP_INITIALIZER,
      useFactory: (envService: EnvironmentsService) => () => envService.init(),
      deps: [EnvironmentsService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}

export function jwtTokenGetter() {
  return localStorage.getItem('accessToken');
}
