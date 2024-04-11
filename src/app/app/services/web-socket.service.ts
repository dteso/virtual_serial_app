
/* WEBSOCKETS */
import { Injectable } from '@angular/core';
import { environment } from '../../../environment';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { of, Subject, Subscription } from 'rxjs';


declare interface DeviceWsResponse {
  commandRequested?: string;
  completed?: boolean;
  timeout?: number;
}

declare interface SocketClient {
  clientId?: string;
  type?: string;
  room?: string;
  user?: string;
  message?: string;
  file?: any;
  event?: string;
  action?: string;
}

@Injectable()
export class SocketProviderConnect {

  appKey: any; // Variable que permite asociar aplicaciones y dispositivos en una misma sala
  subscription: Subscription = new Subscription();

  public socketMessage = new Subject<any>(); // Último mensaje recibido
  public socketConversation = new Subject<any>(); // Lista de mensajes desde la últoima conexión

  subject!: WebSocketSubject<any>; //La conexión en sí, es la que nos va a permitir leer (.subscribe) o escribir (.next())
  commandQueue: DeviceWsResponse[] = []; // Cola donde se almacenan los comandos enviados a los dispositivos y pendientes de respuesta

  private localConversation: string[] = []; // lista de mensajes alamacenada desde la última conexión

  constructor(

  ) { }

  unsubscribe() {
    this.subscription.unsubscribe();
  }

  public getSocketServerUrl() {
    return environment.server_socket;
  }

  public getLocalConversation(): string[] {
    return this.localConversation;
  }

  public setLocalConversation(value: any) {
    this.localConversation = value;
    this.socketConversation.next(this.localConversation);
  }

  public onConnect(_payload: SocketClient = {}): any { // ---> El payload recibido viene desde el appComponent en el ngOnInit()
    try {
      //Establecemos conexión
      this.subject = webSocket(environment.server_socket);
      // Leemos del servidor. Nos suscribimos. A partir de ahora vamos a recibir todos los mensajes del servidor aquí
      this.subscribeWsServer();
      // Notificamos un mensaje inicial con los datos necesarios para que el ws server nos identifique
      this.notifyConnectionToServer();
    } catch (err) {
      console.log('CONNECTION SOCKET SERVER ERROR ' + err);
    }
  }

  /* Establece un nuevo mensaje en la conexión con el servidor. El formato del mensaje viene defuinido por la interfaz SocketClient */
  send(payload: any) {
    this.subject.next(payload);
  }


  /**
   *  Lee y gestiona el guardado y la verificación de mensajes a través de handleSocketMessage()
   */
  private subscribeWsServer() {
    this.subscription = this.subject.subscribe(ws => {
      console.log('Socket Data', ws);
      this.socketMessage.next(ws);
      this.handleSocketMessage(ws);
    });
  }

  /**
   * Recupera el appKey del storage y envía un mensaje para identificar el usuario en el socket server
   */
  private notifyConnectionToServer() {
    this.send({ event: 'CONNECTION', data: { comm: 'APP', appKey: this.appKey, user: 'COM' } });
  }

  /**
   * Identifica el tipo de mensaje y lo almacena en memoria
   *
   * @param socketData
   */
  private handleSocketMessage(socketData: any) {
    this.socketMessage.next(socketData);
    this.localConversation.push(socketData);
    this.socketConversation.next(this.localConversation);
  }
}

