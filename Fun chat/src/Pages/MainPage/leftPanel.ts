import UserStore from '../../Storage/Store';
import { createElement } from '../../Utils/createElement';
import { truncateWithEllipses } from '../../Utils/truncate';
import { CustomEventEmitter, EventMap } from '../../EventEmitter/EventEmitter';
import { Message, UnreadUserMessages, User } from '../../EventEmitter/types';

export class UserList extends CustomEventEmitter<EventMap> {
  leftInputContainer: HTMLDivElement;

  leftInput: HTMLInputElement;

  usersContainer: HTMLDivElement;

  user: string | undefined;

  usersList: HTMLElement[];

  userMessages: UnreadUserMessages[] = [];

  constructor() {
    super();
    this.leftInputContainer = createElement('div', 'search-container');
    this.leftInput = createElement('input', 'left-input', '');
    this.leftInput.addEventListener('input', () => {
      const searchValue = this.leftInput.value.toLowerCase();
      this.filterUsers(searchValue);
    });

    this.usersContainer = createElement('div', 'users-container');
    this.leftInputContainer.append(this.leftInput, this.usersContainer);
    /* const MrrrChatUserData = sessionStorage.getItem('MrrrChatUser');
     if (MrrrChatUserData) {
       this.user = JSON.parse(MrrrChatUserData).firstName;
     } */
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

  public updateActiveUsersList(users: User[]): void {
    this.usersContainer.innerHTML = '';
    this.usersList = [];
    /* const MrrrChatUserData = sessionStorage.getItem('MrrrChatUser');
    if (MrrrChatUserData) {
      this.user = JSON.parse(MrrrChatUserData).firstName;
    } */
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

  public updateInactiveUsersList(users: User[]): void {
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

  updateUserMessages(user: User) {
    const existingUser = this.userMessages.find(
      (u) => u.login === user.login, // && u.newMessages.length === 0,
    );
    if (!existingUser) {
      this.userMessages.push({
        login: user.login,
        newMessages: [],
      });
    }
  }

  handleUnreadMessages(message: Message, activeUser: string) {
    if (message.from === activeUser && !message.status.isReaded) {
      const existingUser = this.userMessages.find(
        (u) => u.login === activeUser,
      );
      if (existingUser && !existingUser.newMessages.includes(message.id)) {
        existingUser.newMessages.push(message.id);
      }
      this.updateUnreadMessagesNumber();
    }
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
}
