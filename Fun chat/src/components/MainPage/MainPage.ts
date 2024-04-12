import { createElement } from "../../Utils/createElement"

export class MainPage {
  gameArea: HTMLDivElement | undefined

  constructor() {
    this.init()
  }

  init() {
    this.gameArea = createElement('div', 'gamearea')
  }

  hide() {
    if (this.gameArea) {
        this.gameArea.remove();
    }
  }
}