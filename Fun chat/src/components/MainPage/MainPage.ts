import { createElement } from "../../Utils/createElement"
import { showLoader } from "../../Utils/loader"
import { Toast } from "../toast"
import { Validation } from "../validation"
import { Header } from "./header"

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
  user: any
  toast: Toast = new Toast()
  login: any
  validation: Validation  = new Validation()

  constructor() {
 this.header =  new Header()

  }

  init() {
    const MrrrChatUserData = sessionStorage.getItem('MrrrChatUser')
    if (MrrrChatUserData) {
      this.user = JSON.parse(MrrrChatUserData).firstName
       this.toast.bindConfirmButton(this.logout)
       if (this.header.nameContainer) {
       this.header.nameContainer.textContent = `User name: ${this.user}`
       }
       this.startChat() 
 }
}
 

  startChat() {
    this.gameArea = createElement('div', 'gamearea')
    document.body.append(this.gameArea)
    this.gameArea.append(this.header.header)
    this.header.bindLogout(this.confirm)
    this.container = createElement('div', 'game-container')
    this.gameArea.append(this.container)
   this.leftPanel = createElement('div', 'left-panel')
   this.rightPanel = createElement('div', 'right-panel')
   this.leftInputContainer = createElement('div', 'search-container')
   this.rightInputContainer = createElement('div', 'input-container')
   this.leftInput = createElement(
    'input',
    'left-input',
    ''
  )
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

  this.leftInputContainer.append(this.leftInput)
  this.rightInputContainer.append(this.mainInput, this.submitButton)
  this.leftPanel.append(this.leftInputContainer)
  this.rightPanel.append(this.activeChat, this.rightInputContainer)
   this.container.append(this.leftPanel, this.rightPanel)
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
    sessionStorage.removeItem('MrrrChatUser')
    sessionStorage.removeItem('MrrrChatUserData')
    const event = new CustomEvent('logoutSuccessful');
    window.dispatchEvent(event);
   }

  confirm = () => {
    if (this.toast) {
      this.toast.show(`Are you sure you want to logout, ${this.user}?`)
    }
  }
}