import ws, { WebSocketClient } from '../../Service/WebSocketClient';
import UserStore from '../../Storage/Store';
import { createElement } from '../../Utils/createElement';
import { truncateWithEllipses } from '../../Utils/truncate';
import {
  ActiveUsersList,
  HistoryOfMessages,
  InactiveUsersList,
  Message,
  MessageDeleted,
  MessageSent,
  MessageSentFromUser,
  ReadStatusChange,
  ReadStatusNotification,
  ThirdPartyUserLogin,
  ThirdPartyUserLogout,
  UnreadUserMessages,
  User,
} from '../../EventEmitter/types';
import type { Loader } from '../../Components/Loader';
import loader from '../../Components/Loader';
import modal, { ModalWindow } from '../../Components/Modal';
import { Toast } from '../../Components/toast';
import { createMessageElement } from './MessageCard';

import { UserList } from './LeftPanel';
import { StartPageProps, UserData } from './types';
import { MainLayout } from './MainLayout';
import { Footer } from './footer';

export function generateUniqueTimestampID() {
  return Date.now() + Math.random().toString(36).slice(2, 11);
}

export class MainPage {
  mainLayout: MainLayout = new MainLayout();

  user: string | undefined;

  toast: Toast = new Toast();

  login: string | undefined;

  webSocketClient: WebSocketClient = ws; // new WebSocketClient('ws://localhost:4000')

  password: string | undefined;

  userList: UserList = new UserList();

  activeUsers: User[] | undefined;

  inactiveUsers: User[] | undefined;

  id: string | undefined;

  activeChatLogin: string | undefined;

  isOnline: boolean;

  userAuthData: UserData = { user: '', password: '', isAuth: false };

  footer: Footer = new Footer();

  loader: Loader;

  divider: HTMLDivElement | undefined;

  editModeId = '';

  modal: ModalWindow = modal;

  router: StartPageProps;

  constructor(props: StartPageProps) {
    this.mainLayout.header.bindLogout(this.confirm);
    this.mainLayout.header.bindGoAboutButton(props.goToAbout);

    this.loader = loader;
    this.toast.bindConfirmButton(this.logout);
    if (this.mainLayout.activeChat.mainInput) {
      this.mainLayout.activeChat.bindSendMessage(this.sendMessage.bind(this));
    }
    this.mainLayout.activeChat.bindHandleMessage();

    this.modal.on('deleteClicked', this.deleteMessage.bind(this));
    this.modal.on('editClicked', this.editMessage.bind(this));

    this.mainLayout.activeChat.bindCancelButton(this.cancelEditing.bind(this));
    if (!this.webSocketClient.isOpen()) {
      this.webSocketClient.connect();
    }
    this.activeUsers = [];
    this.inactiveUsers = [];
    this.setupEventListeners();
    this.isOnline = false;
    this.router = props;
  }

  init() {
    const MrrrChatUserData = UserStore.getData();
    if (MrrrChatUserData) {
      this.user = MrrrChatUserData.user;
      this.password = MrrrChatUserData.password;
      this.userAuthData.user = MrrrChatUserData.user;
      this.userAuthData.password = MrrrChatUserData.password;
      this.userAuthData.isAuth = MrrrChatUserData.isAuth;

      if (this.mainLayout.header.nameContainer && this.user) {
        this.mainLayout.header.nameContainer.textContent = `User name: ${truncateWithEllipses(this.user)}`;
      }
      this.isOnline = false;
      if (this.webSocketClient.isOpen()) {
        this.loader.hideLoader();
      }

      this.startChat();
    }
  }

