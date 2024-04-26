import { createElement } from '../../Utils/createElement'

type HandlerFunction = () => void

export class Header {
  logout: HTMLDivElement | undefined
  header: HTMLElement
  catElement: HTMLImageElement | undefined
  audio: HTMLAudioElement
  goToAbout: HTMLButtonElement | undefined
  nameContainer: HTMLDivElement | undefined
  titleContainer: HTMLDivElement | undefined

  constructor() {
    this.header = createElement('div', 'header')
    this.audio = new Audio()

    this.init()
  }

  init(): void {
    this.nameContainer = createElement('div', 'name-container', 'User name:')
    this.catElement = createElement('img', 'mini-cat')
    this.catElement.src = 'cat7.png'
    this.catElement.style.display = 'inline-block'
    this.catElement.addEventListener('click', () => {
      this.audio.src = 'meow.mp3'
      this.audio.volume = 0.3
      this.audio.play()
    })
    this.titleContainer = createElement('div', 'title-container', 'MrrrrChat')
    const buttonContainer = createElement('div', 'icon-container')

    this.goToAbout = createElement(
      'button',
      'header-button',
      'Go to About Page',
      'goToAbout',
    )

    this.logout = createElement('div', 'logout')
    this.logout.style.cursor = 'pointer'

    buttonContainer.append(this.goToAbout, this.logout)
    this.header.append(
      this.nameContainer,
      this.catElement,
      this.titleContainer,
      buttonContainer,
    )
  }

  bindLogout = (handler: HandlerFunction): void => {
    if (this.logout) {
      this.logout.addEventListener('click', () => {
        this.audio.src = 'meow6.mp3'
        this.audio.volume = 0.3
        // this.audio.play()

        handler()
      })
    }
  }

  remove() {
    this.header.remove()
  }

  bindGoAboutButton = (handler: HandlerFunction): void => {
    if (this.goToAbout) {
      this.goToAbout.addEventListener('click', () => {
        handler()
      })
    }
  }
}
