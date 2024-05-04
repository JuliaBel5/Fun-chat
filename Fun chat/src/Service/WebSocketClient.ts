import {
  CustomEventEmitter,
  EventMap,
} from '../EventEmitter/EventEmitter';
import { Toast } from '../Components/toast';

export class WebSocketClient extends CustomEventEmitter<EventMap> {
  private socket: WebSocket;

  toast: Toast = new Toast();

  reconnectAttempts: number;

  maxReconnectAttempts: number;

  reconnectDelay: number;

  timeout = -1;

  constructor(private url: string) {
    super();
    this.socket = new WebSocket(url);
    this.url = url;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.reconnectDelay = 5000;
  }

  public isOpen(): boolean {
    return this.socket.readyState === 1;
  }

  public close() {
    return this.socket.close();
  }

  connect(): void {
    this.socket.addEventListener('open', this.handleOpen);
    this.socket.addEventListener('message', this.handleMessage);
    this.socket.addEventListener('error', this.handleError);
    this.socket.addEventListener('close', this.handleClose);
  }

  handleOpen = () => {
    console.log('Connected to WebSocket server');
    this.emit('WEBSOCKET_OPEN', undefined);
    this.reconnectAttempts = 0;
  };

  handleMessage = (event: MessageEvent) => {
    const message = JSON.parse(event.data);
    if (message.type === 'ERROR') {
      this.toast.showNotification(message.payload.error);
      console.log(message.payload.error);
      if (message.payload.error === 'incorrect password' || message.payload.error === 'a user with this login is already authorized') {
        this.emit('LOGIN_FAILED', undefined);
      }
    } else {
      this.emit(message.type, message);
    }
  };

  handleClose = (event: CloseEvent) => {
    console.log('WebSocket connection closed:', event);
    this.emit('WEBSOCKET_CLOSED', undefined);
    this.reconnect();
  };

  // eslint-disable-next-line class-methods-use-this
  handleError = (event: Event) => {
    console.error('WebSocket error:', event);
  };

  public reconnect() {
    console.log(
      `Attempting to reconnect... Attempt ${this.reconnectAttempts + 1}`,
    );
    this.socket.removeEventListener('open', this.handleOpen);
    this.socket.removeEventListener('message', this.handleMessage);
    this.socket.removeEventListener('close', this.handleClose);
    this.socket.removeEventListener('error', this.handleError);
    this.removeAllListeners();
    this.socket = new WebSocket(this.url);
    this.connect();
    this.reconnectAttempts += 1;
  }

  public loginUser(id: string, login: string, password: string): void {
    const loginRequest = {
      id,
      type: 'USER_LOGIN',
      payload: {
        user: {
          login,
          password,
        },
      },
    };

    this.socket.send(JSON.stringify(loginRequest));
  }

  public logoutUser(id: string, login: string, password: string): void {
    const logoutRequest = {
      id,
      type: 'USER_LOGOUT',
      payload: {
        user: {
          login,
          password,
        },
      },
    };
    this.socket.send(JSON.stringify(logoutRequest));
  }

  public getAllAuthUsers(): void {
    const request = {
      id: '',
      type: 'USER_ACTIVE',
      payload: null,
    };

    this.socket.send(JSON.stringify(request));
  }

  public getAllUnauthUsers(): void {
    const request = {
      id: '',
      type: 'USER_INACTIVE',
      payload: null,
    };
    this.socket.send(JSON.stringify(request));
  }

  public sendMessage(id: string, user: string, message: string): void {
    const request = {
      id,
      type: 'MSG_SEND',
      payload: {
        message: {
          to: user,
          text: message,
        },
      },
    };
    this.socket.send(JSON.stringify(request));
  }

  public getHistory(id: string, user: string): void {
    const request = {
      id,
      type: 'MSG_FROM_USER',
      payload: {
        user: {
          login: user,
        },
      },
    };
    this.socket.send(JSON.stringify(request));
  }

  public markMessageAsRead(id: string, messageId: string): void {
    const request = {
      id,
      type: 'MSG_READ',
      payload: {
        message: {
          id: messageId,
        },
      },
    };

    this.socket.send(JSON.stringify(request));
  }

  public deleteMessage(id: string, messageId: string): void {
    const request = {
      id,
      type: 'MSG_DELETE',
      payload: {
        message: {
          id: messageId,
        },
      },
    };
    this.socket.send(JSON.stringify(request));
  }

  public editMessage(id: string, messageId: string, text: string): void {
    const request = {
      id,
      type: 'MSG_EDIT',
      payload: {
        message: {
          id: messageId,
          text,
        },
      },
    };
    this.socket.send(JSON.stringify(request));
  }
}
const ws = new WebSocketClient('ws://127.0.0.1:4000');
export default ws;
