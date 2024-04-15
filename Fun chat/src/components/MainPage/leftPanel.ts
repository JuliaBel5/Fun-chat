import { createElement } from '../../Utils/createElement'
import { CustomEventEmitter, EventMap } from '../EventEmitter/EventEmitter'
import { User } from '../EventEmitter/types'

export class UserList extends CustomEventEmitter<EventMap> {
  leftInputContainer: HTMLDivElement
  leftInput: HTMLInputElement
  usersContainer: HTMLDivElement
  user: string | undefined
  usersList: HTMLElement[]
  constructor() {
    super()
    this.leftInputContainer = createElement('div', 'search-container')
    this.leftInput = createElement('input', 'left-input', '')
    this.usersContainer = createElement('div', 'users-container')
    this.leftInputContainer.append(this.leftInput, this.usersContainer)
    const MrrrChatUserData = sessionStorage.getItem('MrrrChatUser')
    if (MrrrChatUserData) {
      this.user = JSON.parse(MrrrChatUserData).firstName
    }
    this.usersList = []
  }

  public updateActiveUsersList(users: User[]): void {
    if (this.usersContainer) {
      this.usersContainer.innerHTML = ''
      const MrrrChatUserData = sessionStorage.getItem('MrrrChatUser')
      if (MrrrChatUserData) {
        this.user = JSON.parse(MrrrChatUserData).firstName
      }
      users.forEach((user) => {
        if (user.login !== this.user) {
          this.addUser(user)
        }
      })
    }
  }

  public updateInactiveUsersList(users: User[]): void {
    const MrrrChatUserData = sessionStorage.getItem('MrrrChatUser')
    if (MrrrChatUserData) {
      this.user = JSON.parse(MrrrChatUserData).firstName
    }
    users.forEach((user) => {
      if (user.login !== this.user) {
        this.addUser(user)
      }
    })
  }

  addUser(user: User) {
    const userWrapper = createElement('div', 'user-wrapper')
    const userDiv = createElement('div', 'user-status', user.login, user.login)
    const statusCircle = createElement('span', 'status')
    statusCircle.style.backgroundColor = user.isLogined ? 'green' : 'red'
    userWrapper.addEventListener('click', () => {
      this.emit('userClicked', user)
    })
    userWrapper.append(statusCircle, userDiv)
    this.usersContainer.append(userWrapper)
  }
}
