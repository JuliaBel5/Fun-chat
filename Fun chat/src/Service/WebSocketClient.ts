import {
  CustomEventEmitter,
  EventMap,
  EventReceiver,
} from '../components/EventEmitter/EventEmitter'
import { Toast } from '../components/toast'

export class WebSocketClient extends CustomEventEmitter<EventMap> {
  private socket: WebSocket
  toast: Toast = new Toast()
  reconnectAttempts: number
  maxReconnectAttempts: number
  reconnectDelay: number

  constructor(private url: string) {
    super()
    this.socket = new WebSocket(url)
    this.url = url
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.reconnectDelay = 3000; 
  }

  public isOpen(): boolean {
    return this.socket.readyState === 1
  }

  connect(): void {
    this.socket.addEventListener('open', () => {
      console.log('Connected to WebSocket server')
      this.emit('WEBSOCKET_OPEN', undefined)
      this.reconnectAttempts = 0;
      this.reconnectDelay = 3000;
    })

    this.socket.onmessage = (event) => {
      console.log('Message from server:', event.data)
      const message = JSON.parse(event.data)
      if (message.type === 'ERROR') {
        this.toast.showNotification(message.payload.error)
      } else {
        this.emit(message.type, message)
      }

      this.socket.onerror = (event) => {
        console.error('WebSocket error:', event)
      }

      this.socket.addEventListener('close', (event) => {
        console.log('WebSocket connection closed:', event)
                this.emit('WEBSOCKET_CLOSED', undefined)
        
      })
    }
    
  }
  public reconnect() {

//    if (this.reconnectAttempts < this.maxReconnectAttempts) {
 //     setTimeout(() => {
         console.log(`Attempting to reconnect... Attempt ${this.reconnectAttempts + 1}, ${this.reconnectDelay}`);
         this.socket = new WebSocket(this.url)
         this.connect();
         this.reconnectAttempts++; 
//       }, this.reconnectDelay);
//    } else {
//       console.log('Max reconnection attempts reached.');
//    }
   }
  public loginUser(id = '', login: string, password: string): void {
    console.log('Выслал запрос на логин', login)
    const loginRequest = {
      id,
      type: 'USER_LOGIN',
      payload: {
        user: {
          login,
          password,
        },
      },
    }

    this.socket.send(JSON.stringify(loginRequest))
  }

  public logoutUser(id = '', login: string, password: string): void {
    const logoutRequest = {
      id,
      type: 'USER_LOGOUT',
      payload: {
        user: {
          login,
          password,
        },
      },
    }
    this.socket.send(JSON.stringify(logoutRequest))
  }

  public getAllAuthUsers(): void {
    const request = {
      id: '',
      type: 'USER_ACTIVE',
      payload: null,
    }

    this.socket.send(JSON.stringify(request))
  }

  public getAllUnauthUsers(): void {
    const request = {
      id: '',
      type: 'USER_INACTIVE',
      payload: null,
    }
    this.socket.send(JSON.stringify(request))
  }

  public removeListener(
    eventName: keyof EventMap,
    listener: EventReceiver<EventMap[keyof EventMap]>,
  ): void {
    if (this.events[eventName]) {
      const listeners = this.events[eventName]
      const index = listeners?.indexOf(listener)
      if (index && index > -1) {
        listeners?.splice(index, 1)
      }
    }
  }
}

interface ActiveUsersList {
  id: string
  type: 'USER_ACTIVE'
  payload: {
    users: []
  }
}
