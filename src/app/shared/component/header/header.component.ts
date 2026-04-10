import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../_services/auth/auth.service";

@Component({
  selector: 'app-header',
  template: `
    <nav class="main-header navbar navbar-expand navbar-white navbar-light">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" role="button"><i class="fas fa-bars"></i></a>
        </li>
      </ul>
      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <span class="nav-link">{{username}}</span>
        </li>
      </ul>
    </nav>
  `,
  styles: []
})
export class HeaderComponent implements OnInit {
  @Input() theme: any;
  username: string;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername() || 'User';
  }
}
