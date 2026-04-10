import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvironmentsService} from '../environments.service';
import {ActivityLogService} from './activity-log.service';

@Injectable()
export class ChatService {
  baseUrl: any;
  serviceName = '/chat-api';

  constructor(private http: HttpClient, private envService: EnvironmentsService, private logService: ActivityLogService) {
    this.baseUrl = envService.apiUrl + this.serviceName;
  }

  getChatConfig() {
    this.logService.addActivityLog({nameMenu: 'chat', action: 'show', nameModule: 'chat'}).subscribe();
    return this.http.post<any>(this.baseUrl + '/get-chat-config', {});
  }

  getChatHistory(content) {
    return this.http.post<any>(this.baseUrl + '/get-chat-history', content);
  }

  sendChat(content) {
    return this.http.post<any>(this.baseUrl + '/send-chat', content);
  }

  getActiveTickets() {
    return this.http.post<any>(this.baseUrl + '/get-active-tickets', {});
  }

  updateTicketStatus(content) {
    return this.http.post<any>(this.baseUrl + '/update-ticket-status', content);
  }
}
