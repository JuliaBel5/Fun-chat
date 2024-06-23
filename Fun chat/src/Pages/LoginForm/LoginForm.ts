import { createElement } from '../../Utils/createElement';
import { LoginController } from './LoginController';
import { LoginView } from './LoginView';

type HandlerFunction = () => void;

export class LoginForm {
  loginView: LoginView | undefined;

  loginController: LoginController | undefined;

  goToAbout: HTMLButtonElement;

  handleSubmit: HandlerFunction;

  constructor(handleSubmit: HandlerFunction) {
    this.handleSubmit = handleSubmit;
    this.goToAbout = createElement('button', 'aboutButton', 'Go to About Page', 'goToAbout');
  }

  init(): void {
    this.loginView = new LoginView(this.goToAbout);
    this.loginController = new LoginController(this.loginView);
    this.loginView.bindFirstNameInput(this.loginController.handleLoginErrors);
    this.loginView.bindPasswordInput(this.loginController.handlePasswordErrors);
    this.loginView.bindSubmit(this.handleSubmit);
    if (this.loginView.gameArea) {
      this.loginView.gameArea.addEventListener('keydown', (event) => {
        if (
          event.key === 'Enter'
          && this.loginView
          && this.loginView.loginButton
          && !this.loginView.loginButton.disabled
        ) {
          event.preventDefault();
          this.handleSubmit();
        }
      });
    }
  }

  bindGoAboutButton(handler: HandlerFunction): void {
    this.goToAbout.addEventListener('click', handler);
  }

  hide(): void {
    if (!this.loginView) return;
    this.loginView.hide();
  }
}
