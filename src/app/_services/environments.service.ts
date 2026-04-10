import {Injectable} from '@angular/core';

@Injectable()
export class EnvironmentsService {
  apiUrl: any;
  downloadUrl: any;
  powerBIUrl: any;
  cryptKey: any;
  cryptIv: any;

  constructor() {
  }

  init(): Promise<any> {
    return new Promise((resolve) => {
      this.setEnvVariables();
      resolve(true);
    });
  }

  private setEnvVariables(): void {
    const hostname = window && window.location && window.location.hostname;

    if (/^localhost/.test(hostname)) {
      // Local development
      this.apiUrl = 'http://localhost:8080';
      this.downloadUrl = 'http://localhost:8080/download';
      this.powerBIUrl = 'https://app.powerbi.com';
    } else if (/^dev\./.test(hostname)) {
      // Development environment
      this.apiUrl = 'https://dev-api.example.com';
      this.downloadUrl = 'https://dev-api.example.com/download';
      this.powerBIUrl = 'https://app.powerbi.com';
    } else if (/^staging\./.test(hostname)) {
      // Staging environment
      this.apiUrl = 'https://staging-api.example.com';
      this.downloadUrl = 'https://staging-api.example.com/download';
      this.powerBIUrl = 'https://app.powerbi.com';
    } else {
      // Production
      this.apiUrl = 'https://api.example.com';
      this.downloadUrl = 'https://api.example.com/download';
      this.powerBIUrl = 'https://app.powerbi.com';
    }

    // Encryption keys - replace with your own in production
    this.cryptKey = 'YOUR_CRYPT_KEY_HERE';
    this.cryptIv = 'YOUR_CRYPT_IV_HERE';
  }
}
