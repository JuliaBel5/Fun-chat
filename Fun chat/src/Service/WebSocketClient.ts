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
  timeout = -1

  constructor(private url: string) {
    super()
    this.socket = new WebSocket(url)
    this.url = url
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 10
    this.reconnectDelay = 5000
  }

  public isOpen(): boolean {
    return this.socket.readyState === 1
  }

  connect(): void {
    this.socket.addEventListener('open', this.handleOpen)
    this.socket.addEventListener('message', this.handleMessage)
    this.socket.addEventListener('error', this.handleError)
    this.socket.addEventListener('close', this.handleClose)
  }

  handleOpen = (event: Event) => {
    console.log('Connected to WebSocket server')
    this.emit('WEBSOCKET_OPEN', undefined)
    this.reconnectAttempts = 0
  }

  handleMessage = (event: MessageEvent) => {
    const message = JSON.parse(event.data)
    if (message.type === 'ERROR') {
      this.toast.showNotification(message.payload.error)
      console.log(message.type, message)
    } else if (
      message.type === 'USER_ACTIVE' ||
      message.type === 'USER_INACTIVE' ||
      // message.type === 'MSG_READ' ||
      message.type === 'MSG_SEND'
    ) {
      this.emit(message.type, message)
    } else {
      this.emit(message.type, message)
      console.log(message.type, message)
    }
  }

  handleClose = (event: CloseEvent) => {
    console.log('WebSocket connection closed:', event)
    this.emit('WEBSOCKET_CLOSED', undefined)
    this.reconnect()
  }

  handleError = (event: Event) => {
    console.error('WebSocket error:', event)
  }

  public reconnect() {
    console.log(
      `Attempting to reconnect... Attempt ${this.reconnectAttempts + 1}`,
    )
    this.socket.removeEventListener('open', this.handleOpen)
    this.socket.removeEventListener('message', this.handleMessage)
    this.socket.removeEventListener('close', this.handleClose)
    this.socket.removeEventListener('error', this.handleError)
    this.removeAllListeners()
    this.socket = new WebSocket(this.url)
    this.connect()
    this.reconnectAttempts++
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
    }
    this.socket.send(JSON.stringify(request))
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
    }
    this.socket.send(JSON.stringify(request))
  }

  public markMessageAsRead(id: string, messageId: string): void {
    const request = {
      id: id,
      type: 'MSG_READ',
      payload: {
        message: {
          id: messageId,
        },
      },
    }

    this.socket.send(JSON.stringify(request))
  }

  public deleteMessage(id: string, messageId: string): void {
    const request = {
      id: id,
      type: 'MSG_DELETE',
      payload: {
        message: {
          id: messageId,
        },
      },
    }
    this.socket.send(JSON.stringify(request))
  }

  public editMessage(id: string, messageId: string, text: string): void {
    const request = {
      id: id,
      type: 'MSG_EDIT',
      payload: {
        message: {
          id: messageId,
          text: text,
        },
      },
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
const ws = new WebSocketClient('ws://localhost:4000')
export default ws

interface ActiveUsersList {
  id: string
  type: 'USER_ACTIVE'
  payload: {
    users: []
  }
}
