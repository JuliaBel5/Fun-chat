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
  goToLogin: () => void,
  goToAbout: () => void,
};
export class Start {
  private userAuthData: UserData | undefined;

  private user: string | undefined;

  private password: string | undefined;

  private loader: Loader;

  private props: StartPageProps;

  private main: MainPage;

  private login: LoginForm;

  constructor(props: StartPageProps) {
    this.props = props;
    this.loader = loader;
    this.login = new LoginForm(this.handleSubmit);
    this.main = new MainPage(props);
  }

  init() {
    this.login.init();
    this.login.loginView?.bindGoAboutButton(this.props.goToAbout);
  }

  handleSubmit = (): void => {
    if (!this.isLoginViewValid()) return;

    const { firstNameValue, passwordValue } = this.getInputValues();

    if (this.areCredentialsValid(firstNameValue, passwordValue)) {
      this.setUserAuthData(firstNameValue, passwordValue);
      this.initializeMainPage();
      this.showLoader();
    }
  };

  private initializeMainPage() {
    if (this.main.userList) {
      this.main.userList.user = this.user!;
      sessionStorage.setItem('MrrrChatUser', JSON.stringify(this.userAuthData));
      this.main.id = generateUniqueTimestampID();

      if (this.user && this.password) {
        this.main.webSocketClient.loginUser(this.main.id, this.user, this.password);
      }
    }
  }

  private isLoginViewValid(): boolean {
    return (
      !!this.login.loginView
      && this.login.loginView.firstNameInput instanceof HTMLInputElement
      && this.login.loginView.passwordInput instanceof HTMLInputElement
    );
  }

  private getInputValues() {
    const firstNameValue = this.login.loginView!.firstNameInput.value.trim();
    const passwordValue = this.login.loginView!.passwordInput.value.trim();
    return { firstNameValue, passwordValue };
  }

  private areCredentialsValid(firstName: string, password: string): boolean {
    return !!firstName && !!password && !!this.login.loginView?.gameArea;
  }

  private setUserAuthData(user: string, password: string) {
    this.userAuthData = { user, password, isAuth: false };
    this.user = user;
    this.password = password;
  }

  private showLoader() {
    this.loader.init();
    this.loader.showLoader();
  }

  hide() {
    if (!this.login.loginView) return;
    this.login.loginView.hide();
  }
}
