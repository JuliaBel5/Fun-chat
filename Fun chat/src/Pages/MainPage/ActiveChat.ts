import { createElement } from '../../Utils/createElement';
import modal, { ModalWindow } from '../../Components/Modal';

type HandlerFunction = () => void;

export class ActiveChat {
  startChatPanel: HTMLDivElement | undefined;

  rightInputContainer: HTMLDivElement | undefined;

  activeChat: HTMLDivElement | undefined;

  mainInput: HTMLInputElement | undefined;

  sendButton: HTMLButtonElement | undefined;

  modal: ModalWindow = modal;

  cancelButton: HTMLButtonElement | undefined;

  inputWrapper: HTMLDivElement | undefined;

  constructor() {
    this.init();
  }

  init() {
    this.startChatPanel = createElement(
      'div',
      'start-chat',
      'Choose a friend to chat with',
    );
    this.rightInputContainer = createElement('div', 'input-container');

    this.activeChat = createElement(
      'div',
      'active-chat',
      'Start to chat with your friend',
    );
    this.mainInput = createElement('input', 'main-input', '');

    this.inputWrapper = createElement('div', 'input-wrapper');

    this.cancelButton = createElement(
      'button',
      'cancel-button',
      'x',
      'cancelButton',
    );
    this.inputWrapper.append(this.mainInput);
    this.sendButton = createElement(
      'button',
      'disabled-submit',
      'Send',
      'sendButton',
    );

    this.mainInput.addEventListener('input', () => {
      if (this.mainInput && this.sendButton) {
        if (this.mainInput.value.trim() !== '') {
          this.sendButton.classList.remove('disabled-submit');
          this.sendButton.classList.add('submit');
        } else {
          this.sendButton.classList.remove('submit');
          this.sendButton.classList.add('disabled-submit');
        }
      }
    });

    this.rightInputContainer.append(this.inputWrapper, this.sendButton);
  }

  bindSendMessage = (handler: HandlerFunction) => {
    if (this.sendButton) {
      this.sendButton.addEventListener('click', () => handler());
    }
  };

  bindCancelButton = (handler: HandlerFunction) => {
    if (this.cancelButton) {
      this.cancelButton.addEventListener('click', () => handler());
    }
  };

  bindHandleMessage = () => {
    if (!this.activeChat) return;
    this.activeChat.addEventListener('contextmenu', (event): void => {
      event.preventDefault();
      if (
        (event.target instanceof HTMLElement
          && event.target.classList.contains('message-tosend-wrapper'))
        || (event.target instanceof HTMLElement
          && event.target.classList.contains('message-tosend'))
        || (event.target instanceof HTMLElement
          && event.target.classList.contains('sender'))
        || (event.target instanceof HTMLElement
          && event.target.classList.contains('delivered'))
        || (event.target instanceof HTMLElement
          && event.target.classList.contains('time-of-sending'))
      ) {
        this.modal.show(event, event.target);
      }
    });
  };

  hideActiveChat(target: HTMLElement) {
    if (
      this.activeChat
      && this.rightInputContainer
      && this.startChatPanel
      && target
    ) {
      this.activeChat.style.display = 'none';
      this.rightInputContainer.style.display = 'none';
      this.startChatPanel.style.height = '95%';
      this.startChatPanel.textContent = 'Choose a friend to chat with';
    }
  }

  unableSendButton() {
    if (this.sendButton) {
      this.sendButton.classList.add('submit');
      this.sendButton.classList.remove('disabled-submit');
      this.sendButton.disabled = false;
    }
  }

  disableSendButton() {
    if (this.sendButton) {
      this.sendButton.classList.remove('submit');
      this.sendButton.classList.add('disabled-submit');
      this.sendButton.disabled = true;
    }
  }

  deleteMessage() {
    if (this.mainInput && this.inputWrapper && this.cancelButton) {
      this.mainInput.value = '';
      this.cancelButton.remove();
    }
  }

  editMessage(event: string) {
    const textContainer = document.getElementById(event);
    if (textContainer) {
      const thirdChildElement = textContainer.children[2];
      if (!thirdChildElement.firstChild) return;
      const text = thirdChildElement.firstChild.textContent;
      if (this.mainInput && text && this.cancelButton && this.inputWrapper) {
        this.mainInput.value = text;
        this.inputWrapper.append(this.cancelButton);
        this.unableSendButton();
      }
    }
  }

  cancelEditing() {
    if (this.mainInput && this.cancelButton && this.inputWrapper) {
      this.mainInput.value = '';
      this.cancelButton.remove();
      this.disableSendButton();
    }
  }
}
