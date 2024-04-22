import { createElement } from '../../Utils/createElement'
import { ModalWindow } from '../Modal'
type HandlerFunction = () => void
type HandlerFunction1 = (id: string, process: string) => void

export class ActiveChat {
  startChatPanel: HTMLDivElement | undefined
  rightInputContainer: HTMLDivElement | undefined
  activeChat: HTMLDivElement | undefined
  mainInput: HTMLInputElement | undefined
  sendButton: HTMLButtonElement | undefined
  modal: ModalWindow = new ModalWindow()
  cancelButton: HTMLButtonElement | undefined
  inputWrapper: HTMLDivElement | undefined

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

    this.inputWrapper = createElement('div', 'input-wrapper')

    this.cancelButton = createElement(
      'button',
      'cancel-button',
      'x',
      'cancelButton',
    )
    this.inputWrapper.append(this.mainInput)
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

    this.rightInputContainer.append(this.inputWrapper, this.sendButton)
  }
  bindSendMessage = (handler: HandlerFunction) => {
    if (this.sendButton) {
      this.sendButton.addEventListener('click', () => handler())
    }
  }

  bindCancelButton = (handler: HandlerFunction) => {
    if (this.cancelButton) {
      this.cancelButton.addEventListener('click', () => handler())
    }
  }

  bindHandleMessage = (handler: HandlerFunction1) => {
    if (!this.activeChat) return
    this.activeChat.addEventListener('contextmenu', (event): void => {
      event.preventDefault()
      if (
        (event.target instanceof HTMLElement &&
          event.target.classList.contains('message-tosend-wrapper')) ||
        (event.target instanceof HTMLElement &&
          event.target.classList.contains('message-tosend')) ||
        (event.target instanceof HTMLElement &&
          event.target.classList.contains('sender')) ||
        (event.target instanceof HTMLElement &&
          event.target.classList.contains('delivered')) ||
        (event.target instanceof HTMLElement &&
          event.target.classList.contains('time-of-sending'))
      ) {
        this.modal = new ModalWindow()
        this.modal.show(event.target)
        const closestElementWithId = event.target.closest('[id]')
        const id = closestElementWithId ? closestElementWithId.id : null
        if (!id) return
        this.modal.on('deleteClicked', (eventData): void => {
          handler(eventData, id)
        })
        this.modal.on('editClicked', (eventData): void => {
          handler(eventData, id)
        })
      }
    })
  }
  hideActiveChat(event: { target: HTMLElement }) {
    if (
      this.activeChat &&
      this.rightInputContainer &&
      this.startChatPanel &&
      event.target
    ) {
      this.activeChat.style.display = 'none'
      this.rightInputContainer.style.display = 'none'
      this.startChatPanel.style.height = '95%'
      this.startChatPanel.textContent = 'Choose a friend to chat with'
    }
  }
  unableSendButton() {
    if (this.sendButton) {
      this.sendButton.classList.add('submit')
      this.sendButton.classList.remove('disabled-submit')
      this.sendButton.disabled = false
    }
  }

  disableSendButton() {
    if (this.sendButton) {
      this.sendButton.classList.remove('submit')
      this.sendButton.classList.add('disabled-submit')
      this.sendButton.disabled = true
    }
  }
}
