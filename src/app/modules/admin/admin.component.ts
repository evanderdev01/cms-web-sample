import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../_services/auth/auth.service";
import {themeList, animationList} from "../../_models/constants/themeConfig";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  mouseStop = false;
  theme: any;
  themeList = themeList;
  animation: any;
  animationList = animationList;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('theme')) {
      this.theme = this.themeList.filter(item => item.value === localStorage.getItem('theme'))[0];
    }
    if (localStorage.getItem('animation')) {
      this.animation = this.animationList.filter(item => item.value === localStorage.getItem('animation'))[0];
    }
    this.authService.changeEmittedTheme$.subscribe((res) => {
      if (res === 'theme') {
        this.theme = this.themeList.filter(item => item.value === localStorage.getItem('theme'))[0];
      }
      if (res === 'animation') {
        this.animation = this.animationList.filter(item => item.value === localStorage.getItem('animation'))[0];
      }
    });

    let timeout: any;
    onmousemove = (event) => {
      clearTimeout(timeout);
      this.mouseStop = false;
      timeout = setTimeout(() => {
        this.mouseStop = true;
      }, 6000);
    };
  }

  onActivate(event: any) {
    window.scroll({top: 0, left: 0, behavior: 'smooth'});
  }
}
