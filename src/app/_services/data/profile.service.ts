import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvironmentsService} from '../environments.service';
import {ActivityLogService} from './activity-log.service';

@Injectable()
export class ProfileService {
  baseUrl: any;
  serviceName = '/profile-api';

  constructor(private http: HttpClient, private envService: EnvironmentsService, private logService: ActivityLogService) {
    this.baseUrl = envService.apiUrl + this.serviceName;
  }

  getProfile() {
    return this.http.post<any>(this.baseUrl + '/get-profile', {});
  }

  updateProfile(content) {
    return this.http.post<any>(this.baseUrl + '/update-profile', content);
  }

  getDataMap() {
    this.logService.addActivityLog({nameMenu: 'dashboard', action: 'show', nameModule: 'dashboard'}).subscribe();
    return this.http.post<any>(this.baseUrl + '/get-data-map', {});
  }

  getEmpInfoDashboard(content) {
    return this.http.post<any>(this.baseUrl + '/get-emp-info-dashboard', content);
  }

  getEmployeeList(content) {
    return this.http.post<any>(this.baseUrl + '/get-employee-list', content);
  }

  getEmployeeDetail(content) {
    return this.http.post<any>(this.baseUrl + '/get-employee-detail', content);
  }

  updateEmployee(content) {
    return this.http.post<any>(this.baseUrl + '/update-employee', content);
  }

  getAttendance(content) {
    return this.http.post<any>(this.baseUrl + '/get-attendance', content);
  }
}
