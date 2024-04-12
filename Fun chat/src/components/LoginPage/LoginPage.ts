import { createElement, createInputElement } from "../../Utils/createElement"


type HandlerFunction = () => void

export class LoginPage {
  gameArea: HTMLElement | undefined

  firstNameInput: HTMLInputElement | undefined

  firstNameError: HTMLParagraphElement | undefined

  lastNameInput: HTMLInputElement | undefined

  lastNameError: HTMLParagraphElement | undefined

  loginButton: HTMLButtonElement | undefined

  audio: HTMLAudioElement | undefined

  constructor() {
   
  }

  init(): void {
    this.gameArea = createElement('div', 'gamearea')
    document.body.append(this.gameArea)
    this.audio = new Audio()
    const container = createElement('div', 'container')
    const welcome = createElement(
      'p',
      'welcomeMessage',
      'Hi! Enter your name, please!'
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
    const firstNameLabel = createElement('label', 'label', 'First Name')
    this.firstNameInput = createInputElement(
      'input',
      'input',
      '',
      'firstName',
      { required: true }
    )
    firstNameLabel.htmlFor = 'firstName'
    this.firstNameError = createElement('p', 'error', '', 'firstNameError')
    const lastNameLabel = createElement('label', 'label', 'Surname')
    this.lastNameInput = createInputElement('input', 'input', '', 'lastName', {
      required: true
    })
    lastNameLabel.htmlFor = 'lastName'
    this.lastNameError = createElement('p', 'error', '', 'lastNameError')
    this.loginButton = createElement(
      'button',
      'disabled',
      'Login',
      'loginButton'
    )
    this.gameArea.append(container)
    container.append(leftPanel, rightPanel)
    rightPanel.append(welcome, buttonContainer)
    buttonContainer.append(
      firstNameLabel,
      this.firstNameInput,
      this.firstNameError,
      lastNameLabel,
      this.lastNameInput,
      this.lastNameError,
      this.loginButton
    )

    this.firstNameInput.addEventListener('invalid', (e: Event) => {
      ;(e.target as HTMLInputElement).setCustomValidity(
        'Please enter your first name.'
      )
    })
    this.firstNameInput.addEventListener('input', (e: Event) => {
      ;(e.target as HTMLInputElement).setCustomValidity('')
    })

    this.lastNameInput.addEventListener('invalid', (e: Event) => {
      ;(e.target as HTMLInputElement).setCustomValidity(
        'Please enter your last name.'
      )
    })
    this.lastNameInput.addEventListener('input', (e: Event) => {
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

  bindLastNameInput(handler: HandlerFunction): void {
    if (this.lastNameInput instanceof HTMLInputElement) {
      this.lastNameInput.addEventListener('input', () => {
        handler()
      })
    }
  }

  bindSubmit(handler: HandlerFunction): void {
    if (this.loginButton) {
      this.loginButton.addEventListener('click', () => {
        handler()
      })
    }
  }
  hide() {
    if (this.gameArea) {
        this.gameArea.remove();
    }
}
}
