import type { Loader } from '../../Components/Loader';
import loader from '../../Components/Loader';
import { LoginPage } from '../LoginPage/LoginPage';
import { MainPage, generateUniqueTimestampID } from '../MainPage/Controller';

interface UserData {
  user: string
  password: string
  isAuth: boolean
}
type StartPageProps = {
  navigate: () => void,
  goToLogin: () => void
};
export class Start {
  private userAuthData: UserData | undefined;

  user: string | undefined;

  main: MainPage;

  login: LoginPage;

  password: string | undefined;

  loader: Loader;

  constructor(props: StartPageProps) {
    this.login = new LoginPage();
    this.main = new MainPage(props);
    this.loader = loader;
  }

  init() {
    this.login.init();
    this.login.bindFirstNameInput(this.handleErrors);
    this.login.bindpasswordInput(this.handleErrors);
    this.login.bindSubmit(this.handleSubmit);
    if (this.login.gameArea) {
      this.login.gameArea.addEventListener('keydown', (event) => {
        if (
          event.key === 'Enter'
          && this.login.loginButton
          && !this.login.loginButton.disabled
        ) {
          event.preventDefault();
          this.handleSubmit();
        }
      });
    }
  }

  handleSubmit = (): void => {
    if (
      !(this.login.firstNameInput instanceof HTMLInputElement)
      || !(this.login.passwordInput instanceof HTMLInputElement)
    ) {
      return;
    }
    const { firstNameInput, passwordInput } = this.login;
    const firstNameValue = firstNameInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    if (firstNameValue && passwordValue && this.login.gameArea) {
      this.userAuthData = { user: '', password: '', isAuth: false };
      this.userAuthData.user = firstNameValue;
      this.userAuthData.password = passwordValue;
      this.userAuthData.isAuth = false;

      this.user = firstNameValue;
      this.password = passwordValue;

      if (this.main.userList) {
        this.main.userList.user = firstNameValue;
        sessionStorage.setItem(
          'MrrrChatUser',
          JSON.stringify(this.userAuthData),
        );
        this.main.id = generateUniqueTimestampID();
        if (this.user && this.password) {
          this.main.webSocketClient.loginUser(
            this.main.id,
            this.user,
            this.password,
          );
        }
        this.loader.init();
        this.loader.showLoader();
      }
    }
  };

  handleErrors = (): void => {
    // eslint-disable-next-line no-useless-escape
    const alphaHyphenPattern = /^[A-Za-z0-9\-]+$/;
    const uppercaseFirstLetterPattern = /^[A-Z]/;

    if (
      this.login.firstNameInput instanceof HTMLInputElement
      && this.login.passwordInput instanceof HTMLInputElement
      && this.login.firstNameError
      && this.login.passwordError
      && this.login.loginButton
    ) {
      this.login.firstNameError.textContent = '';
      this.login.passwordError.textContent = '';
      this.login.loginButton.classList.remove('this.login.loginButton');
      this.login.loginButton.classList.add('disabled');

      if (
        this.login.firstNameInput.value
        && !alphaHyphenPattern.test(this.login.firstNameInput.value)
      ) {
        this.login.firstNameError.textContent = 'Please, use numbers, English alphabet letters and hyphen';
      } else if (
        this.login.firstNameInput.value
        && !uppercaseFirstLetterPattern.test(
          this.login.firstNameInput.value.charAt(0),
        )
      ) {
        this.login.firstNameError.textContent = 'Your login name must begin with an uppercase letter';
      } else if (
        this.login.firstNameInput.value
        && this.login.firstNameInput.value.length < 3
      ) {
        this.login.firstNameError.textContent = 'Your login name must be at least 3 characters long';
      } else if (this.login.firstNameInput.value) {
        this.login.firstNameError.textContent = '';
      }

      if (
        this.login.passwordInput.value
        && !alphaHyphenPattern.test(this.login.passwordInput.value)
      ) {
        this.login.passwordError.textContent = 'Please, use numbers, English alphabet letters and hyphen';
      } else if (
        this.login.passwordInput.value
        && !uppercaseFirstLetterPattern.test(
          this.login.passwordInput.value.charAt(0),
        )
      ) {
        this.login.passwordError.textContent = 'Your password must begin with an uppercase letter';
      } else if (
        this.login.passwordInput.value
        && this.login.passwordInput.value.length < 4
      ) {
        this.login.passwordError.textContent = 'Your password must be at least 4 characters long';
      } else if (this.login.passwordInput.value) {
        this.login.passwordError.textContent = '';
      }

      if (
        this.login.firstNameInput.value
        && this.login.passwordInput.value
        && !this.login.firstNameError.textContent
        && !this.login.passwordError.textContent
      ) {
        this.login.loginButton.classList.remove('disabled');
        this.login.loginButton.classList.add('startButton');
        this.login.loginButton.disabled = false;
      }
    }
  };

  hide() {
    this.login.hide();
  }
}