  startChat() {
    this.mainLayout.init();
    this.mainLayout.userList.usersContainer.addEventListener('click', (event) => {
      this.hideActiveChat(event);
    });
    this.divider = createElement('div', 'divider');
    if (!this.mainLayout.gameArea) return;
    this.mainLayout.gameArea.append(this.divider);
    this.divider.style.display = 'none';
    if (!this.mainLayout.activeChat.activeChat) return;
    this.mainLayout.activeChat.activeChat.addEventListener(
      'click',
      this.removeDivider.bind(this),
    );

    this.mainLayout.activeChat.activeChat.addEventListener(
      'wheel',
      this.removeDivider.bind(this),
    );
    if (this.mainLayout.activeChat.sendButton) {
      this.mainLayout.activeChat.sendButton.addEventListener(
        'click',
        this.removeDivider.bind(this),
      );
    }
  }

  hide() {
    this.mainLayout.hide();
  }

  logout = () => {
    if (this.user && this.password) {
      this.webSocketClient.logoutUser('', this.user, this.password);
    }
    this.activeChatLogin = '';
    if (this.mainLayout.activeChat.startChatPanel) {
      this.mainLayout.activeChat.startChatPanel.textContent = 'Choose a friend to chat with';
    }
  };

  confirm = () => {
    this.toast.show(`Are you sure you want to logout, ${this.user}?`);
  };

  setupEventListeners() {
    this.webSocketClient.on(
      'WEBSOCKET_OPEN',
      this.sendInitialRequests.bind(this),
    );
  }

  sendInitialRequests() {
    this.loader.hideLoader();
    this.webSocketClient.on('USER_LOGIN', this.loginSucces.bind(this));
    this.webSocketClient.on('LOGIN_FAILED', this.handleFailedLogin.bind(this));
    this.webSocketClient.on('USER_LOGOUT', this.logoutSucces.bind(this));
    this.webSocketClient.on('USER_ACTIVE', this.updateActiveUsers.bind(this));
    this.webSocketClient.on(
      'USER_INACTIVE',
      this.updateInactiveUsers.bind(this),
    );
    this.webSocketClient.on(
      'USER_EXTERNAL_LOGIN',
      this.externalUserLogin.bind(this),
    );
    this.webSocketClient.on(
      'USER_EXTERNAL_LOGOUT',
      this.externalUserLogout.bind(this),
    );
    this.webSocketClient.on('WEBSOCKET_CLOSED', this.reconnect.bind(this));
    this.webSocketClient.on('USER_LOGOUT', () => this.router.goToLogin());
    this.webSocketClient.on('USER_LOGIN', () => this.router.navigate());
    this.webSocketClient.on('MSG_SEND', this.receiveMessage.bind(this));
    this.webSocketClient.on('MSG_FROM_USER', this.getHistory.bind(this)); // событие отправки массива сообщений с конкретным пользователем
    this.webSocketClient.on('MSG_READ', this.updateUnreadMessages.bind(this));
    this.webSocketClient.on('MSG_DELIVER', this.updateChatHistory.bind(this));
    this.webSocketClient.on('MSG_DELETE', this.handleMessageDelete.bind(this));
    this.webSocketClient.on('MSG_EDIT', this.updateChatHistory.bind(this));
    const MrrrChatUserData = UserStore.getData();
    if (MrrrChatUserData) {
      this.userAuthData.user = MrrrChatUserData.user;
      this.userAuthData.password = MrrrChatUserData.password;
      this.userAuthData.isAuth = MrrrChatUserData.isAuth;
      this.user = MrrrChatUserData.user;
      this.password = MrrrChatUserData.password;
    }
    if (this.user && this.password && !this.isOnline) {
      this.id = generateUniqueTimestampID();
      this.webSocketClient.loginUser(this.id, this.user, this.password);
    }
    if (this.mainLayout.userList) {
      this.mainLayout.userList.on('userClicked', (user) => {
        this.activeChatLogin = user.login;

        if (
          this.mainLayout.activeChat.startChatPanel
          && this.mainLayout.activeChat.activeChat
          && this.mainLayout.activeChat.rightInputContainer
        ) {
          this.mainLayout.activeChat.startChatPanel.style.height = '35px';
          const status = user.isLogined ? 'online' : 'offline';
          this.mainLayout.activeChat.startChatPanel.textContent = `${truncateWithEllipses(user.login)}, ${status}`;
          this.mainLayout.activeChat.activeChat.style.display = 'flex';
          this.mainLayout.activeChat.rightInputContainer.style.display = 'flex';
        }
        if (this.id && this.activeChatLogin) {
          this.webSocketClient.getHistory(this.id, this.activeChatLogin);
        }
      });
    }
  }

