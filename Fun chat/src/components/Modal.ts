import { createElement } from '../Utils/createElement'
import { CustomEventEmitter, EventMap } from './EventEmitter/EventEmitter'
type HandlerFunction = () => void

export class ModalWindow extends CustomEventEmitter<EventMap>  {
  modal: HTMLDivElement
  modalContent: HTMLDivElement
  deleteButton: HTMLButtonElement
  editButton: HTMLButtonElement
  element: HTMLElement | undefined
  isActive: boolean

  constructor() {
    super()
    this.modal = createElement('div', 'modal')
    this.modal.style.display = 'none'

    this.modalContent = createElement('div', 'modal-content')

    this.deleteButton = createElement('button', 'modal-button', 'Delete')
    this.deleteButton.addEventListener('click', () => this.handleDelete())

    this.editButton = createElement('button', 'modal-button', 'Edit')
    this.editButton.addEventListener('click', () => this.handleEdit())

    this.modalContent.append(this.editButton, this.deleteButton)
    this.modal.append(this.modalContent)

    this.isActive = false
  }

  show(element: HTMLElement) {
    this.element = element
    this.element.append(this.modal)
    this.isActive ? (this.isActive = false) : (this.isActive = true)
    this.isActive
      ? (this.modal.style.display = 'flex')
      : (this.modal.style.display = 'none')
  }

  hide() {
    this.modal.style.display = 'none'
    this.isActive = false
  }

  handleDelete() {
     this.emit('deleteClicked', 'delete');
    this.hide()
  }

  handleEdit() {
    this.emit('editClicked', 'edit');
    this.hide()
  }

  bindEditButton = (handler: HandlerFunction) => {
    this.editButton.addEventListener('click', () => handler())
  }
}
