import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpSerialService } from '../../services/http-serial-service';
import { CommonModule } from '@angular/common';
import { Observable, Subject, catchError, finalize, of, tap } from 'rxjs';
import { SocketProviderConnect } from '../../services/web-socket.service';
import { FormsModule } from '@angular/forms';
import { HttpEsptoolService } from '../../services/http-esptool-service';

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [SocketProviderConnect],
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.scss'
})
export class TerminalComponent implements OnInit {


  ports = new Observable<any>;
  baudrate: any;
  port: any;
  _ports: any;
  connected = false;
  fullStream!: Observable<any[]>;
  socketsConnected = false;
  message = "";
  selectedForm = "login"; // wifi-connect-form,  login
  refreshingPorts = true;
  installingFirmware = false;
  firmwareInstalled = false;


  constructor(
    private router: Router,
    private httpSerialService: HttpSerialService,
    protected socketService: SocketProviderConnect,
    private httpEsptoolService: HttpEsptoolService
  ) { }

  back() {
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.disconnect();
    this.getPorts();
  }

  getReversedConversation(conversation: any[]) {
    const reversedArray: any[] = [];
    for (let i = 0; i < conversation.length; i++) {
      const message = conversation[(conversation.length - 1) - i];
      if (message.data.length) {
        reversedArray.push({ date: message.time, event: message.event, data: message.data });
      }
    }
    return reversedArray;
  }

  refresh() {
    this.getPorts();
  }

  connect(portPath: any) {
    this.httpSerialService.connect(portPath, this.baudrate).subscribe(res => {
      if (res.status === 'ok') {
        this.connected = true;
        if (!this.socketsConnected) {
          this.socketService.onConnect();
          this.fullStream = of(this.socketService.getLocalConversation());
          this.socketService.socketConversation.subscribe(conversation => {
            const reversedConversation = this.getReversedConversation(conversation);
            this.fullStream = of(reversedConversation);
            console.log(conversation);
          });
        }
      }
      this._ports.forEach((_port: any) => {
        if (_port.path === portPath) {
          _port.connected = true;
        }
      });
      this.ports = of(this._ports);
    });
  }

  setPortAsSelected(port: any) {
    this.port = port;
    this.connect(this.port.path);
  }

  setBaudRateAsSelected(baudrate: any) {
    this.baudrate = baudrate;
  }

  disconnect() {
    this.httpSerialService.disconnect().pipe(
      tap((res) => {
        if (res.status === 'ok') {
          this.connected = false;
          this.port = null;
          this._ports.forEach((_port: any) => {
            _port.connected = false;
          });
        }
        this.ports = of(this._ports);
        this.connected = false;
        this.socketsConnected = false;
        this.fullStream = of([]);
        this.socketService.setLocalConversation([]);
      }),
      catchError((error) => {
        console.log("Error disconnecting. Probably nothing connected now.");
        return of(null); // Devolver un observable nulo para continuar el flujo
      }),
      finalize(() => {
        console.log("Disconnect operation completed."); // Lógica a ejecutar al finalizar la operación
        this.port = {};
        this.socketService.unsubscribe();
      })
    ).subscribe();
  }

  send() {
    this.httpSerialService.write(this.message).subscribe(res => {
      console.log("message sent", this.message);
      this.message = "";
    });
  }

  showLogin() {
    this.firmwareInstalled = false;
    this.selectedForm = 'login';
  }

  showWifiForm() {
    this.firmwareInstalled = false;
    this.selectedForm = 'wifi-connect-form';
  }

  showFirmware() {
    this.firmwareInstalled = false;
    this.selectedForm = 'firmware';
  }

  installFirmware() {
    this.installingFirmware = true;
    const requestDevice = this.port.device.indexOf('ESP8266') > -1 ? 'ESP8266' : 'ESP32';
    this.httpEsptoolService.uploadFirmware(this.port.path, requestDevice).subscribe(res => {
      if (res && res.status === 'ok') {
        this.installingFirmware = false;
        this.firmwareInstalled = true;
      }
    });
  }

  private getPorts() {
    this.refreshingPorts = true;
    this.firmwareInstalled = false;
    this.httpSerialService.getAvailablePorts().subscribe((res) => {
      res.ports.forEach((port: any) => port.connected = false);
      this._ports = res.ports;
      this.ports = of(this._ports);
      this.refreshingPorts = false;
    });
  }

}
