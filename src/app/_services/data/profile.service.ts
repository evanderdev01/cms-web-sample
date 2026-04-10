import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../auth/auth.service";
import {LoguserresultService} from "./loguserresult.service";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  baseUrl: any;
  serviceName = '/profile-api';

  constructor(private http: HttpClient, private authService: AuthService, private logService: LoguserresultService) {
    this.baseUrl = authService.getDomain() + this.serviceName;
  }

  getEmailListFollowChildDepart(childDepart: any) {
    const content = {
      childDepart: childDepart
    };
    return this.http.post<any>(this.baseUrl + '/email-in-block', content);
  }

  getContractEmp() {
    return this.http.get<any>(this.baseUrl + '/get-contracts-type');
  }

  getEmpInfo(content, page, perPage) {
    const content2 = {
      webRoute: window && window.location && window.location.pathname,
      apiRoute: this.serviceName + '/emp-info',
      input: content
    };
    this.logService.postLogUser(content2).subscribe();
    return this.http.post<any>(this.baseUrl + '/emp-info?page=' + page + '&perPage=' + perPage, content);
  }

  editEmp(content) {
    const content2 = {
      webRoute: window && window.location && window.location.pathname,
      apiRoute: this.serviceName + '/edit-employee',
      input: content
    };
    this.logService.postLogUser(content2).subscribe();
    return this.http.post<any>(this.baseUrl + '/edit-employee', content);
  }

  importEmpInfo(content) {
    const content2 = {
      webRoute: window && window.location && window.location.pathname,
      apiRoute: this.serviceName + '/import-employee',
      input: content
    };
    this.logService.postLogUser(content2).subscribe();
    return this.http.post<any>(this.baseUrl + '/import-employee', content);
  }

  getEmpRank(content, page, perPage) {
    const content2 = {
      webRoute: window && window.location && window.location.pathname,
      apiRoute: this.serviceName + '/emp-rank',
      input: content
    };
    this.logService.postLogUser(content2).subscribe();
    return this.http.post<any>(this.baseUrl + '/emp-rank?page=' + page + '&page_size=' + perPage, content);
  }

  getDataMap() {
    return this.http.post<any>(this.baseUrl + '/get-map-coordinate', {});
  }
}
