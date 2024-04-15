import { WebSocketClient } from "../../Service/WebSocketClient"
import { createElement } from "../../Utils/createElement"
import { showLoader } from "../../Utils/loader"
import { ActiveUsersList, ErrorMessage, HistoryOfMessages, InactiveUsersList, MessageDeleted, MessageDelivered, MessageEdited, MessageSent, MessageSentFromUser, ReadStatusChange, ReadStatusNotification, ThirdPartyUserLogin, ThirdPartyUserLogout, User, UserLogin, UserLogout } from "../EventEmitter/types"
import { Toast } from "../toast"
import { Header } from "./header"
import { UserList } from "./leftPanel"

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
  submitButton: HTMLButtonElement | undefined
  activeChat: HTMLDivElement | undefined
  user: string | undefined
  toast: Toast = new Toast()
  login: string | undefined

  webSocketClient: WebSocketClient = new WebSocketClient('ws://localhost:4000');
  password: string | undefined
  startChatPanel: HTMLDivElement | undefined
  userList: UserList | undefined
  activeUsers: User[]  | undefined
  inactiveUsers:  User[]  | undefined
  id: string | undefined
  activeChatId: string | undefined

  
  constructor() {
 this.header =  new Header()
 this.userList = new UserList();
 if (!this.webSocketClient.isOpen()) {
  this.webSocketClient.connect();
 }
 this.setupEventListeners();

 this.activeUsers = []
 this.inactiveUsers = []

  }

  init() {
    const MrrrChatUserData = sessionStorage.getItem('MrrrChatUser')
    if (MrrrChatUserData ) {
      this.user = JSON.parse(MrrrChatUserData).firstName
      this.password = JSON.parse(MrrrChatUserData).password
      
      this.toast.bindConfirmButton(this.logout)
       if (this.header.nameContainer) {
       this.header.nameContainer.textContent = `User name: ${this.user}`
       }
       if (this.webSocketClient.isOpen()) {
       this.webSocketClient.getAllAuthUsers()
      this.webSocketClient.getAllUnauthUsers()
       }
       this.startChat()
      }
}

  startChat() {
    if (!this.userList) return
    this.gameArea = createElement('div', 'gamearea')
    document.body.append(this.gameArea)
    this.gameArea.append(this.header.header)
    this.header.bindLogout(this.confirm)
    this.container = createElement('div', 'game-container')
    this.gameArea.append(this.container)
   this.leftPanel = createElement('div', 'left-panel')
   this.rightPanel = createElement('div', 'right-panel')
  
  
   this.startChatPanel = createElement('div', 'start-chat', 'Choose a friend to chat with')
   this.rightInputContainer = createElement('div', 'input-container')
   
  this.activeChat = createElement('div', 'active-chat', 'Start to chat with your friend')
  this.mainInput = createElement(
    'input',
    'main-input',
    ''
  )
  this.mainInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
       event.preventDefault(); 
       this.sendMessage();
    }
   });
 
  this.submitButton = createElement(
    'button',
    'disabled-submit',
    'Send',
    'submitButton'
  )
  this.submitButton.addEventListener('click', () => {
    this.sendMessage();
   });

   this.mainInput.addEventListener('input', () => {
    if (this.mainInput && this.submitButton) {
    if (this.mainInput.value.trim() !== '') {
      this.submitButton.classList.remove('disabled-submit');
      this.submitButton.classList.add('submit')
    } else {
     
      this.submitButton.classList.remove('submit');
      this.submitButton.classList.add('disabled-submit');
   }
  }
  })

  
  this.rightInputContainer.append(this.mainInput, this.submitButton)
  this.leftPanel.append(this.userList.leftInputContainer)
  this.rightPanel.append(this.startChatPanel, this.activeChat, this.rightInputContainer)
  this.activeChat.style.display = 'none'
  this.rightInputContainer.style.display = 'none'
   this.container.append(this.leftPanel, this.rightPanel)
   
   this.userList.on('userClicked', (user) => {
    this.activeChatId = user.login;
    if (this.startChatPanel &&  this.activeChat && this.rightInputContainer) {
    this.startChatPanel.style.height = "35px";
    const status = user.isLogined ? "online" : "offline"
    this.startChatPanel.textContent = `${user.login}, ${status}`
    this.activeChat.style.display = 'flex'
  this.rightInputContainer.style.display = 'flex'
    }
   });
 
}

  hide() {
    if (this.gameArea) {
        this.gameArea.remove();
    }
  }

  sendMessage() {

       if (this.activeChat && this.mainInput ) {
         const messageElement = document.createElement('div');
         messageElement.textContent = this.mainInput.value;
         this.activeChat.appendChild(messageElement);
         this.mainInput.value = '';
       
    } 
   }

   logout = () => {
    if (this.user && this.password) {
      console.log('logout',this.id, this.user, this.password)
    this.webSocketClient.logoutUser(this.id, this.user, this.password)
  }
    sessionStorage.removeItem('MrrrChatUser')
   

  
   }

  confirm = () => {
    if (this.toast) {
      this.toast.show(`Are you sure you want to logout, ${this.user}?`)
    }
  }
 setupEventListeners() {
    this.webSocketClient.on('WEBSOCKET_OPEN', this.sendInitialRequests.bind(this));;
 
 }

 sendInitialRequests() {
  this.webSocketClient.on('USER_LOGIN', this.loginSucces.bind(this))
  this.webSocketClient.on('USER_LOGOUT',this.logoutSucces.bind(this))
  this.webSocketClient.on('USER_ACTIVE', this.updateActiveUsers.bind(this));
  this.webSocketClient.on('USER_INACTIVE', this.updateInactiveUsers.bind(this));
  this.webSocketClient.on('USER_EXTERNAL_LOGIN', this.externalUserLogin.bind(this));
  this.webSocketClient.on('USER_EXTERNAL_LOGOUT', this.externalUserLogout.bind(this))
 if(this.user && this.password) {
   this.id = this.generateUniqueTimestampID()
   this.webSocketClient.loginUser(this.id, this.user, this.password)
  }
  console.log('я здесь')
  this.webSocketClient.getAllAuthUsers()
  this.webSocketClient.getAllUnauthUsers()
 }

public generateUniqueTimestampID() {
  return Date.now() + Math.random().toString(36).substr(2, 9);
}
loginSucces (event: UserLogin) {
console.log('логин прошел успешно')
}
logoutSucces(event: UserLogout) {
  console.log('логаут прошел успешно')
}
  updateActiveUsers(event: ActiveUsersList) {
    this.activeUsers = event.payload.users;
       console.log(this.user)
      if (this.userList) {
     this.userList.updateActiveUsersList(this.activeUsers);
    }
   }
   
   updateInactiveUsers(event: InactiveUsersList) {
    this.inactiveUsers = event.payload.users;
        console.log(this.user)
    if (this.userList) {
    this.userList.updateInactiveUsersList(this.inactiveUsers);
    }
   }

   externalUserLogin(event:ThirdPartyUserLogin) {
  //const newLoggedInUser = event.payload.users[0]
  this.webSocketClient.getAllAuthUsers()
  this.webSocketClient.getAllUnauthUsers()
   }

  externalUserLogout(event:ThirdPartyUserLogout) {
    this.webSocketClient.getAllAuthUsers()
    this.webSocketClient.getAllUnauthUsers()
}
}