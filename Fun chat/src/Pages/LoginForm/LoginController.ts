import { LoginView } from './LoginView';

export class LoginController {
  private loginView: LoginView;

  constructor(loginView: LoginView) {
    this.loginView = loginView;
  }

  handleLoginErrors = (): void => {
    // eslint-disable-next-line no-useless-escape
    const alphaHyphenPattern = /^[A-Za-z0-9\-]+$/;
    const uppercaseFirstLetterPattern = /^[A-Z]/;

    if (this.loginView.firstNameInput instanceof HTMLInputElement
      && this.loginView.firstNameError) {
      this.loginView.firstNameError.textContent = '';

      if (this.loginView.firstNameInput.value
        && !alphaHyphenPattern.test(this.loginView.firstNameInput.value)) {
        this.loginView.firstNameError.textContent = 'Please, use numbers, English alphabet letters and hyphen';
      } else if (
        this.loginView.firstNameInput.value
        && !uppercaseFirstLetterPattern.test(this.loginView.firstNameInput.value.charAt(0))
      ) {
        this.loginView.firstNameError.textContent = 'Your login name must begin with an uppercase letter';
      } else if (this.loginView.firstNameInput.value
        && this.loginView.firstNameInput.value.length < 3) {
        this.loginView.firstNameError.textContent = 'Your login name must be at least 3 characters long';
      } else if (this.loginView.firstNameInput.value) {
        this.loginView.firstNameError.textContent = '';
      }

      this.updateSubmitButtonState();
    }
  };

  handlePasswordErrors = (): void => {
    // eslint-disable-next-line no-useless-escape
    const alphaHyphenPattern = /^[A-Za-z0-9\-]+$/;
    const uppercaseFirstLetterPattern = /^[A-Z]/;

    if (this.loginView.passwordInput instanceof HTMLInputElement && this.loginView.passwordError) {
      this.loginView.passwordError.textContent = '';

      if (this.loginView.passwordInput.value
        && !alphaHyphenPattern.test(this.loginView.passwordInput.value)) {
        this.loginView.passwordError.textContent = 'Please, use numbers, English alphabet letters and hyphen';
      } else if (
        this.loginView.passwordInput.value
        && !uppercaseFirstLetterPattern.test(this.loginView.passwordInput.value.charAt(0))
      ) {
        this.loginView.passwordError.textContent = 'Your password must begin with an uppercase letter';
      } else if (this.loginView.passwordInput.value
        && this.loginView.passwordInput.value.length < 4) {
        this.loginView.passwordError.textContent = 'Your password must be at least 4 characters long';
      } else if (this.loginView.passwordInput.value) {
        this.loginView.passwordError.textContent = '';
      }

      this.updateSubmitButtonState();
    }
  };

  private updateSubmitButtonState(): void {
    if (
      this.loginView.firstNameInput.value
      && this.loginView.passwordInput.value
      && !this.loginView.firstNameError.textContent
      && !this.loginView.passwordError.textContent
    ) {
      this.loginView.loginButton.classList.remove('disabled');
      this.loginView.loginButton.classList.add('startButton');
      this.loginView.loginButton.disabled = false;
    } else {
      this.loginView.loginButton.classList.remove('startButton');
      this.loginView.loginButton.classList.add('disabled');
      this.loginView.loginButton.disabled = true;
    }
  }
}
