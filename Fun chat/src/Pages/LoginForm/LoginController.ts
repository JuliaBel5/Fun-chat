/* eslint-disable no-useless-escape */
/* eslint-disable no-param-reassign */

export class LoginController {
  firstNameInputIsValid: boolean = false;

  passwordInputIsValid: boolean = false;

  alphaHyphenPattern: RegExp = /^[A-Za-z0-9\-]+$/;

  uppercaseLetterPattern: RegExp = /[A-Z]/;

  unableLoginButton: () => void;

  disableLoginButton: () => void;

  constructor(unableLoginButton: () => void, disableLoginButton: () => void) {
    this.unableLoginButton = unableLoginButton;
    this.disableLoginButton = disableLoginButton;
  }

  handleLoginErrors = (firstNameInputValue: string): void => {
    this.firstNameInputIsValid = false;

    if (firstNameInputValue && !this.alphaHyphenPattern.test(firstNameInputValue)) {
      throw new Error('Please, use numbers, English alphabet letters and hyphen');
    } else if (firstNameInputValue
      && !this.uppercaseLetterPattern.test(firstNameInputValue.charAt(0))) {
      throw new Error('Your login name must begin with an uppercase letter');
    } else if (firstNameInputValue && firstNameInputValue.length < 3) {
      throw new Error('Your login name must be at least 3 characters long');
    } else if (firstNameInputValue) {
      this.firstNameInputIsValid = true;
    }

    this.updateSubmitButtonState();
  };

  handlePasswordErrors = (passwordInputValue: string): void => {
    this.passwordInputIsValid = false;

    if (passwordInputValue && !this.alphaHyphenPattern.test(passwordInputValue)) {
      throw new Error('Please, use numbers, English alphabet letters and hyphen');
    } else if (passwordInputValue
      && !this.uppercaseLetterPattern.test(passwordInputValue)) {
      throw new Error('Your password must include at least one uppercase letter');
    } else if (passwordInputValue && passwordInputValue.length < 4) {
      throw new Error('Your password must be at least 4 characters long');
    } else if (passwordInputValue) {
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
