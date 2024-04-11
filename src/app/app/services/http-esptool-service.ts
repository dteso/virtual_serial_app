import { Injectable } from '@angular/core';
import { ApiService } from './api/api.service';

@Injectable({
  providedIn: 'root'
})
export class HttpEsptoolService {

  constructor
    (private readonly apiService: ApiService) { }

  uploadFirmware(port: string, board: string) {
    return this.apiService.get(`esptool/upload-firmware/${port}/${board}`);
  }
}
