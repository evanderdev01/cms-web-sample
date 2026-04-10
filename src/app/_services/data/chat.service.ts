import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {LoguserresultService} from "./loguserresult.service";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  baseUrl: any;
  serviceName = '/chat-api';

  constructor(private http: HttpClient, private authService: AuthService, private logService: LoguserresultService) {
    this.baseUrl = this.authService.getDomain() + this.serviceName;
  }

  getKanbanList() {
    return this.http.get<any>(this.baseUrl + '/ticket/get-list-ticket-support');
  }

  getInfoTicket(content) {
    const content2 = {
      webRoute: window && window.location && window.location.pathname,
      apiRoute: this.serviceName + '/ticket/get-ticket-info-by-id',
      input: content
    };
    this.logService.postLogUser(content2).subscribe();
    return this.http.post<any>(this.baseUrl + '/ticket/get-ticket-info-by-id', content);
  }

  sendMessage(content: any) {
    const content2 = {
      webRoute: window && window.location && window.location.pathname,
      apiRoute: this.serviceName + '/ticket/send-message',
      input: content
    };
    this.logService.postLogUser(content2).subscribe();
    const header: any = {
      reportProgress: true, observe: "events",
    };
    return this.http.post<any>(this.baseUrl + '/ticket/send-message', content, header);
  }

  updateStatusTicket(content: any) {
    const content2 = {
      webRoute: window && window.location && window.location.pathname,
      apiRoute: this.serviceName + '/ticket/update-ticket-status',
      input: content
    };
    this.logService.postLogUser(content2).subscribe();
    return this.http.post<any>(this.baseUrl + '/ticket/update-ticket-status', content);
  }

  getReport(content) {
    const content2 = {
      webRoute: window && window.location && window.location.pathname,
      apiRoute: this.serviceName + '/report-detail',
      input: content
    };
    this.logService.postLogUser(content2).subscribe();
    return this.http.post<any>(this.baseUrl + '/report-detail', content);
  }

  getSearchResults(content) {
    const content2 = {
      webRoute: window && window.location && window.location.pathname,
      apiRoute: this.serviceName + '/ticket/get-search-results',
      input: content
    };
    this.logService.postLogUser(content2).subscribe();
    return this.http.post<any>(this.baseUrl + '/ticket/get-search-results', content);
  }
}
