import { Injectable } from '@angular/core';
import {EnvironmentsService} from "../environments.service";
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CrypterService {
  private key: any;
  private iv: any;

  constructor(private envService: EnvironmentsService) {
    this.key = CryptoJS.enc.Utf8.parse(envService.encryptKey);
    this.iv = CryptoJS.enc.Utf8.parse(envService.encryptIV);
  }

  encrypt(value) {
    const ciphertext = CryptoJS.AES.encrypt(value, this.key, {
      keySize: 16,
      iv: this.iv,
      mode: CryptoJS.mode.CBC
    });
    return ciphertext.toString();
  }

  decrypt(value) {
    const decryptedData = CryptoJS.AES.decrypt(value, this.key, {
      keySize: 16,
      iv: this.iv,
      mode: CryptoJS.mode.CBC
    });
    return decryptedData.toString(CryptoJS.enc.Utf8);
  }
}
