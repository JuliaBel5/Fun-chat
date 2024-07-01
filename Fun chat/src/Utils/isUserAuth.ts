import UserStore from '../Storage/Store';

export function isUserAuth(): boolean {
  const MrrrChatUserData = UserStore.getData();
  return MrrrChatUserData?.isAuth ?? false;
}
