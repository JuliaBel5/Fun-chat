import { SessionStorageApi } from './Storage';

export interface UserData {
  user: string
  password: string
  isAuth: boolean
}

const UserStore = new SessionStorageApi<UserData>('MrrrChatUser');

export default UserStore;
