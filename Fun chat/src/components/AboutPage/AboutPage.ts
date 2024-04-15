import { createElement } from '../../Utils/createElement'

type HandlerFunction = () => void
export class AboutPage {
  gameArea: HTMLDivElement | undefined
  audio: HTMLAudioElement = new Audio()
  startButton: HTMLButtonElement
  loginButton: HTMLButtonElement

  constructor() {
    this.startButton = createElement('button', 'startButton', 'Main/Login Page')
    this.loginButton = createElement('button', 'startButton', 'Back')
  }

  init() {
    this.gameArea = createElement('div', 'gamearea')
    document.body.append(this.gameArea)
    const container = createElement('div', 'startContainer')

    const welcome = createElement(
      'p',
      'welcomeMessage',
      `Welcome to MrrrrrChat!`,
    )

    const leftPanel = createElement('div', 'leftStartPanel')
    leftPanel.style.cursor = 'pointer'
    leftPanel.addEventListener('click', () => {
      if (this.audio) {
        this.audio.src = 'meow3.mp3'
        this.audio.volume = 0.3
        this.audio.play()
      }
    })
    const rightPanel = createElement('div', 'rightStartPanel')

    this.gameArea.append(container)
    container.append(leftPanel, rightPanel)
    if (this.startButton) {
      rightPanel.append(welcome, this.startButton)
    }
  }

  bindMainPage = (handler: HandlerFunction): void => {
    if (this.startButton) {
      this.startButton.addEventListener('click', () => {
        handler()
      })
    }
  }

  bindLoginPage = (handler: HandlerFunction): void => {
    if (this.loginButton) {
      this.loginButton.addEventListener('click', () => {
        handler()
      })
    }
  }

  hide() {
    if (this.gameArea) {
      this.gameArea.remove()
    }
  }
}
