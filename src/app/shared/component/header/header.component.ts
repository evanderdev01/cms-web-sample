import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../_services/auth/auth.service";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {GeneralService} from "../../../_services/data/general.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() theme: any;
  userName = 'Guest';
  userMail: any;
  userAva = 'assets/images/male_default.jpg';
  notiList: any = [];
  toast: any;
  textList: any = [
    'Welcome to CMS Web Sample!',
    'This is a demo application.',
    'Built with Angular 13 + AdminLTE.',
  ];

  constructor(private authService: AuthService, private router: Router, private gen: GeneralService) {
    if (localStorage.getItem('isOpenSidebar') === 'close') {
      const a: any = document.getElementById('body-container');
      if (a) a.classList.add('sidebar-collapse');
    }
  }

  ngOnInit(): void {
    this.createToast();
    this.textList = this.shuffle(this.textList);
    if (this.authService.getUsername() && this.authService.getEmailUser()) {
      this.userName = this.authService.getUsername();
      this.userMail = this.authService.getEmailUser();
    }
    this.authService.changeEmitted$.subscribe((res) => {
      if (res === 'user_info') {
        this.userName = this.authService.getUsername();
        this.userMail = this.authService.getEmailUser();
        this.userAva = this.authService.getUserAva();
      }
    });
    this.authService.changeEmittedChat$.subscribe(async (res) => {
      if (res && res.str === 'new_notify'
        && this.notiList.findIndex((i: any) => i.id.toString() === res.obj.ticketId.toString()) <= -1) {
        this.notiList.push({id: res.obj.ticketId, name: 'New Ticket', time: res.obj.timeAssigned, link: '/api/auth/it-support/info'});
      }
      if (res && res.str === 'read_notify') {
        this.notiList = this.notiList.filter(i => i.id.toString() !== res.obj.id.toString());
      }
    });
  }

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
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

  toggleMenu() {
    const a: any = document.getElementById('body-container');
    if (a && !a.classList.contains('sidebar-collapse')) {
      localStorage.removeItem('isOpenSidebar');
      localStorage.setItem('isOpenSidebar', 'close');
    } else {
      localStorage.removeItem('isOpenSidebar');
    }
  }

  createToast() {
    let timerInterval: any;
    this.toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 15000,
      timerProgressBar: true,
      html: 'Notification closes in <b></b> seconds.',
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
        const b: any = Swal.getHtmlContainer()?.querySelector('b');
        if (b) b.textContent = '15';
        timerInterval = setInterval(() => {
          if (b) b.textContent = Math.round(Swal.getTimerLeft() / 1000).toString();
        }, 1000);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    });
  }

  navigateRouter(obj) {
    sessionStorage.setItem('id_current', obj.id);
    this.router.navigate([obj.link]);
  }
}
