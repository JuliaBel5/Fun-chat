import { SessionStorageApi } from './Storage';

export interface LoginDataType {
  login: string
  password: string
}

const UserStore = new SessionStorageApi<LoginDataType>('authData');

export default UserStore;
