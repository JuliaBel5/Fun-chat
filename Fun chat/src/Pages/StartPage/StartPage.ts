import type { Loader } from '../../Components/Loader';
import loader from '../../Components/Loader';
import { LoginForm } from '../LoginForm/LoginForm';
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

  login: LoginForm;

  password: string | undefined;

  loader: Loader;

  constructor(props: StartPageProps) {
    this.login = new LoginForm(this.handleSubmit);
    this.main = new MainPage(props);
    this.loader = loader;
  }

  init() {
    this.login.init();
  }

  handleSubmit = (): void => {
    if (
      !this.login.loginView
      || !(this.login.loginView.firstNameInput instanceof HTMLInputElement)
      || !(this.login.loginView.passwordInput instanceof HTMLInputElement)
    ) {
      return;
    }
    const { firstNameInput, passwordInput } = this.login.loginView;
    const firstNameValue = firstNameInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    if (firstNameValue && passwordValue && this.login.loginView.gameArea) {
      this.userAuthData = { user: firstNameValue, password: passwordValue, isAuth: false };
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

  hide() {
    if (!this.login.loginView) return;
    this.login.loginView.hide();
  }
}
