export class WebSocketClient {
  private socket: WebSocket;

  constructor(private url: string) {
    this.socket = new WebSocket(url);
    this.url = url
  }

public isOpen (): boolean {
  return this.socket.readyState === 1

}

  connect(): void {
    this.socket.onopen = () => {
      console.log('Connected to WebSocket server');
      
    };

    this.socket.onmessage = (event) => {
      console.log('Message from server:', event.data);
      // здесь надо будет что-нибудь делать потом.
    };

    this.socket.onerror = (event) => {
      console.error('WebSocket error:', event);
    };
  }

 public loginUser(id: string = '', login: string, password: string): void {
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

// Usage for later
const webSocketClient = new WebSocketClient('ws://localhost:4000');
webSocketClient.connect();
  

  

