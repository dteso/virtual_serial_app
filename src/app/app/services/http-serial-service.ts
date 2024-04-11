import { Injectable } from '@angular/core';
import { ApiService } from './api/api.service';

@Injectable({
  providedIn: 'root'
})
export class HttpSerialService {

  constructor
    (private readonly apiService: ApiService) { }

  getAvailablePorts() {
    return this.apiService.get("serial/get-available-ports");
  }

  connect(port: any, baudrate: any) {
    return this.apiService.get(`serial/connect/${port}/${baudrate}`);
  }

  disconnect() {
    return this.apiService.get(`serial/disconnect`);
  }

  write(data: string) {
    return this.apiService.post(`serial/write`, { data: data });
  }
}

