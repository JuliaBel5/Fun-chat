import { createElement } from "../Utils/createElement"

type HandlerFunction = () => void

export class Toast {
  private toastContainer: HTMLElement

  confirmButton: HTMLButtonElement

  cancelButton: HTMLButtonElement

  toast: HTMLDivElement

  buttonContainer: HTMLDivElement

  timeoutId: number | undefined

  audio: HTMLAudioElement

  constructor() {
    this.toastContainer = createElement('div', 'toast-container', '')
    document.body.append(this.toastContainer)
    this.buttonContainer = createElement('div', 'toast-button-container')
    this.confirmButton = createElement('button', 'toast-confirm-button', 'Yes')
    this.cancelButton = createElement('button', 'toast-cancel-button', 'No')
    this.toast = createElement('div', 'toast', '')
    this.buttonContainer.append(this.confirmButton, this.cancelButton)
    this.toastContainer.append(this.toast, this.buttonContainer)
    this.audio = new Audio()
    this.cancelButton.addEventListener('click', () => {
      this.toastContainer.classList.remove('show')
      this.audio.src = 'click.mp3'
      this.audio.play()
      clearTimeout(this.timeoutId)
    })
  }

  public show = (message: string, duration = 3000): void => {
    this.toastContainer.classList.add('show')
    this.toast.textContent = message

    this.timeoutId = setTimeout(() => {
      this.toastContainer.classList.remove('show')
    }, duration)
  }

  bindConfirmButton = (handler: HandlerFunction) =>
    this.confirmButton.addEventListener('click', () => {
      this.audio.src = 'click.mp3'
      this.audio.play()
      handler()
      
      
    })
}
