import { createElement } from '../../Utils/createElement';

type HandlerFunction = () => void;

export class LoginView {
  gameArea: HTMLElement;

  firstNameInput: HTMLInputElement;

  firstNameError: HTMLParagraphElement;

  passwordInput: HTMLInputElement;

  passwordError: HTMLParagraphElement;

  loginButton: HTMLButtonElement;

  audio: HTMLAudioElement;

  goToAbout: HTMLButtonElement;

  constructor(goToAbout: HTMLButtonElement) {
    this.gameArea = createElement('div', 'gamearea');
    document.body.append(this.gameArea);

    this.audio = new Audio();
    const container = createElement('div', 'container');
    const welcome = createElement('p', 'welcomeMessage', 'Hi! Enter your name, please!');
    this.loginButton = createElement('button', 'disabled', 'Login', 'loginButton');

    const buttonContainer = createElement('form', 'inputContainer');
    const leftPanel = createElement('div', 'leftPanel');
    leftPanel.style.cursor = 'pointer';

    const rightPanel = createElement('div', 'rightPanel');
    const firstNameLabel = createElement('label', 'label', 'Name');
    this.firstNameInput = createElement('input', 'input', '', 'firstName', { required: true }) as HTMLInputElement;
    firstNameLabel.htmlFor = 'firstName';
    this.firstNameError = createElement('p', 'error', '', 'firstNameError');
    const passwordLabel = createElement('label', 'label', 'Password');
    this.passwordInput = createElement('input', 'input', '', 'password', { required: true }) as HTMLInputElement;
    this.passwordInput.type = 'password';
    passwordLabel.htmlFor = 'password';
    this.passwordError = createElement('p', 'error', '', 'passwordError');

    this.goToAbout = goToAbout;
    this.gameArea.append(container);
    container.append(leftPanel, rightPanel);
    rightPanel.append(welcome, buttonContainer, this.goToAbout);
    this.loginButton.disabled = true;

    buttonContainer.append(
      firstNameLabel,
      this.firstNameInput,
      this.firstNameError,
      passwordLabel,
      this.passwordInput,
      this.passwordError,
      this.loginButton,
    );

    leftPanel.addEventListener('click', () => {
      this.audio.src = 'meow4.mp3';
      this.audio.volume = 0.3;
      this.audio.play();
    });

    this.firstNameInput.addEventListener('invalid', (e: Event) => {
      (e.target as HTMLInputElement).setCustomValidity('Please enter your first name.');
    });
    this.firstNameInput.addEventListener('input', (e: Event) => {
      (e.target as HTMLInputElement).setCustomValidity('');
    });

    this.passwordInput.addEventListener('invalid', (e: Event) => {
      (e.target as HTMLInputElement).setCustomValidity('Please enter your password.');
    });
    this.passwordInput.addEventListener('input', (e: Event) => {
      (e.target as HTMLInputElement).setCustomValidity('');
    });
  }

  bindFirstNameInput(handler: HandlerFunction): void {
    this.firstNameInput.addEventListener('input', handler);
  }

  bindPasswordInput(handler: HandlerFunction): void {
    this.passwordInput.addEventListener('input', handler);
  }

  bindSubmit(handler: HandlerFunction): void {
    this.loginButton.addEventListener('click', (e) => {
      e.preventDefault();
      handler();
    });
  }

  setLoginError(message: string): void {
    this.firstNameError.textContent = message;
    this.firstNameInput.classList.toggle('error', !!message);
  }

  setPasswordError(message: string): void {
    this.passwordError.textContent = message;
    this.passwordInput.classList.toggle('error', !!message);
  }

  hide(): void {
    this.gameArea.remove();
  }
}
