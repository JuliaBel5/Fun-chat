import { ActiveUsersList, InactiveUsersList, ThirdPartyUserLogin, ThirdPartyUserLogout, UserLogin, UserLogout, MessageSent, MessageSentFromUser, HistoryOfMessages, MessageDelivered, ReadStatusChange, ReadStatusNotification, MessageDeleted, MessageEdited, ErrorMessage, User } from "./types";

export class  CustomEventEmitter<T extends EventMap> implements CustomEventEmitterInt<T> {
  private events: { [K in keyof T]?: Array<EventReceiver<T[K]>> } = {};
 
  on<K extends EventKey<T >>(eventName: K, listener: EventReceiver<T[K]>): void {
     if (!this.events[eventName]) {
       this.events[eventName] = [];
     }
     this.events[eventName]!.push(listener);
  }
 
  emit<K extends EventKey<T>>(eventName: K, params: T[K]): void {
     if (this.events[eventName]) {
       this.events[eventName]!.forEach(listener => listener(params));
     }
  }
 }



 export type EventMap = {
  USER_ACTIVE: ActiveUsersList;
  USER_INACTIVE: InactiveUsersList;
  USER_EXTERNAL_LOGIN: ThirdPartyUserLogin;
  USER_EXTERNAL_LOGOUT: ThirdPartyUserLogout;
  USER_LOGIN: UserLogin ;
  USER_LOGOUT: UserLogout;
  MSG_SEND: MessageSent | MessageSentFromUser;
  MSG_FROM_USER: HistoryOfMessages;
  MSG_DELIVER: MessageDelivered;
  MSG_READ: ReadStatusChange |  ReadStatusNotification;
  MSG_DELETE: MessageDeleted;
  MSG_EDIT: MessageEdited;
  ERROR:  ErrorMessage;
  userClicked: User;
  WEBSOCKET_OPEN: undefined;
  
 }; 

 export type EventKey<T> = keyof T;
export type EventReceiver<T> = (params: T) => void;

export interface CustomEventEmitterInt<T extends EventMap> {
  on<K extends EventKey<T>>(eventName: K, listener: EventReceiver<T[K]> ): void;
  emit<K extends EventKey<T>>(eventName: K, params: T[K]): void;
 }


