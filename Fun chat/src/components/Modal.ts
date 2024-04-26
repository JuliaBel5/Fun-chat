import { createElement } from '../Utils/createElement';
import { CustomEventEmitter, EventMap } from './EventEmitter/EventEmitter';

type HandlerFunction = () => void;

export class ModalWindow extends CustomEventEmitter<EventMap> {
  modal: HTMLDivElement;

  modalContent: HTMLDivElement;

  deleteButton: HTMLButtonElement;

  editButton: HTMLButtonElement;

  element: HTMLElement | undefined;

  isActive: boolean;

  constructor() {
    super();
    this.modal = createElement('div', 'modal');
    this.modal.style.display = 'none';

    this.modalContent = createElement('div', 'modal-content');

    this.deleteButton = createElement('button', 'modal-button', 'Delete');
    this.deleteButton.addEventListener('click', (event) => this.handleDelete(event));

    this.editButton = createElement('button', 'modal-button', 'Edit');
    this.editButton.addEventListener('click', (event) => this.handleEdit(event));

    this.modalContent.append(this.editButton, this.deleteButton);
    this.modal.append(this.modalContent);
    document.addEventListener('click', (event) => {
      if (event.target !== this.modal) {
        this.hide();
      }
    });
    this.isActive = false;
  }

  show(_event: MouseEvent, element: HTMLElement) {
    this.element = element;
    this.isActive = this.isActive
      ? (this.isActive = false)
      : (this.isActive = true);
    if (this.isActive) {
      this.modal.style.display = 'flex';
      /*    const clientY = event.clientY
      const rect = element.getBoundingClientRect()
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop
      console.log(scrollTop)
      const elementTop = rect.top
      this.modal.style.top = clientY - rect.top + 'px' */
      this.element.append(this.modal);
    }
  }

  hide() {
    this.modal.style.display = 'none';
    //  this.remove()
    this.isActive = false;
  }

  handleDelete(event: MouseEvent) {
    const closestElementWithId = (event.target as HTMLElement).closest('[id]');
    const id = closestElementWithId ? closestElementWithId.id : null;
    if (id) {
      this.emit('deleteClicked', id);
      this.hide();
    }
  }

  handleEdit(event: MouseEvent) {
    const closestElementWithId = (event.target as HTMLElement).closest('[id]');
    const id = closestElementWithId ? closestElementWithId.id : null;
    if (id) {
      this.emit('editClicked', id);
      this.hide();
    }
  }

  bindEditButton = (handler: HandlerFunction) => {
    this.editButton.addEventListener('click', () => handler());
  };

  remove() {
    return this.modal.remove();
  }
}

const modal = new ModalWindow();
export default modal;