  loginSucces() {
    this.loader.hideLoader();
    const MrrrChatUserData = UserStore.getData();
    if (MrrrChatUserData) {
      this.user = MrrrChatUserData.user;
      this.password = MrrrChatUserData.password;
      this.userAuthData.isAuth = true;
      this.userAuthData.user = MrrrChatUserData.user;
      this.userAuthData.password = MrrrChatUserData.password;
      UserStore.saveData(this.userAuthData);
    }
    this.isOnline = true;
    this.webSocketClient.getAllAuthUsers();
    this.webSocketClient.getAllUnauthUsers();
    console.log('логин прошел успешно');
  }

  logoutSucces() {
    this.userAuthData.isAuth = false;
    this.userAuthData.user = '';
    this.userAuthData.user = '';
    UserStore.removeData();
    this.isOnline = false;
    this.user = '';
    this.password = '';
    console.log('логаут прошел успешно');
  }

  updateActiveUsers(event: ActiveUsersList) {
    this.activeUsers = event.payload.users;
    if (this.mainLayout.userList) {
      this.mainLayout.userList.updateUsersList(this.activeUsers, true);
    }
  }

  updateInactiveUsers(event: InactiveUsersList) {
    this.inactiveUsers = event.payload.users;
    if (this.mainLayout.userList) {
      this.mainLayout.userList.updateUsersList(this.inactiveUsers);
    }
    this.fetchMessageHistory();
  }

  externalUserLogin(event: ThirdPartyUserLogin) {
    const newLoggedInUser = event.payload.user.login;
    this.toast.showNotification(`${newLoggedInUser} has just logged in`);
    this.webSocketClient.getAllAuthUsers();
    this.webSocketClient.getAllUnauthUsers();
    if (event.payload.user.login === this.activeChatLogin) {
      if (!this.mainLayout.activeChat.startChatPanel) return;
      this.mainLayout.activeChat.startChatPanel.textContent = `${truncateWithEllipses(this.activeChatLogin)}, online`;
      if (this.id && this.activeChatLogin) {
        this.webSocketClient.getHistory(this.id, this.activeChatLogin);
      }
    }
  }

  externalUserLogout(event: ThirdPartyUserLogout) {
    const newLoggedInUser = event.payload.user.login;
    this.toast.showNotification(`${newLoggedInUser} has just logged out`);
    this.webSocketClient.getAllAuthUsers();
    this.webSocketClient.getAllUnauthUsers();
    if (event.payload.user.login === this.activeChatLogin) {
      if (!this.mainLayout.activeChat.startChatPanel) return;
      this.mainLayout.activeChat.startChatPanel.textContent = `${truncateWithEllipses(this.activeChatLogin)}, offline`;
    }
  }

  sendMessage() {
    if (
      this.mainLayout.activeChat.activeChat
      && this.mainLayout.activeChat.mainInput
      && this.mainLayout.activeChat.sendButton
      && this.mainLayout.activeChat.startChatPanel
      && this.mainLayout.activeChat.mainInput.value.trim()
    ) {
      const text = this.mainLayout.activeChat.mainInput.value;
      if (!this.editModeId) {
        if (this.id && this.activeChatLogin) {
          console.log('дошли');
          this.webSocketClient.sendMessage(this.id, this.activeChatLogin, text);
        }
      } else if (
        this.id
        && this.editModeId
        && this.mainLayout.activeChat.cancelButton
        && this.mainLayout.activeChat.inputWrapper
      ) {
        this.webSocketClient.editMessage(this.id, this.editModeId, text);
        this.editModeId = '';
        this.mainLayout.activeChat.cancelButton.remove();
      }
      this.mainLayout.activeChat.mainInput.value = '';
      this.mainLayout.activeChat.disableSendButton();
    }
  }

