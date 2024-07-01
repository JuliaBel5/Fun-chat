/* eslint-disable no-useless-escape */

export class LoginController {
  alphaHyphenPattern: RegExp = /^[A-Za-z0-9\-]+$/;

  uppercaseLetterPattern: RegExp = /[A-Z]/;

  unableLoginButton: () => void;

  disableLoginButton: () => void;

  constructor(unableLoginButton: () => void, disableLoginButton: () => void) {
    this.unableLoginButton = unableLoginButton;
    this.disableLoginButton = disableLoginButton;
  }

  handleLoginErrors = (firstNameInputValue: string): void => {
    if (firstNameInputValue && !this.alphaHyphenPattern.test(firstNameInputValue)) {
      throw new Error('Please, use numbers, English alphabet letters and hyphen');
    } else if (firstNameInputValue
      && !this.uppercaseLetterPattern.test(firstNameInputValue.charAt(0))) {
      throw new Error('Your login name must begin with an uppercase letter');
    } else if (firstNameInputValue && firstNameInputValue.length < 3) {
      throw new Error('Your login name must be at least 3 characters long');
    }
  };

  handlePasswordErrors = (passwordInputValue: string): void => {
    if (passwordInputValue && !this.alphaHyphenPattern.test(passwordInputValue)) {
      throw new Error('Please, use numbers, English alphabet letters and hyphen');
    } else if (passwordInputValue
      && !this.uppercaseLetterPattern.test(passwordInputValue)) {
      throw new Error('Your password must include at least one uppercase letter');
    } else if (passwordInputValue && passwordInputValue.length < 4) {
      throw new Error('Your password must be at least 4 characters long');
    }
  };
}
