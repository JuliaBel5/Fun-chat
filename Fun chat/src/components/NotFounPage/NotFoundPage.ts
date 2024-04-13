import { createElement } from "../../Utils/createElement"

export class NotFoundPage {
  gameArea: HTMLDivElement | undefined

  constructor() {
   
  }

  init() {
    this.gameArea = createElement('div', 'gamearea', "Please, check your URL")
    document.body.append(this.gameArea)
  }


  hide() {
    if (this.gameArea) {
        this.gameArea.remove();
    }
  }
}