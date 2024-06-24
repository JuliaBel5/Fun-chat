/* eslint-disable max-len */
import { LoginController } from './LoginController';
import { LoginView } from './LoginView';

type HandlerFunction = () => void;

export class LoginForm {
  loginView: LoginView | undefined;

  loginController: LoginController | undefined;

  handleSubmit: HandlerFunction;

  constructor(handleSubmit: HandlerFunction) {
    this.handleSubmit = handleSubmit;
  }

  init(): void {
    this.loginView = new LoginView();
    this.loginController = new LoginController(this.loginView.unableLoginButton, this.loginView.disableLoginButton);
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

  hide(): void {
    if (!this.loginView) return;
    this.loginView.hide();
  }
}
