import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../_services/auth/auth.service";

@Component({
  selector: 'app-login',
  template: `
    <div class="login-page" style="min-height: 100vh;">
      <div class="login-box">
        <div class="card card-outline card-primary">
          <div class="card-header text-center">
            <h1><b>CMS</b> Sample</h1>
          </div>
          <div class="card-body">
            <p class="login-box-msg">Sign in to start your session</p>
            <div class="social-auth-links text-center mt-2 mb-3">
              <button class="btn btn-block btn-primary" (click)="loginWithAzure()">
                <i class="fab fa-microsoft mr-2"></i> Sign in with Azure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .login-box { width: 360px; }
  `]
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  loginWithAzure() {
    this.authService.loginWithBE();
  }
}
