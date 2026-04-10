import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../../_services/auth/auth.service";
import {NavigationEnd, Router} from "@angular/router";
import {menuList} from "../../../_models/constants/menuTemplate";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  userName = 'Guest';
  userEmail: any;
  userAva: any;
  subscribe: any;
  url: any;
  menuList: any;
  @Input() theme: any;

  constructor(private authService: AuthService, private spinner: NgxSpinnerService, private router: Router) {
    this.menuList = menuList;
    this.subscribe = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url) {
          this.url = event.url;
        }
      }
    });
  }

  ngOnInit() {
    this.checkLogin();
    this.userAva = 'assets/images/male_default.jpg';
  }

  ngOnDestroy(): void {
    this.subscribe.unsubscribe();
  }

  checkLogin() {
    this.authService.changeEmitted$.subscribe((res) => {
      if (res === 'user_info') {
        this.menuList = this.authService.getMenu();
        this.userName = this.authService.getUsername();
        this.userEmail = this.authService.getEmailUser();
      }
    });
  }

  logout() {
    this.authService.logout().subscribe((res) => {
      this.authService.deleteLocalStorage();
      if (res && res.statusCode === 1) {
        window.location.href = res.data.azureLogoutUrl;
      } else {
        this.router.navigate(['/guest/login']);
      }
    }, error => {
      this.authService.deleteLocalStorage();
      this.router.navigate(['/guest/login']);
    });
  }
}
