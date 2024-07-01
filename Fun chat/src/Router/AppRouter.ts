import { AboutPage } from '../Pages/AboutPage/AboutPage';
import type { LoginForm } from '../Pages/LoginForm/LoginForm';
import type { MainPage } from '../Pages/MainPage/Controller';
import { NotFoundPage } from '../Pages/NotFounPage/NotFoundPage';
import { Start } from '../Pages/StartPage/StartPage';
import { isUserAuth } from '../Utils/isUserAuth';

interface Page {
  init(): void
  hide(): void
}

export class AppRouter {
  private routes: {
    [key: string]: AboutPage | MainPage | Start | LoginForm | NotFoundPage
  };

  private currentPage: Page | undefined;

  about: AboutPage;

  main: MainPage;

  start: Start;

  loginForm: LoginForm | undefined;

  isAuth: boolean;

  notFound: NotFoundPage;

  constructor() {
    this.isAuth = false;
    this.about = new AboutPage();
    this.start = new Start({
      navigate: () => this.navigate(),
      goToLogin: () => this.goToLogin(),
      goToAbout: () => this.goToAbout(),
    });
    this.loginForm = this.start.login;
    this.main = this.start.main;
    this.notFound = new NotFoundPage();

    this.routes = {
      '/': this.start,
      '/about': this.about,
      '/login': this.start,
      '/main': this.main,
      '/404': this.notFound,
    };

    this.setupPopStateListener();
    this.bindPageHandlers();
    this.navigate();
  }

  private setupPopStateListener() {
    window.addEventListener('popstate', (event) => {
      const path = event.state?.path || '/';
      this.navigate(path, true);
    });
  }

  private bindPageHandlers() {
    this.about.bindMainPage(this.navigateBasedOnSession);
    this.about.bindLoginForm(this.navigateBasedOnSession);
  }

  navigate(path: string = window.location.pathname, replaceState: boolean = false) {
    if (this.currentPage) {
      this.currentPage.hide();
    }

    this.isAuth = isUserAuth();

    if ((path === '/login' && this.isAuth) || (path === '/' && this.isAuth)) {
      this.navigate('/main');
      return;
    }

    if ((path === '/main' && !this.isAuth) || (path === '/' && !this.isAuth)) {
      this.navigate('/login');
      return;
    }

    if (!replaceState) {
      window.history.pushState({ path }, '', path);
    } else {
      window.history.replaceState({ path }, '', path);
    }

    const currentPath = window.location.pathname;
    this.currentPage = this.routes[currentPath] || new NotFoundPage();
    this.currentPage.init();
  }

  goTo(path: string) {
    this.navigate(path);
  }

  goToMain = () => this.goTo('/main');

  goToLogin = () => this.goTo('/login');

  goToAbout = () => this.goTo('/about');

  navigateBasedOnSession = () => {
    const userData = sessionStorage.getItem('MrrrChatUser');

    if (userData) {
      this.navigate('/main');
    } else {
      this.navigate('/login');
    }
  };
}

export const router = new AppRouter();
