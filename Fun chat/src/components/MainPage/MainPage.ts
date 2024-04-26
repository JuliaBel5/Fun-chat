import ws, { WebSocketClient } from '../../Service/WebSocketClient';
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
} from '../EventEmitter/types';
import { Loader } from '../Loader';
import modal, { ModalWindow } from '../Modal';
import { Toast } from '../toast';
import { ActiveChat } from './ActiveChat';
import { createMessageElement } from './MessageCard';
import { Footer } from './footer';
import { Header } from './header';
import { UserList } from './leftPanel';
import { StartPageProps, UserData } from './types';

export function generateUniqueTimestampID() {
  return Date.now() + Math.random().toString(36).slice(2, 11);
}

export class MainPage {
  gameArea: HTMLDivElement | undefined;

  header: Header;

  container: HTMLDivElement | undefined;

  leftPanel: HTMLDivElement | undefined;

  rightPanel: HTMLDivElement | undefined;

  rightInputContainer: HTMLDivElement | undefined;

  leftInput: HTMLInputElement | undefined;

  mainInput: HTMLInputElement | undefined;

  leftInputContainer: HTMLDivElement | undefined;

  sendButton: HTMLButtonElement | undefined;

  activeChat: ActiveChat;

  user: string | undefined;

  toast: Toast = new Toast();

  login: string | undefined;

  webSocketClient: WebSocketClient = ws; // new WebSocketClient('ws://localhost:4000')

  password: string | undefined;

  startChatPanel: HTMLDivElement | undefined;

  userList: UserList | undefined;

  activeUsers: User[] | undefined;

  inactiveUsers: User[] | undefined;

  id: string | undefined;

  activeChatLogin: string | undefined;

  isOnline: boolean;

  userAuthData: UserData = { firstName: '', password: '' };

  footer: Footer = new Footer();

  loader: Loader;

  divider: HTMLDivElement | undefined;

  editModeId = '';

  modal: ModalWindow = modal;

  router: StartPageProps;

