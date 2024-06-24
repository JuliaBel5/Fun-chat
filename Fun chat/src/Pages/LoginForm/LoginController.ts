/* eslint-disable no-param-reassign */

export class LoginController {
  firstNameInputIsValid: boolean;

  passwordInputIsValid: boolean;

  unableLoginButton: () => void;

  disableLoginButton: () => void;

  constructor(unableLoginButton: () => void, disableLoginButton: () => void) {
    this.unableLoginButton = unableLoginButton;
    this.disableLoginButton = disableLoginButton;
    this.firstNameInputIsValid = false;
    this.passwordInputIsValid = false;
  }

  handleLoginErrors = (
    firstNameInputValue: string,
    firstNameError: HTMLElement,
  ): void => {
    // eslint-disable-next-line no-useless-escape
    const alphaHyphenPattern = /^[A-Za-z0-9\-]+$/;
    const uppercaseFirstLetterPattern = /^[A-Z]/;
    this.firstNameInputIsValid = false;
    firstNameError.textContent = '';

    if (firstNameInputValue
      && !alphaHyphenPattern.test(firstNameInputValue)) {
      firstNameError.textContent = 'Please, use numbers, English alphabet letters and hyphen';
    } else if (
      firstNameInputValue
      && !uppercaseFirstLetterPattern.test(firstNameInputValue.charAt(0))
    ) {
      firstNameError.textContent = 'Your login name must begin with an uppercase letter';
    } else if (firstNameInputValue
      && firstNameInputValue.length < 3) {
      firstNameError.textContent = 'Your login name must be at least 3 characters long';
    } else if (firstNameInputValue) {
      firstNameError.textContent = '';
      this.firstNameInputIsValid = true;
    }

    this.updateSubmitButtonState();
  };

  handlePasswordErrors = (
    passwordInputValue: string,
    passwordError: HTMLElement,
  ): void => {
    // eslint-disable-next-line no-useless-escape
    const alphaHyphenPattern = /^[A-Za-z0-9\-]+$/;
    const uppercaseFirstLetterPattern = /^[A-Z]/;
    this.passwordInputIsValid = false;
    passwordError.textContent = '';

    if (passwordInputValue
      && !alphaHyphenPattern.test(passwordInputValue)) {
      passwordError.textContent = 'Please, use numbers, English alphabet letters and hyphen';
    } else if (
      passwordInputValue
      && !uppercaseFirstLetterPattern.test(passwordInputValue.charAt(0))
    ) {
      passwordError.textContent = 'Your password must begin with an uppercase letter';
    } else if (passwordInputValue
      && passwordInputValue.length < 4) {
      passwordError.textContent = 'Your password must be at least 4 characters long';
    } else if (passwordInputValue) {
      passwordError.textContent = '';
      this.passwordInputIsValid = true;
    }
    this.updateSubmitButtonState();
  };

  updateSubmitButtonState = (): void => {
    if (
      (this.firstNameInputIsValid
        && this.passwordInputIsValid)
    ) {
      this.unableLoginButton();
    } else {
      this.disableLoginButton();
    }
  };
}
