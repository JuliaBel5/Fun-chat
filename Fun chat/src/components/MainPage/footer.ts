import {
  createElement,
  createLinkedElement,
  createLinkedImage,
} from '../../Utils/createElement'

export class Footer {
  footer: HTMLElement
  catElement: HTMLElement | undefined
  audio: HTMLAudioElement
  nameContainer: HTMLDivElement | undefined
  titleContainer: HTMLDivElement | undefined
  schoolLogo: HTMLElement | undefined
  schoolContainer: HTMLDivElement | undefined

  constructor() {
    this.footer = createElement('div', 'footer')
    this.audio = new Audio()
    this.init()
  }

  init(): void {
    this.schoolContainer = createElement('div', 'school-container')
    this.nameContainer = createElement(
      'div',
      'schoolname-container',
      'RSSchool',
    )
    this.schoolLogo = createLinkedElement(
      'div',
      'school-logo',
      'https://rs.school/courses/javascript-mentoring-program',
    )
    this.catElement = createLinkedImage(
      'img',
      'mini-cat',
      'https://github.com/JuliaBel5',
      'github.png',
    )
    if (!this.catElement) return
    this.catElement.style.display = 'inline-block'
    this.catElement.addEventListener('click', () => {
      this.audio.src = 'meow.mp3'
      this.audio.volume = 0.3
      this.audio.play()
    })
    this.titleContainer = createElement('div', 'school-container', '2024')
    this.schoolContainer.append(this.schoolLogo, this.nameContainer)
    this.footer.append(
      this.schoolContainer,
      this.catElement,
      this.titleContainer,
    )
  }
}
