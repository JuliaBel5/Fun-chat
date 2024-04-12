import { createElement } from './createElement'

export function showLoader(): void {
  const loader = createElement('div', 'loader')
  loader.addEventListener('click', () => {
    const audio = new Audio()
    audio.src = 'meow2.mp3'
    audio.play()
  })

  document.body.append(loader)
  setTimeout(() => {
    loader.remove()
  }, 700)
}