  receiveMessage(event: MessageSentFromUser | MessageSent) {
    const { message } = event.payload;
    if (!this.user) return;
    if (
      message.to === this.activeChatLogin // получатель === активный чат, исходящее
      && this.mainLayout.activeChat.activeChat
      && this.mainLayout.activeChat.activeChat.style.display !== 'none'
    ) {
      if (
        this.mainLayout.activeChat.activeChat.textContent
        === 'Start to chat with your friend'
      ) {
        this.mainLayout.activeChat.activeChat.textContent = '';
      }
      const messageElement = createMessageElement(
        message,
        this.user,
        this.activeChatLogin,
      );
      this.mainLayout.activeChat.activeChat.append(messageElement);
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } else if (
      message.from === this.activeChatLogin // отправитель === активный чат, входящее
      && this.mainLayout.activeChat.activeChat
      && this.mainLayout.activeChat.activeChat.style.display !== 'none'
    ) {
      const messageElement = createMessageElement(
        message,
        this.user,
        this.activeChatLogin,
      );
      this.mainLayout.activeChat.activeChat.append(messageElement);

      if (this.mainLayout.userList) {
        const existingUser = this.mainLayout.userList.userMessages.find(
          (u) => u.login === message.from,
        );
        if (this.id && existingUser && existingUser.newMessages.length === 0) {
          this.webSocketClient.markMessageAsRead(this.id, message.id);
          messageElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        } else if (
          this.id
          && existingUser
          && existingUser.newMessages.length > 0
        ) {
          existingUser.newMessages.push(message.id);
          this.mainLayout.userList.updateUnreadMessagesNumber();
        }
      }
    } else if (message.from !== this.activeChatLogin && this.mainLayout.userList) {
      const existingUser = this.mainLayout.userList.userMessages.find(
        (u) => u.login === message.from,
      );
      if (existingUser) existingUser.newMessages.push(message.id);
      this.mainLayout.userList.updateUnreadMessagesNumber();
    }
  }

  fetchMessageHistory() {
    if (this.activeUsers && this.inactiveUsers) {
      const arr = this.activeUsers.concat(this.inactiveUsers);
      arr.forEach((user) => {
        if (user.login !== this.user && this.id) {
          this.webSocketClient.getHistory(this.id, user.login);
        }
      });
    }
  }

  getHistory(event: HistoryOfMessages) {
    const { messages } = event.payload;
    if (messages.length > 0) {
      const activeUser = messages[0].from === this.user ? messages[0].to : messages[0].from;
      // Есть история переписки, пользователь:', activeUser

      if (activeUser === this.activeChatLogin) {
        // переписка открыта
        if (
          !this.mainLayout.activeChat.activeChat
          || this.mainLayout.activeChat.activeChat.style.display === 'none'
        ) { return; }
        this.mainLayout.activeChat.activeChat.textContent = ''; // сносим все сообщения

        messages.forEach((message) => {
          this.handleMessage(message, messages); // обрабатываем массив
        });
      } else {
        // переписка закрыта - надо навесить кружочек
        messages.forEach((message) => {
          this.mainLayout.userList.handleUnreadMessages(message, activeUser);
        });
      }
    } else if (
      this.mainLayout.activeChat.activeChat?.style.display !== 'none'
      && this.mainLayout.activeChat.activeChat
    ) {
      this.mainLayout.activeChat.activeChat.textContent = 'Start to chat with your friend';
    }
  }

  reconnect() {
    this.toast.showNotification(
      'Connection with server lost, trying to reconnect...',
    );
    this.loader.init();
    this.loader.showLoader(30000, 'Loading...');
  }

