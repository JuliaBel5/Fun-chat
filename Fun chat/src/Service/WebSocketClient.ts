import { CustomEventEmitter, EventMap } from "../components/EventEmitter/EventEmitter";
import { Toast } from "../components/toast";

export class WebSocketClient extends CustomEventEmitter<EventMap> {
  private socket: WebSocket;
  toast: Toast = new Toast()

  constructor(private url: string) {
    super()
    this.socket = new WebSocket(url);
    this.url = url
  }

public isOpen (): boolean {
  return this.socket.readyState === 1

}

  connect(): void {
    this.socket.onopen = () => {
      console.log('Connected to WebSocket server');
      this.emit('WEBSOCKET_OPEN', undefined);
    };

    this.socket.onmessage = (event) => {
      console.log('Message from server:', event.data);
      const message = JSON.parse(event.data);
      if (message.type === 'ERROR') {
        this.toast.show(message.payload.error);
     } else {
        this.emit(message.type, message);
       };
    

    this.socket.onerror = (event) => {
      console.error('WebSocket error:', event);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    
   };
    }
  }

 public loginUser(id: string = '', login: string, password: string): void {
  console.log('Выслал запрос на логин', login )
    const loginRequest = {
      id: id,
      type: 'USER_LOGIN',
      payload: {
        user: {
          login: login,
          password: password,
        },
      },
    };
  
    this.socket.send(JSON.stringify(loginRequest));
  }

  public logoutUser(id: string = '', login: string, password: string): void { 
    const logoutRequest = {
      id: id,
      type: "USER_LOGOUT",
      payload: {
        user: {
          login: login,
          password: password,
        }
      }
    }
    this.socket.send(JSON.stringify(logoutRequest));
  }

  public getAllAuthUsers():void {
    const request = {
      id: '', 
      type: 'USER_ACTIVE',
      payload: null,
    };

    this.socket.send(JSON.stringify(request));
  }

  public getAllUnauthUsers():void {
const request = {
  id: '',
  type: "USER_INACTIVE",
  payload: null,
}
this.socket.send(JSON.stringify(request));
  }
  
}

type ActiveUsersList = {
  id: string,
  type: "USER_ACTIVE",
  payload: {
    users: [],
  }
}

  

