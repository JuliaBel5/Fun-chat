import { router } from '../../Router/AppRouter'
import ws, { WebSocketClient } from '../../Service/WebSocketClient'
import { createElement } from '../../Utils/createElement'
import {
  ActiveUsersList,
  ErrorMessage,
  HistoryOfMessages,
  InactiveUsersList,
  Message,
  MessageDeleted,
  MessageDelivered,
  MessageEdited,
  MessageSent,
  MessageSentFromUser,
  ReadStatusChange,
  ReadStatusNotification,
  ThirdPartyUserLogin,
  ThirdPartyUserLogout,
  UnreadUserMessages,
  User,
  UserLogin,
  UserLogout,
} from '../EventEmitter/types'
import { Loader } from '../Loader'
import { userData } from '../StartPage'
import { Toast } from '../toast'
import { ActiveChat } from './ActiveChat'
import { Footer } from './footer'
import { Header } from './header'
import { UserList } from './leftPanel'

export class MainPage {
  gameArea: HTMLDivElement | undefined
  header: Header
  container: HTMLDivElement | undefined
  leftPanel: HTMLDivElement | undefined
  rightPanel: HTMLDivElement | undefined
  rightInputContainer: HTMLDivElement | undefined
  leftInput: HTMLInputElement | undefined
  mainInput: HTMLInputElement | undefined
  leftInputContainer: HTMLDivElement | undefined
  sendButton: HTMLButtonElement | undefined
  activeChat: ActiveChat
  user: string | undefined
  toast: Toast = new Toast()
  login: string | undefined

  webSocketClient: WebSocketClient = ws //new WebSocketClient('ws://localhost:4000')
  password: string | undefined
  startChatPanel: HTMLDivElement | undefined
  userList: UserList | undefined
  activeUsers: User[] | undefined
  inactiveUsers: User[] | undefined
  id: string | undefined
  activeChatLogin: string | undefined
  router:
    | import('d:/Julia/AHTML/RS school/Stage 1/St1 2/Fun chat/juliabel5-JSFE2023Q4/Fun chat/src/Router/AppRouter').AppRouter
    | undefined

  isOnline: boolean
  userAuthData: userData = { firstName: '', password: '' }
  footer: Footer = new Footer()
  loader: any
  divider: HTMLDivElement | undefined