  isFirstNewMessage(message: Message, messages: Message[]) {
    if (!this.divider) {
      this.divider = createElement('div', 'divider');
    }

    const firstNewMessage = messages.find(
      (message1) => message1.status.isReaded === false && message1.to === this.user,
    );
    return message === firstNewMessage;
  }

  removeDivider() {
    if (this.divider && this.divider.style.display !== 'none') {
      this.divider.style.display = 'none';
      if (!this.mainLayout.userList) return;
      const existingUser = this.mainLayout.userList.userMessages.find(
        (u) => u.login === this.activeChatLogin,
      );
      if (!existingUser) return;
      existingUser.newMessages.forEach((message) => {
        if (this.id) {
          this.webSocketClient.markMessageAsRead(this.id, message);
        }
      });
    }
  }

  updateUnreadMessages(
    event: ReadStatusChange | ReadStatusNotification | MessageDeleted,
  ) {
    const messageId = event.payload.message.id;
    if (this.mainLayout.userList) {
      // eslint-disable-next-line max-len
      const activeUser: UnreadUserMessages | undefined = this.mainLayout.userList.userMessages.find((u) => u.newMessages.includes(messageId));
      if (activeUser) {
        const updatedUser: string[] = activeUser.newMessages.filter(
          (id) => id !== messageId,
        );
        activeUser.newMessages = updatedUser;
        this.mainLayout.userList.updateUnreadMessagesNumber();
      } else if (this.id && this.activeChatLogin) {
        // 'ОТКРЫТ ДИАЛОГ'
        this.webSocketClient.getHistory(this.id, this.activeChatLogin);
      }
    }
  }

  hideActiveChat(event: MouseEvent) {
    if (event.target instanceof HTMLElement) {
      this.activeChatLogin = '';
      this.mainLayout.activeChat.hideActiveChat(event.target);
    }
  }

  updateChatHistory() {
    if (this.id && this.activeChatLogin) {
      this.webSocketClient.getHistory(this.id, this.activeChatLogin);
    }
  }

  handleMessage(message: Message, messages: Message[]) {
    const activeUser = messages[0].from === this.user ? messages[0].to : messages[0].from;
    if (!(this.user && this.activeChatLogin)) return;
    const messageElement = createMessageElement(
      message,
      this.user,
      this.activeChatLogin,
    );

    if (!this.mainLayout.activeChat.activeChat) return;
    this.mainLayout.activeChat.activeChat.append(messageElement);
    // обрабатываем первое непрочитанное
    if (this.isFirstNewMessage(message, messages) && this.divider) {
      this.mainLayout.activeChat.activeChat.insertBefore(this.divider, messageElement);
      this.divider.style.display = 'flex';
      this.divider.scrollIntoView({ behavior: 'instant', block: 'start' });
    }

    this.mainLayout.userList.handleUnreadMessages(message, activeUser);

    if (
      (messages[messages.length - 1].id === message.id
        && message.status.isReaded) // последнее прочитанное
      || (messages[messages.length - 1].id === message.id
        && message.from === this.user)
    ) {
      messageElement.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }

  handleMessageDelete(event: MessageDeleted) {
    this.updateUnreadMessages(event);
    if (this.id && this.activeChatLogin) {
      this.webSocketClient.getHistory(this.id, this.activeChatLogin);
    }
  }

  deleteMessage(event: string) {
    if (this.id) {
      this.webSocketClient.deleteMessage(this.id, event);
    }
    this.mainLayout.activeChat.deleteMessage();
  }

  editMessage(event: string) {
    this.editModeId = event;
    this.mainLayout.activeChat.editMessage(event);
  }

  cancelEditing() {
    this.editModeId = '';
    this.mainLayout.activeChat.cancelEditing();
  }

  handleFailedLogin() {
    this.loader.hideLoader();
    UserStore.removeData();
    this.router.goToLogin();
  }
}
