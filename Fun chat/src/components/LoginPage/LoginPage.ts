import { createElement, createInputElement } from '../../Utils/createElement'

type HandlerFunction = () => void

export class LoginPage {
  gameArea: HTMLElement | undefined

  firstNameInput: HTMLInputElement | undefined

  firstNameError: HTMLParagraphElement | undefined

  passwordInput: HTMLInputElement | undefined

  passwordError: HTMLParagraphElement | undefined

  loginButton: HTMLButtonElement | undefined

  audio: HTMLAudioElement | undefined

  goToAbout: HTMLButtonElement

  constructor() {
    this.goToAbout = createElement(
      'button',
      'aboutButton',
      'Go to About Page',
      'goToAbout',
    )
  }

  init(): void {
    this.gameArea = createElement('div', 'gamearea')
    document.body.append(this.gameArea)
    this.audio = new Audio()
    const container = createElement('div', 'container')
    const welcome = createElement(
      'p',
      'welcomeMessage',
      'Hi! Enter your name, please!',
    )
    this.loginButton = createElement(
      'button',
      'disabled',
      'Login',
      'loginButton',
    )

    const buttonContainer = createElement('form', 'inputContainer')
    const leftPanel = createElement('div', 'leftPanel')
    leftPanel.style.cursor = 'pointer'
    leftPanel.addEventListener('click', () => {
      if (this.audio) {
        this.audio.src = 'meow4.mp3'
        this.audio.volume = 0.3
        this.audio.play()
      }
    })
    const rightPanel = createElement('div', 'rightPanel')
    const firstNameLabel = createElement('label', 'label', 'Name')
    this.firstNameInput = createInputElement(
      'input',
      'input',
      '',
      'firstName',
      { required: true },
    )
    firstNameLabel.htmlFor = 'firstName'
    this.firstNameError = createElement('p', 'error', '', 'firstNameError')
    const passwordLabel = createElement('label', 'label', 'Password')
    this.passwordInput = createInputElement('input', 'input', '', 'password', {
      required: true,
    })
    this.passwordInput.type = 'password'
    passwordLabel.htmlFor = 'password'
    this.passwordError = createElement('p', 'error', '', 'passwordError')

    this.gameArea.append(container)
    container.append(leftPanel, rightPanel)
    rightPanel.append(welcome, buttonContainer, this.goToAbout)
    this.loginButton.disabled = true

    buttonContainer.append(
      firstNameLabel,
      this.firstNameInput,
      this.firstNameError,
      passwordLabel,
      this.passwordInput,
      this.passwordError,
      this.loginButton,
    )

    this.firstNameInput.addEventListener('invalid', (e: Event) => {
      ;(e.target as HTMLInputElement).setCustomValidity(
        'Please enter your first name.',
      )
    })
    this.firstNameInput.addEventListener('input', (e: Event) => {
      ;(e.target as HTMLInputElement).setCustomValidity('')
    })

    this.passwordInput.addEventListener('invalid', (e: Event) => {
      ;(e.target as HTMLInputElement).setCustomValidity(
        'Please enter your last name.',
      )
    })
    this.passwordInput.addEventListener('input', (e: Event) => {
      ;(e.target as HTMLInputElement).setCustomValidity('')
    })
  }

  bindFirstNameInput(handler: HandlerFunction): void {
    if (this.firstNameInput instanceof HTMLInputElement) {
      this.firstNameInput.addEventListener('input', () => {
        handler()
      })
    }
  }

  bindpasswordInput(handler: HandlerFunction): void {
    if (this.passwordInput instanceof HTMLInputElement) {
      this.passwordInput.addEventListener('input', () => {
        handler()
      })
    }
  }

  bindSubmit(handler: HandlerFunction): void {
    if (this.loginButton) {
      this.loginButton.addEventListener('click', (e) => {
        e.preventDefault()
        handler()
      })
    }
  }

  bindGoAboutButton = (handler: HandlerFunction): void => {
    if (this.goToAbout) {
      this.goToAbout.addEventListener('click', () => {
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