  constructor(props: StartPageProps) {
    this.header = new Header();
    this.header.bindLogout(this.confirm);
    this.loader = new Loader();
    this.userList = new UserList();
    this.activeChat = new ActiveChat();
    this.toast.bindConfirmButton(this.logout);
    this.activeChat.bindSendMessage(this.sendMessage.bind(this));
    if (this.activeChat.mainInput) {
      this.activeChat.mainInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          this.sendMessage();
          this.removeDivider();
        }
      });
    }
    this.activeChat.bindHandleMessage();

    this.modal.on('deleteClicked', this.deleteMessage.bind(this));

    this.modal.on('editClicked', this.editMessage.bind(this));

    this.activeChat.bindCancelButton(this.cancelEditing.bind(this));
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
    const MrrrChatUserData = sessionStorage.getItem('MrrrChatUser');
    if (MrrrChatUserData) {
      this.user = JSON.parse(MrrrChatUserData).firstName;
      this.password = JSON.parse(MrrrChatUserData).password;
      this.userAuthData.firstName = JSON.parse(MrrrChatUserData).firstName;
      this.userAuthData.firstName = JSON.parse(MrrrChatUserData).password;

      if (this.header.nameContainer && this.user) {
        this.header.nameContainer.textContent = `User name: ${truncateWithEllipses(this.user)}`;
      }
      if (this.webSocketClient.isOpen()) {
        this.isOnline = false;

        this.loader.hideLoader();
      }
      if (!this.webSocketClient.isOpen()) {
        this.isOnline = false;
      }
      this.startChat();
    }
  }

  startChat() {
    if (!this.userList) return;
    this.gameArea = createElement('div', 'gamearea');
    document.body.append(this.gameArea);
    this.gameArea.append(this.header.header);

    this.container = createElement('div', 'game-container');
    this.gameArea.append(this.container, this.footer.footer);
    this.leftPanel = createElement('div', 'left-panel');
    this.rightPanel = createElement('div', 'right-panel');

    this.leftPanel.append(this.userList.leftInputContainer);
    if (
      !this.activeChat.startChatPanel
      || !this.activeChat.activeChat
      || !this.activeChat.rightInputContainer
    ) { return; }
    this.rightPanel.append(
      this.activeChat.startChatPanel,
      this.activeChat.activeChat,
      this.activeChat.rightInputContainer,
    );

    this.activeChat.activeChat.style.display = 'none';
    this.activeChat.rightInputContainer.style.display = 'none';
    this.container.append(this.leftPanel, this.rightPanel);

    this.userList.usersContainer.addEventListener('click', (event) => {
      this.hideActiveChat(event);
    });
    this.divider = createElement('div', 'divider');
    this.gameArea.append(this.divider);
    this.divider.style.display = 'none';
    this.activeChat.activeChat.addEventListener(
      'click',
      this.removeDivider.bind(this),
    );

    this.activeChat.activeChat.addEventListener(
      'wheel',
      this.removeDivider.bind(this),
    );
    if (this.activeChat.sendButton) {
      this.activeChat.sendButton.addEventListener(
        'click',
        this.removeDivider.bind(this),
      );
    }
  }

  hide() {
    if (this.gameArea) {
      this.gameArea.remove();
    }
  }

  logout = () => {
    if (this.user && this.password && this.id) {
      this.webSocketClient.logoutUser(this.id, this.user, this.password);
    }
    this.activeChatLogin = '';
    if (this.activeChat.startChatPanel) {
      this.activeChat.startChatPanel.textContent = 'Choose a friend to chat with';
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
    this.loader.hideLoader();
  }

  sendInitialRequests() {
    this.webSocketClient.on('USER_LOGIN', this.loginSucces.bind(this));
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
    const MrrrChatUserData = sessionStorage.getItem('MrrrChatUser');
    if (MrrrChatUserData) {
      this.user = JSON.parse(MrrrChatUserData).firstName;
      this.password = JSON.parse(MrrrChatUserData).password;
      this.userAuthData.firstName = JSON.parse(MrrrChatUserData).firstName;
      this.userAuthData.firstName = JSON.parse(MrrrChatUserData).password;
    }
    if (this.user && this.password && !this.isOnline) {
      this.id = generateUniqueTimestampID();
      this.webSocketClient.loginUser(this.id, this.user, this.password);
    }
    if (this.userList) {
      this.userList.on('userClicked', (user) => {
        this.activeChatLogin = user.login;

        if (
          this.activeChat.startChatPanel
          && this.activeChat.activeChat
          && this.activeChat.rightInputContainer
        ) {
          this.activeChat.startChatPanel.style.height = '35px';
          const status = user.isLogined ? 'online' : 'offline';
          this.activeChat.startChatPanel.textContent = `${truncateWithEllipses(user.login)}, ${status}`;
          this.activeChat.activeChat.style.display = 'flex';
          this.activeChat.rightInputContainer.style.display = 'flex';
        }
        if (this.id && this.activeChatLogin) {
          this.webSocketClient.getHistory(this.id, this.activeChatLogin);
        }
      });
    }
  }

  loginSucces() {
    this.isOnline = true;
    const MrrrChatTempUserData = sessionStorage.getItem('MrrrChatTempUser');
    if (MrrrChatTempUserData) {
      this.userAuthData.firstName = JSON.parse(MrrrChatTempUserData).firstName;
      this.userAuthData.password = JSON.parse(MrrrChatTempUserData).password;
      this.user = JSON.parse(MrrrChatTempUserData).firstName;
      this.password = JSON.parse(MrrrChatTempUserData).password;
      sessionStorage.setItem('MrrrChatUser', JSON.stringify(this.userAuthData));
    }
    sessionStorage.removeItem('MrrrChatTempUser');
    this.webSocketClient.getAllAuthUsers();
    this.webSocketClient.getAllUnauthUsers();
    console.log('логин прошел успешно');
  }

  logoutSucces() {
    this.isOnline = false;
    this.user = '';
    this.password = '';
    sessionStorage.removeItem('MrrrChatUser');
    console.log('логаут прошел успешно');
  }

  updateActiveUsers(event: ActiveUsersList) {
    this.activeUsers = event.payload.users;
    if (this.userList) {
      this.userList.updateActiveUsersList(this.activeUsers);
    }
  }

  updateInactiveUsers(event: InactiveUsersList) {
    this.inactiveUsers = event.payload.users;
    if (this.userList) {
      this.userList.updateInactiveUsersList(this.inactiveUsers);
    }
    this.fetchMessageHistory();
  }

  externalUserLogin(event: ThirdPartyUserLogin) {
    const newLoggedInUser = event.payload.user.login;
    this.toast.showNotification(`${newLoggedInUser} has just logged in`);
    this.webSocketClient.getAllAuthUsers();
    this.webSocketClient.getAllUnauthUsers();
    if (event.payload.user.login === this.activeChatLogin) {
      if (!this.activeChat.startChatPanel) return;
      this.activeChat.startChatPanel.textContent = `${truncateWithEllipses(this.activeChatLogin)}, online`;
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
      if (!this.activeChat.startChatPanel) return;
      this.activeChat.startChatPanel.textContent = `${truncateWithEllipses(this.activeChatLogin)}, offline`;
    }
  }

  sendMessage() {
    if (
      this.activeChat.activeChat
      && this.activeChat.mainInput
      && this.activeChat.sendButton
      && this.activeChat.startChatPanel
      && this.activeChat.mainInput.value.trim()
    ) {
      if (!this.editModeId) {
        const text = this.activeChat.mainInput.value;
        if (this.id && this.activeChatLogin) {
          this.webSocketClient.sendMessage(this.id, this.activeChatLogin, text);
        }
      } else if (
        this.id
        && this.editModeId
        && this.activeChat.cancelButton
        && this.activeChat.inputWrapper
      ) {
        const text = this.activeChat.mainInput.value;
        this.webSocketClient.editMessage(this.id, this.editModeId, text);
        this.editModeId = '';
        this.activeChat.cancelButton.remove();
      }
      this.activeChat.mainInput.value = '';
      this.activeChat.sendButton.classList.remove('submit');
      this.activeChat.sendButton.classList.add('disabled-submit');
    }
  }

  receiveMessage(event: MessageSentFromUser | MessageSent) {
    const { message } = event.payload;
    if (!this.user) return;
    if (
      message.to === this.activeChatLogin // получатель === активный чат, исходящее
      && this.activeChat.activeChat
      && this.activeChat.activeChat.style.display !== 'none'
    ) {
      if (
        this.activeChat.activeChat.textContent
        === 'Start to chat with your friend'
      ) {
        this.activeChat.activeChat.textContent = '';
      }
      const messageElement = createMessageElement(
        message,
        this.user,
        this.activeChatLogin,
      );
      this.activeChat.activeChat.append(messageElement);
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } else if (
      message.from === this.activeChatLogin // отправитель === активный чат, входящее
      && this.activeChat.activeChat
      && this.activeChat.activeChat.style.display !== 'none'
    ) {
      const messageElement = createMessageElement(
        message,
        this.user,
        this.activeChatLogin,
      );
      this.activeChat.activeChat.append(messageElement);

      if (this.userList) {
        const existingUser = this.userList.userMessages.find(
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
          this.userList.updateUnreadMessagesNumber();
        }
      }
    } else if (message.from !== this.activeChatLogin && this.userList) {
      const existingUser = this.userList.userMessages.find(
        (u) => u.login === message.from,
      );
      if (existingUser) existingUser.newMessages.push(message.id);
      this.userList.updateUnreadMessagesNumber();
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
          !this.activeChat.activeChat
          || this.activeChat.activeChat.style.display === 'none'
        ) { return; }
        this.activeChat.activeChat.textContent = ''; // сносим все сообщения

        messages.forEach((message) => {
          this.handleMessage(message, messages); // обрабатываем массив
        });
      } else {
        // переписка закрыта - надо навесить кружочек
        messages.forEach((message) => {
          this.handleUnreadMessages(message, activeUser);
        });
      }
    } else if (
      this.activeChat.activeChat?.style.display !== 'none'
      && this.activeChat.activeChat
    ) {
      this.activeChat.activeChat.textContent = 'Start to chat with your friend';
    }
  }

  reconnect() {
    this.toast.showNotification(
      'Connection with server lost, trying to reconnect...',
    );
    this.loader.init();
    this.loader.showLoader(300000, 'Loading...');
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
      if (!this.userList) return;
      const existingUser = this.userList.userMessages.find(
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
    if (this.userList) {
      // eslint-disable-next-line max-len
      const activeUser: UnreadUserMessages | undefined = this.userList.userMessages.find((u) => u.newMessages.includes(messageId));
      if (activeUser) {
        const updatedUser: string[] = activeUser.newMessages.filter(
          (id) => id !== messageId,
        );
        activeUser.newMessages = updatedUser;
        this.userList.updateUnreadMessagesNumber();
      } else if (this.id && this.activeChatLogin) {
        // 'ОТКРЫТ ДИАЛОГ'
        this.webSocketClient.getHistory(this.id, this.activeChatLogin);
      }
    }
  }

  hideActiveChat(event: MouseEvent) {
    if (event.target instanceof HTMLElement) {
      this.activeChatLogin = '';
      this.activeChat.hideActiveChat(event.target);
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

    if (!this.activeChat.activeChat) return;
    this.activeChat.activeChat.append(messageElement);
    // обрабатываем первое непрочитанное
    if (this.isFirstNewMessage(message, messages) && this.divider) {
      this.activeChat.activeChat.insertBefore(this.divider, messageElement);
      this.divider.style.display = 'flex';
      this.divider.scrollIntoView({ behavior: 'instant', block: 'start' });
    }

    this.handleUnreadMessages(message, activeUser);

    if (
      (messages[messages.length - 1].id === message.id
        && message.status.isReaded) // последнее прочитанное
      || (messages[messages.length - 1].id === message.id
        && message.from === this.user)
    ) {
      messageElement.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }

  handleUnreadMessages(message: Message, activeUser: string) {
    if (message.from === activeUser && !message.status.isReaded) {
      if (!this.userList) return;
      const existingUser = this.userList.userMessages.find(
        (u) => u.login === activeUser,
      );
      if (existingUser && !existingUser.newMessages.includes(message.id)) {
        existingUser.newMessages.push(message.id);
      }
      this.userList.updateUnreadMessagesNumber();
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
    this.activeChat.deleteMessage();
  }

  editMessage(event: string) {
    this.editModeId = event;
    this.activeChat.editMessage(event);
  }

  cancelEditing() {
    this.editModeId = '';
    this.activeChat.cancelEditing();
  }
}
