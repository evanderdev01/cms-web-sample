import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EnvironmentsService} from '../environments.service';
import {menuList} from "../../_models/constants/menuTemplate";
import {Subject} from "rxjs";

@Injectable()
export class AuthService {
  baseUrl: any;
  serviceName = '/auth-api';
  menuList = menuList;
  private changEmitted = new Subject<any>();
  changeEmitted$ = this.changEmitted.asObservable();

  private changeEmittedTheme = new Subject<any>();
  changeEmittedTheme$ = this.changeEmittedTheme.asObservable();

  private changeEmittedChat = new Subject<any>();
  changeEmittedChat$ = this.changeEmittedChat.asObservable();

  constructor(private http: HttpClient, private envService: EnvironmentsService) {
    this.baseUrl = envService.apiUrl + this.serviceName;
  }

  emitChange(str): any {
    this.changEmitted.next(str);
  }

  emitChangeTheme(str): any {
    this.changeEmittedTheme.next(str);
  }

  emitChangeChat(str, obj?): any {
    this.changeEmittedChat.next({str: str, obj: obj});
  }

  loginWithBE() {
    window.location.href = this.baseUrl + '/azure-login';
  }

  getToken(content: any) {
    return this.http.post<any>(this.baseUrl + '/gen-user-token-by-azure-code', content);
  }

  getARToken(content, timeToken) {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': timeToken
      })
    };
    return this.http.post<any>(this.baseUrl + '/user-token', content, headers);
  }

  getAllPermissions() {
    return this.http.post<any>(this.baseUrl + '/get-all-permissions', {});
  }

  getInfoUser() {
    return this.http.post<any>(this.envService.apiUrl + '/profile-api/profile-and-user-permissions', {});
  }

  logout() {
    return this.http.post<any>(this.baseUrl + '/logout', {});
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  getUserToken() {
    return localStorage.getItem('userToken');
  }

  getEmailUser() {
    if (sessionStorage.getItem('userInfo')) {
      return JSON.parse(sessionStorage.getItem('userInfo') as string)['email'];
    } else {
      return null;
    }
  }

  getUsername() {
    if (sessionStorage.getItem('userInfo')) {
      return JSON.parse(sessionStorage.getItem('userInfo') as string)['fullName'];
    } else {
      return null;
    }
  }

  getUserAva() {
    if (sessionStorage.getItem('userInfo')) {
      return JSON.parse(sessionStorage.getItem('userInfo') as string)['empAvatarImageUrl'];
    } else {
      return null;
    }
  }

  getRole() {
    if (sessionStorage.getItem('userInfo')) {
      return JSON.parse(sessionStorage.getItem('userInfo') as string)['featuresRoles'];
    } else {
      return null;
    }
  }

  getPermission() {
    if (sessionStorage.getItem('userInfo')) {
      return JSON.parse(sessionStorage.getItem('userInfo') as string)['permissions'];
    } else {
      return null;
    }
  }

  getAllChildDeparts() {
    if (sessionStorage.getItem('userInfo')) {
      return JSON.parse(sessionStorage.getItem('userInfo') as string)['allChildDeparts'];
    } else {
      return null;
    }
  }

  getDomain() {
    return this.envService.apiUrl;
  }

  getDownloadUrl() {
    return this.envService.downloadUrl;
  }

  getPowerBIUrl() {
    return this.envService.powerBIUrl;
  }

  deleteLocalStorage() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userMail');
    localStorage.removeItem('permission');
  }

  getMenu() {
    let permission = Object.keys(this.getPermission());
    const menu: any = this.menuList;
    this.updatePermissionMenu(menu, permission);
    return menu;
  }

  updatePermissionMenu(menu, permission) {
    let hasChildWithTrueRight = false;
    for (const m of menu) {
      if (m.list && m.list.length > 0) {
        if (this.updatePermissionMenu(m.list, permission)) {
          m.right = true;
          hasChildWithTrueRight = true;
        }
      } else {
        if (permission.includes('ALL')) {
          m.rightEdit = true;
          m.rightShow = true;
          m.rightImport = true;
          m.right = true;
          hasChildWithTrueRight = true;
        } else {
          if (permission.some(p => m.codeEdit.includes(p))) {
            m.rightEdit = true;
          }
          if (permission.some(p => m.codeShow.includes(p))) {
            m.rightShow = true;
          }
          if (permission.some(p => m.codeImport.includes(p))) {
            m.rightImport = true;
          }
          if (m.rightEdit || m.rightShow || m.rightImport) {
            m.right = true;
            hasChildWithTrueRight = true;
          }
        }
      }
    }
    return hasChildWithTrueRight;
  }
}
