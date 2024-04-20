import { createElement } from "../../Utils/createElement"
type HandlerFunction = () => void

export class ActiveChat {
  startChatPanel: HTMLDivElement | undefined
  rightInputContainer: HTMLDivElement | undefined
  activeChat: HTMLDivElement | undefined
  mainInput: HTMLInputElement | undefined
  sendButton: HTMLButtonElement | undefined


  constructor() {
      this.init()
  }

  init() {
  this.startChatPanel = createElement(
    'div',
    'start-chat',
    'Choose a friend to chat with',
  )
  this.rightInputContainer = createElement('div', 'input-container')

  this.activeChat = createElement(
    'div',
    'active-chat',
    'Start to chat with your friend',
  )
  this.mainInput = createElement('input', 'main-input', '')
  

  this.sendButton = createElement(
    'button',
    'disabled-submit',
    'Send',
    'sendButton',
  )


  this.mainInput.addEventListener('input', () => {
    if (this.mainInput && this.sendButton) {
      if (this.mainInput.value.trim() !== '') {
        this.sendButton.classList.remove('disabled-submit')
        this.sendButton.classList.add('submit')
      } else {
        this.sendButton.classList.remove('submit')
        this.sendButton.classList.add('disabled-submit')
      }
    }
  })

  this.rightInputContainer.append(this.mainInput, this.sendButton)
}
 bindSendMessage = (handler: HandlerFunction) => {
  if(this.sendButton) {
  this.sendButton.addEventListener('click', () => {
    handler()
  })
   }
 }

}