import { createElement } from '../../Utils/createElement';

type HandlerFunction = () => void;
type HandlerFunctionWithParams = (value: string, errorFiled: HTMLElement) => void;

export class LoginView {
  gameArea: HTMLElement = createElement('div', 'gamearea');

  firstNameInput: HTMLInputElement = createElement('input', 'input', '', 'firstName', { required: true }) as HTMLInputElement;

  firstNameError: HTMLParagraphElement = createElement('p', 'error', '', 'firstNameError');

  passwordInput: HTMLInputElement = createElement('input', 'input', '', 'password', { required: true }) as HTMLInputElement;

  passwordError: HTMLParagraphElement = createElement('p', 'error', '', 'passwordError');

  loginButton: HTMLButtonElement = createElement('button', 'disabled', 'Login', 'loginButton');

  audio: HTMLAudioElement = new Audio();

  goToAbout: HTMLButtonElement = createElement('button', 'aboutButton', 'Go to About Page', 'goToAbout');

  constructor() {
    document.body.append(this.gameArea);
    const container = createElement('div', 'container');
    const welcome = createElement('p', 'welcomeMessage', 'Hi! Enter your name, please!');
    const buttonContainer = createElement('form', 'inputContainer');
    const leftPanel = createElement('div', 'leftPanel');
    leftPanel.style.cursor = 'pointer';
    const rightPanel = createElement('div', 'rightPanel');
    const firstNameLabel = createElement('label', 'label', 'Name');
    firstNameLabel.htmlFor = 'firstName';
    const passwordLabel = createElement('label', 'label', 'Password');
    this.passwordInput.type = 'password';
    passwordLabel.htmlFor = 'password';
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

  bindFirstNameInput(handler: HandlerFunctionWithParams) {
    this.firstNameInput.addEventListener('input', () => handler(this.firstNameInput.value, this.firstNameError));
  }

  bindPasswordInput(handler: HandlerFunctionWithParams) {
    this.passwordInput.addEventListener('input', () => handler(this.passwordInput.value, this.passwordError));
    console.log(this.passwordInput.value);
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

  bindGoAboutButton(handler: HandlerFunction): void {
    this.goToAbout.addEventListener('click', handler);
  }

  unableLoginButton = () => {
    this.loginButton.classList.remove('disabled');
    this.loginButton.classList.add('startButton');
    this.loginButton.disabled = false;
  };

  disableLoginButton = () => {
    this.loginButton.classList.remove('startButton');
    this.loginButton.classList.add('disabled');
    this.loginButton.disabled = true;
  };

  hide(): void {
    this.gameArea.remove();
  }
}