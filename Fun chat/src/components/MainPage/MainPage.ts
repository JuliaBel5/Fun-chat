import { createElement } from "../../Utils/createElement"

export class MainPage {
  gameArea: HTMLDivElement | undefined

  constructor() {
  
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