import { createElement } from '../../Utils/createElement'

export class NotFoundPage {
  gameArea: HTMLDivElement | undefined
  audio: HTMLAudioElement | undefined

  init() {
    this.audio = new Audio()
    this.gameArea = createElement('div', 'gamearea')
    const container = createElement('div', 'not-found-container')
    const notFoundImg = createElement('img', 'not-found-image')
    notFoundImg.src = 'loginCat2.png'
    notFoundImg.addEventListener('click', () => {
      if (!this.audio) return
      this.audio.src = 'meow7.mp3'
      this.audio.volume = 0.3
      this.audio.play()
    })

    const text = createElement(
      'div',
      'not-found-text',
      'Please, check your URL',
    )
    container.append(notFoundImg, text)
    this.gameArea.append(container)
    document.body.append(this.gameArea)
  }

  hide() {
    if (this.gameArea) {
      this.gameArea.remove()
    }
  }
}
