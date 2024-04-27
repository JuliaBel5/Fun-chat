import {
  ActiveUsersList,
  ErrorMessage,
  HistoryOfMessages,
  InactiveUsersList,
  MessageDeleted,
  MessageDelivered,
  MessageEdited,
  MessageSent,
  MessageSentFromUser,
  ReadStatusChange,
  ReadStatusNotification,
  ThirdPartyUserLogin,
  ThirdPartyUserLogout,
  User,
  UserLogin,
  UserLogout,
} from './types';

export class CustomEventEmitter<T extends EventMap>
  implements CustomEventEmitterInt<T> {
  protected events: { [K in keyof T]?: Array<EventReceiver<T[K]>> } = {};

  on<K extends EventKey<T>>(eventName: K, listener: EventReceiver<T[K]>): void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName]!.push(listener);
  }

  emit<K extends EventKey<T>>(eventName: K, params: T[K]): void {
    if (this.events[eventName]) {
      this.events[eventName]!.forEach((listener) => listener(params));
    }
  }

  removeAllListeners(): void {
    Object.keys(this.events).forEach((eventName) => {
      if (eventName !== 'WEBSOCKET_OPEN') {
        this.events[eventName as keyof T] = [];
      }
    });
  }

  public removeListener(
    eventName: keyof EventMap,
    listener: EventReceiver<EventMap[keyof EventMap]>,
  ): void {
    if (this.events[eventName]) {
      const listeners = this.events[eventName];
      const index = listeners?.indexOf(listener);
      if (index && index > -1) {
        listeners?.splice(index, 1);
      }
    }
  }
}

export interface EventMap {
  USER_ACTIVE: ActiveUsersList
  USER_INACTIVE: InactiveUsersList
  USER_EXTERNAL_LOGIN: ThirdPartyUserLogin
  USER_EXTERNAL_LOGOUT: ThirdPartyUserLogout
  USER_LOGIN: UserLogin
  USER_LOGOUT: UserLogout
  MSG_SEND: MessageSent | MessageSentFromUser
  MSG_FROM_USER: HistoryOfMessages
  MSG_DELIVER: MessageDelivered
  MSG_READ: ReadStatusChange | ReadStatusNotification
  MSG_DELETE: MessageDeleted
  MSG_EDIT: MessageEdited
  ERROR: ErrorMessage
  LOGIN_FAILED: undefined
  userClicked: User
  WEBSOCKET_OPEN: undefined
  WEBSOCKET_CLOSED: void
  deleteClicked: string
  editClicked: string
}

export type EventKey<T> = keyof T;
export type EventReceiver<T> = (params: T) => void;

export interface CustomEventEmitterInt<T extends EventMap> {
  on<K extends EventKey<T>>(eventName: K, listener: EventReceiver<T[K]>): void
  emit<K extends EventKey<T>>(eventName: K, params: T[K]): void
}
