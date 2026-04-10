import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../_services/auth/auth.service";

@Component({
  selector: 'app-sidebar',
  template: `
    <aside class="main-sidebar sidebar-dark-primary elevation-4">
      <a class="brand-link">
        <span class="brand-text font-weight-light">CMS Sample</span>
      </a>
      <div class="sidebar">
        <nav class="mt-2">
          <ul class="nav nav-pills nav-sidebar flex-column" role="menu">
            <li class="nav-item" *ngFor="let item of menuList">
              <a *ngIf="item.right" [routerLink]="['/api/auth/' + item.link]" class="nav-link">
                <i [class]="item.icon + ' nav-icon'"></i>
                <p>{{item.title}}</p>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  `,
  styles: []
})
export class SidebarComponent implements OnInit {
  @Input() theme: any;
  menuList: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.menuList = this.authService.getMenu();
  }
}
