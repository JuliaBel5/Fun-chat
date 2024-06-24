import UserStore from '../../Storage/Store';
import { createElement } from '../../Utils/createElement';
import { truncateWithEllipses } from '../../Utils/truncate';
import { CustomEventEmitter, EventMap } from '../../EventEmitter/EventEmitter';
import { Message, UnreadUserMessages, User } from '../../EventEmitter/types';

export class UserList extends CustomEventEmitter<EventMap> {
  leftInputContainer: HTMLDivElement = createElement('div', 'search-container');

  leftInput: HTMLInputElement = createElement('input', 'left-input', '');

  usersContainer: HTMLDivElement = createElement('div', 'users-container');

  user: string | undefined;

  usersList: HTMLElement[];

  userMessages: UnreadUserMessages[] = [];

  constructor() {
    super();
    this.leftInput.addEventListener('input', () => {
      const searchValue = this.leftInput.value.toLowerCase();
      this.filterUsers(searchValue);
    });
    this.leftInputContainer.append(this.leftInput, this.usersContainer);
    const MrrrChatUserData = UserStore.getData();
    if (MrrrChatUserData) {
      this.user = MrrrChatUserData.user;
    }
    this.usersList = [];
  }

  private filterUsers(searchValue: string): void {
    const filteredUsers = this.usersList.filter((userWrapper) => {
      const userLogin = userWrapper
        .querySelector('.user-status')
        ?.textContent?.toLowerCase();
      return userLogin?.includes(searchValue);
    });

    this.usersContainer.innerHTML = '';

    filteredUsers.forEach((userWrapper) => {
      this.usersContainer.append(userWrapper);
    });
  }

  public updateUsersList(users: User[], clearContainer: boolean = false): void {
    if (clearContainer) {
      this.usersContainer.innerHTML = '';
      this.usersList = [];
    }

    const MrrrChatUserData = UserStore.getData();
    if (MrrrChatUserData) {
      this.user = MrrrChatUserData.user;
    }

    users.forEach((user) => {
      if (user.login !== this.user) {
        const wrappedUser = this.addUser(user);
        this.updateUserMessages(user);
        this.usersList.push(wrappedUser);
      }
    });
  }

  addUser(user: User) {
    const userWrapper = createElement('div', 'user-wrapper');
    const userDiv = createElement(
      'div',
      'user-status',
      truncateWithEllipses(user.login),
      user.login,
    );
    const statusCircle = createElement('span', 'status');
    statusCircle.style.backgroundColor = user.isLogined ? 'green' : 'red';

    userWrapper.addEventListener('click', (event) => {
      event.stopPropagation();
      this.emit('userClicked', user);
    });
    userWrapper.append(statusCircle, userDiv);
    this.usersContainer.append(userWrapper);

    return userWrapper;
  }

  updateUnreadMessagesNumber() {
    this.usersList.forEach((userWrapper) => {
      const userLogin = userWrapper.querySelector('.user-status')?.textContent;
      if (userLogin) {
        const user = this.userMessages.find((u) => u.login === userLogin);
        if (user) {
          let newMessagesElement = userWrapper.querySelector('.new-messages');

          if (
            user.newMessages.length === 0
            && newMessagesElement
            && newMessagesElement instanceof HTMLElement
          ) {
            newMessagesElement.style.display = 'none';
          } else if (user.newMessages.length > 0 && !newMessagesElement) {
            newMessagesElement = createElement('span', 'new-messages');
            newMessagesElement.textContent = user.newMessages.length.toString();
            userWrapper.append(newMessagesElement);
          } else if (
            user.newMessages.length > 0
            && newMessagesElement
            && newMessagesElement instanceof HTMLElement
          ) {
            newMessagesElement.textContent = user.newMessages.length.toString();
            newMessagesElement.style.display = 'inline';
          }
        }
      }
    });
  }

  updateUserMessages(user: User) {
    this.findOrCreateUserMessageEntry(user.login);
  }

  handleUnreadMessages(message: Message, activeUser: string) {
    if (message.from === activeUser && !message.status.isReaded) {
      const existingUser = this.findExistingUser(activeUser);
      if (existingUser && !existingUser.newMessages.includes(message.id)) {
        existingUser.newMessages.push(message.id);
      }
      this.updateUnreadMessagesNumber();
    }
  }

  private findOrCreateUserMessageEntry(login: string) {
    const existingUser = this.userMessages.find((u) => u.login === login);
    if (!existingUser) {
      const userMessage = { login, newMessages: [] };
      this.userMessages.push(userMessage);
    }
  }

  private findExistingUser(login: string) {
    return this.userMessages.find((u) => u.login === login);
  }
}
