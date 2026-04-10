import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {JwtInterceptor} from './_helpers/jwt.interceptor';
import {AuthService} from './_services/auth/auth.service';
import {AuthGuard} from './_services/auth/auth.guard';
import {EnvironmentsService} from './_services/environments.service';
import {CrypterService} from './_services/auth/crypter.service';

import {GeneralService} from './_services/data/general.service';
import {ProfileService} from './_services/data/profile.service';
import {ChatService} from './_services/data/chat.service';
import {ActivityLogService} from './_services/data/activity-log.service';
import {MediaService} from './_services/data/media.service';
import {CompanyService} from './_services/data/company.service';
import {GameService} from './_services/data/game.service';
import {JobService} from './_services/data/job.service';
import {RecruitService} from './_services/data/recruit.service';
import {CheckinService} from './_services/data/checkin.service';

import {JwtModule} from '@auth0/angular-jwt';
import {NgxSpinnerModule} from 'ngx-spinner';

export function tokenGetter() {
  return localStorage.getItem('accessToken');
}

export function initializeApp(envService: EnvironmentsService) {
  return () => envService.init();
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:4200'],
      }
    }),
  ],
  providers: [
    AuthService,
    AuthGuard,
    EnvironmentsService,
    CrypterService,
    GeneralService,
    ProfileService,
    ChatService,
    ActivityLogService,
    MediaService,
    CompanyService,
    GameService,
    JobService,
    RecruitService,
    CheckinService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