  constructor() {
    this.header = new Header()
    this.header.bindLogout(this.confirm)
    this.loader = new Loader()
    this.userList = new UserList()
    this.activeChat = new ActiveChat()
    this.toast.bindConfirmButton(this.logout)
    this.activeChat.bindSendMessage(this.sendMessage.bind(this))
    if (this.activeChat.mainInput) {
      this.activeChat.mainInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          this.sendMessage()
          this.removeDivider()
        }
      })
    }
    if (!this.webSocketClient.isOpen()) {
      this.webSocketClient.connect()
    }

    this.activeUsers = []
    this.inactiveUsers = []
    this.setupEventListeners()
    this.isOnline = false
  }

  init() {
    const MrrrChatUserData = sessionStorage.getItem('MrrrChatUser')
    if (MrrrChatUserData) {
      this.user = JSON.parse(MrrrChatUserData).firstName
      this.password = JSON.parse(MrrrChatUserData).password
      this.userAuthData.firstName = JSON.parse(MrrrChatUserData).firstName
      this.userAuthData.firstName = JSON.parse(MrrrChatUserData).password

      if (this.header.nameContainer) {
        this.header.nameContainer.textContent = `User name: ${this.user}`
      }
      if (this.webSocketClient.isOpen()) {
        this.isOnline = false
        this.loader.hideLoader()
        //  this.webSocketClient.getAllAuthUsers()
        //  this.webSocketClient.getAllUnauthUsers()
      }
      this.startChat()
    }
  }

  startChat() {
    if (!this.userList) return
    this.gameArea = createElement('div', 'gamearea')
    document.body.append(this.gameArea)
    this.gameArea.append(this.header.header)

    this.container = createElement('div', 'game-container')
    this.gameArea.append(this.container, this.footer.footer)
    this.leftPanel = createElement('div', 'left-panel')
    this.rightPanel = createElement('div', 'right-panel')

    this.leftPanel.append(this.userList.leftInputContainer)
    if (
      !this.activeChat.startChatPanel ||
      !this.activeChat.activeChat ||
      !this.activeChat.rightInputContainer
    )
      return
    this.rightPanel.append(
      this.activeChat.startChatPanel,
      this.activeChat.activeChat,
      this.activeChat.rightInputContainer,
    )

    this.activeChat.activeChat.style.display = 'none'
    this.activeChat.rightInputContainer.style.display = 'none'
    this.container.append(this.leftPanel, this.rightPanel)

    this.userList.on('userClicked', (user) => {
      this.activeChatLogin = user.login

      if (
        this.activeChat.startChatPanel &&
        this.activeChat.activeChat &&
        this.activeChat.rightInputContainer
      ) {
        this.activeChat.startChatPanel.style.height = '35px'
        const status = user.isLogined ? 'online' : 'offline'
        this.activeChat.startChatPanel.textContent = `${user.login}, ${status}`
        this.activeChat.activeChat.style.display = 'flex'
        this.activeChat.rightInputContainer.style.display = 'flex'
      }
      if (this.id && this.activeChatLogin) {
        this.webSocketClient.getHistory(this.id, this.activeChatLogin)
      }
    })
    /*  this.userList.usersContainer.addEventListener('click', (event) => {
      if (
        this.activeChat &&
        this.activeChat.activeChat &&
        this.activeChat.rightInputContainer &&
        this.activeChat.startChatPanel &&
        event.target &&
        event.target instanceof HTMLElement &&
        !event.target.classList.contains('user-wrapper')
      ) {
        this.activeChat.activeChat.style.display = 'none'
        this.activeChat.rightInputContainer.style.display = 'none'
        this.activeChat.startChatPanel.style.height = '95%'
      }
    })*/
    this.divider = createElement('div', 'divider')
    this.gameArea.append(this.divider)
    this.divider.style.display = 'none'
    this.activeChat.activeChat.addEventListener(
      'click',
      this.removeDivider.bind(this),
    )
    const boundRemoveDivider = this.removeDivider.bind(this)
    this.activeChat.activeChat.addEventListener('scroll', boundRemoveDivider)
    if (this.activeChat.sendButton) {
      this.activeChat.sendButton.addEventListener(
        'click',
        this.removeDivider.bind(this),
      )
    }
  }

  hide() {
    if (this.gameArea) {
      this.gameArea.remove()
    }
  }

  logout = () => {
    if (this.user && this.password) {
      this.webSocketClient.logoutUser(this.id, this.user, this.password)
    }
  }

  confirm = () => {
    if (this.toast) {
      this.toast.show(`Are you sure you want to logout, ${this.user}?`)
    }
  }

  setupEventListeners() {
    this.webSocketClient.on(
      'WEBSOCKET_OPEN',
      this.sendInitialRequests.bind(this),
    )
    console.log('навесили')
  }

  sendInitialRequests() {
    this.webSocketClient.on('USER_LOGIN', this.loginSucces.bind(this))
    this.webSocketClient.on('USER_LOGOUT', this.logoutSucces.bind(this))
    this.webSocketClient.on('USER_ACTIVE', this.updateActiveUsers.bind(this))
    this.webSocketClient.on(
      'USER_INACTIVE',
      this.updateInactiveUsers.bind(this),
    )
    this.webSocketClient.on(
      'USER_EXTERNAL_LOGIN',
      this.externalUserLogin.bind(this),
    )
    this.webSocketClient.on(
      'USER_EXTERNAL_LOGOUT',
      this.externalUserLogout.bind(this),
    )
    this.webSocketClient.on('WEBSOCKET_CLOSED', this.reconnect.bind(this))
    this.router = router

    this.webSocketClient.on('USER_LOGOUT', () => this.router?.goToLogin())
    this.webSocketClient.on('USER_LOGIN', () => this.router?.navigate())

    this.webSocketClient.on('MSG_SEND', this.receiveMessage.bind(this))
    this.webSocketClient.on('MSG_FROM_USER', this.getHistory.bind(this))
    this.webSocketClient.on('MSG_READ', this.updateUnreadMessages.bind(this))

    if (this.user && this.password && !this.isOnline) {
      this.id = this.generateUniqueTimestampID()
      this.webSocketClient.loginUser(this.id, this.user, this.password)
    }
    //   this.webSocketClient.getAllAuthUsers()
    // this.webSocketClient.getAllUnauthUsers()
  }

  public generateUniqueTimestampID() {
    return Date.now() + Math.random().toString(36).slice(2, 11)
  }

  loginSucces(event: UserLogin) {
    this.isOnline = true
    const MrrrChatTempUserData = sessionStorage.getItem('MrrrChatTempUser')
    if (MrrrChatTempUserData) {
      this.userAuthData.firstName = JSON.parse(MrrrChatTempUserData).firstName
      this.userAuthData.password = JSON.parse(MrrrChatTempUserData).password
      this.user = JSON.parse(MrrrChatTempUserData).firstName
      this.password = JSON.parse(MrrrChatTempUserData).password
      sessionStorage.setItem('MrrrChatUser', JSON.stringify(this.userAuthData))
    }
    sessionStorage.removeItem('MrrrChatTempUser')
    this.webSocketClient.getAllAuthUsers()
    this.webSocketClient.getAllUnauthUsers()
    console.log('логин прошел успешно')
  }

  logoutSucces(event: UserLogout) {
    this.isOnline = false
    this.user = ''
    this.password = ''
    sessionStorage.removeItem('MrrrChatUser')
    console.log('логаут прошел успешно')
  }

  updateActiveUsers(event: ActiveUsersList) {
    this.activeUsers = event.payload.users
    if (this.userList) {
      this.userList.updateActiveUsersList(this.activeUsers)
    }
  }

  updateInactiveUsers(event: InactiveUsersList) {
    this.inactiveUsers = event.payload.users
    if (this.userList) {
      this.userList.updateInactiveUsersList(this.inactiveUsers)
    }
    this.fetchMessageHistory()
  }

  externalUserLogin(event: ThirdPartyUserLogin) {
    const newLoggedInUser = event.payload.user.login
    this.toast.showNotification(`${newLoggedInUser} has just logged in`)
    this.webSocketClient.getAllAuthUsers()
    this.webSocketClient.getAllUnauthUsers()
  }

  externalUserLogout(event: ThirdPartyUserLogout) {
    const newLoggedInUser = event.payload.user.login
    this.toast.showNotification(`${newLoggedInUser} has just logged out`)
    this.webSocketClient.getAllAuthUsers()
    this.webSocketClient.getAllUnauthUsers()
  }
  sendMessage() {
    if (
      this.activeChat.activeChat &&
      this.activeChat.mainInput &&
      this.activeChat.sendButton &&
      this.activeChat.mainInput.value.trim()
    ) {
      const messageElement = createElement('div', 'message-tosend')
      const text = this.activeChat.mainInput.value
      messageElement.textContent = text
      if (
        this.activeChat.activeChat.textContent ===
        'Start to chat with your friend'
      ) {
        this.activeChat.activeChat.textContent = ''
      }
      this.activeChat.activeChat.append(messageElement)
      messageElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
      if (this.id && this.activeChatLogin) {
        this.webSocketClient.sendMessage(this.id, this.activeChatLogin, text)
      }
      this.activeChat.mainInput.value = ''
      this.activeChat.sendButton.classList.remove('submit')
      this.activeChat.sendButton.classList.add('disabled-submit')
    }
  }
  receiveMessage(event: MessageSentFromUser | MessageSent) {
    if (event.payload.message.to !== this.user) return
    if (event.payload.message.from === this.activeChatLogin) {
      const messageElement = createElement('div', 'message-toreceive')
      messageElement.textContent = event.payload.message.text
      if (this.activeChat.activeChat) {
        this.activeChat.activeChat.append(messageElement)
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else if (
      event.payload.message.from !== this.activeChatLogin &&
      this.userList
    ) {
      const existingUser = this.userList.userMessages.find(
        (u) => u.login === event.payload.message.from,
      )
      if (existingUser) existingUser.newMessages.push(event.payload.message.id)
      this.userList.updateUnreadMessagesNumber()
    }
  }
  fetchMessageHistory() {
    if (this.activeUsers && this.inactiveUsers) {
      const arr = this.activeUsers.concat(this.inactiveUsers)
      console.log(arr, 'запрос на фетч')
      arr.forEach((user) => {
        if (user.login !== this.user) {
          if (this.id) {
            this.webSocketClient.getHistory(this.id, user.login)
          }
        }
      })
    }
  }

  getHistory(event: HistoryOfMessages) {
    console.log(event.payload.messages)
    const messages = event.payload.messages

    if (messages.length > 0) {
      const activeUser =
        messages[0].from === this.user ? messages[0].to : messages[0].from
      console.log('вот мой activeUser', activeUser)
      if (activeUser === this.activeChatLogin) {
        if (!this.activeChat.activeChat) return
        if (this.activeChat.activeChat?.style.display !== 'none') {
          this.activeChat.activeChat.textContent = ''

          messages.forEach((message) => {
            const messageElement = createElement('div')
            messageElement.textContent = message.text
            if (message.to === this.user) {
              messageElement.className = 'message-toreceive'
            } else if (message.to === this.activeChatLogin) {
              messageElement.className = 'message-tosend'
            }

            if (!this.activeChat.activeChat) return
            this.activeChat.activeChat.append(messageElement)
            if (this.isFirstNewMessage(message, messages) && this.divider) {
              this.activeChat.activeChat.insertBefore(
                this.divider,
                messageElement,
              )
              const boundRemoveDivider = this.removeDivider.bind(this)
              this.activeChat.activeChat.removeEventListener(
                'scroll',
                boundRemoveDivider,
              )
              messageElement.scrollIntoView({
                behavior: 'instant',
                block: 'start',
              })
              this.divider.style.display = 'flex'

              this.activeChat.activeChat.addEventListener(
                'scroll',
                boundRemoveDivider,
              )
            }
            if (!this.id) return
            if (activeUser === message.from && !message.status.isReaded) {
              this.webSocketClient.markMessageAsRead(this.id, message.id)
            }
          })
        } else if (this.activeChat.activeChat?.style.display === 'none') {
          if (!this.userList) return
          const existingUser = this.userList.userMessages.find(
            (u) => u.login === activeUser,
          )
          console.log(existingUser, 'existing user')
          if (existingUser) {
            console.log('приступаю к фильтрации', messages)
            const filteredArr = messages.filter(
              (message) => !message.status.isReaded && message.to === this.user,
            )

            filteredArr.forEach((el) => {
              if (!existingUser.newMessages.includes(el.id))
                existingUser.newMessages.push(el.id)
            })

            this.userList.updateUnreadMessagesNumber()
          }
        }
      } else if (activeUser !== this.activeChatLogin) {
        if (!this.userList) return
        const existingUser = this.userList.userMessages.find(
          (u) => u.login === activeUser,
        )
        console.log(existingUser, 'existing user')
        if (existingUser) {
          console.log('приступаю к фильтрации', messages)
          const filteredArr = messages.filter(
            (message) => !message.status.isReaded && message.to === this.user,
          )

          filteredArr.forEach((el) => {
            if (!existingUser.newMessages.includes(el.id))
              existingUser.newMessages.push(el.id)
          })

          this.userList.updateUnreadMessagesNumber()
        }
      }
    } else if (messages.length === 0) {
      if (
        this.activeChat.activeChat?.style.display === 'none' ||
        !this.activeChat.activeChat
      ) {
        return
      } else {
        this.activeChat.activeChat.textContent =
          'Start to chat with your friend'
      }
    }
  }

  reconnect() {
    this.loader.init()
    this.loader.showLoader(10000, 'Loading...')
  }

  isFirstNewMessage(message: Message, messages: Message[]) {
    if (!this.divider) {
      this.divider = createElement('div', 'divider')
    }

    const firstNewMessage = messages.find(
      (message) =>
        message.status.isReaded === false && message.to === this.user,
    )
    return message === firstNewMessage
  }

  removeDivider() {
    if (this.divider) {
      console.log('NONE')
      this.divider.style.display = 'none'
    }
  }

  updateUnreadMessages(event: ReadStatusChange | ReadStatusNotification) {
    console.log(event.payload.message)
    const messageId = event.payload.message.id
    console.log(messageId, this.userList?.userMessages)
    if (this.userList) {
      let activeUser: UnreadUserMessages | undefined =
        this.userList.userMessages.find((u) =>
          u.newMessages.includes(messageId),
        )
      console.log('activeUser', activeUser)
      if (activeUser) {
        // Remove the id of the read message from the id array
        const updatedUser: string[] = activeUser.newMessages.filter(
          (id) => id !== messageId,
        )
        activeUser.newMessages = updatedUser
        this.userList.updateUnreadMessagesNumber() // Update the UI
      }
    }
  }
}
