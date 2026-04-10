import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class LoguserresultService {
  baseUrl: any;
  serviceName = '/logs-api';

  constructor(private http: HttpClient, private authService: AuthService) {
    this.baseUrl = authService.getDomain() + this.serviceName;
  }

  getListLogUser(content, page, pageSize) {
    return this.http.post<any>(this.baseUrl + '/get-log-user?perPage=' + pageSize + '&page=' + page, content);
  }

  searchLogUser(content, page, pageSize) {
    return this.http.post<any>(this.baseUrl + '/search-log-user?perPage=' + pageSize + '&page=' + page, content);
  }

  postLogUser(content) {
    return this.http.post<any>(this.baseUrl + '/post-log-user', content);
  }

  allFunctionData(groupFunctionCode: any, functionCode: any, item: any) {
    const content = {
      groupFunctionCode: groupFunctionCode,
      functionCode: functionCode,
      item: item
    };
    return this.http.post<any>(this.baseUrl + '/all-function-data-log', content);
  }

  getChartLogs(content) {
    return this.http.post<any>(this.baseUrl + '/sum-logs-user', content);
  }

  getDetailChartLogs(content) {
    return this.http.post<any>(this.baseUrl + '/detail-logs-user', content);
  }

  getSumOverview(content) {
    return this.http.post<any>(this.baseUrl + '/sum-overview', content);
  }
}
