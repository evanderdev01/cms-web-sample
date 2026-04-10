import {Injectable} from '@angular/core';
import * as CryptoJS from 'crypto-js';
import {EnvironmentsService} from '../environments.service';

@Injectable()
export class CrypterService {
  key: any;
  iv: any;

  constructor(private envService: EnvironmentsService) {
    this.key = CryptoJS.enc.Utf8.parse(this.envService.cryptKey);
    this.iv = CryptoJS.enc.Utf8.parse(this.envService.cryptIv);
  }

  encrypt(value: string): string {
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value), this.key, {
      keySize: 128 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

  decrypt(value: string): string {
    const decrypted = CryptoJS.AES.decrypt(value, this.key, {
      keySize: 128 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
