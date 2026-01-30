import * as CryptoJS from 'crypto-js';

const SECRET_KEY = 'SHOP_X123'; 

export function encrypt(data: string): string {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
}

export function decrypt(data: string): string {
  return CryptoJS.AES.decrypt(data, SECRET_KEY).toString(CryptoJS.enc.Utf8);
}
