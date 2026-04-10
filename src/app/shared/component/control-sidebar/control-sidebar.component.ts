import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../_services/auth/auth.service";
import {themeList, animationList} from "../../../_models/constants/themeConfig";

@Component({
  selector: 'app-control-sidebar',
  templateUrl: './control-sidebar.component.html',
  styleUrls: ['./control-sidebar.component.scss']
})
export class ControlSidebarComponent implements OnInit {
  theme: any;
  themeList = themeList;
  animation: any;
  animationList = animationList;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('theme')) {
      this.theme = this.themeList.find(item => item.value === localStorage.getItem('theme'));
    }
    if (localStorage.getItem('animation')) {
      this.animation = this.animationList.find(item => item.value === localStorage.getItem('animation'));
    }
  }

  updateUI(e, str, value?) {
    localStorage.removeItem(str);
    if (e) {
      this[str] = e;
      localStorage.setItem(str, e.value);
    } else {
      this[str] = null;
    }
    this.authService.emitChangeTheme(str);
  }
}
