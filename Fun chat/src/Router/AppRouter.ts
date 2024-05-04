import UserStore from '../Storage/Store';
import { AboutPage } from '../Pages/AboutPage/AboutPage';
import type { LoginPage } from '../Pages/LoginPage/LoginPage';
import type { MainPage } from '../Pages/MainPage/MainPage';
import { NotFoundPage } from '../Pages/NotFounPage/NotFoundPage';
import { Start } from '../Pages/StartPage/StartPage';

interface Page {
  init(): void
  hide(): void
}

export class AppRouter {
  private routes: {
    [key: string]: AboutPage | MainPage | Start | LoginPage | NotFoundPage
  };

  private currentPage: Page | undefined;

  about: AboutPage;

  main: MainPage;

  start: Start;

  loginPage: LoginPage | undefined;

  isAuth: boolean;

  notFound: NotFoundPage;

  constructor() {
    window.addEventListener('popstate', (event) => {
      const path = event.state?.path || '/';
      this.navigate(path, 1);
    });

    this.isAuth = false;
    this.about = new AboutPage();
    this.start = new Start({
      navigate: () => this.navigate(),
      goToLogin: () => this.goToLogin(),
    });
    this.loginPage = this.start.login;
    this.main = this.start.main;
    this.notFound = new NotFoundPage();

    this.routes = {
      '/': this.start,
      '/about': this.about,
      '/login': this.start,
      '/main': this.main,
      '/404': this.notFound,
    };

    this.loginPage.bindGoAboutButton(this.goToAbout);

    if (this.main.header.goToAbout) {
      this.main.header.bindGoAboutButton(this.goToAbout);
    }
    this.about.bindMainPage(this.navigateBasedOnSession);
    this.about.bindLoginPage(this.navigateBasedOnSession);

    this.navigate();
  }

  navigate(path?: string, num?: number) {
    if (this.currentPage) {
      this.currentPage.hide();
    }
    if (!path) {
      const currentPath = window.location.pathname;
      this.navigate(currentPath);
      return;
    }

    this.isAuth = this.isUserAuth();

    if ((path === '/login' && this.isAuth) || (path === '/' && this.isAuth)) {
      this.navigate('/main');
      return;
    }

    if ((path === '/main' && !this.isAuth) || (path === '/' && !this.isAuth)) {
      this.navigate('/login');
      return;
    }

    if (!num) {
      if (path) {
        window.history.pushState({ path }, '', path);
      } else {
        window.history.replaceState(
          { path: window.location.pathname },
          '',
          window.location.pathname,
        );
      }
    } else if (num) {
      if (path) {
        window.history.replaceState({ path }, '', path);
      }
    }

    const currentPath = window.location.pathname;
    this.currentPage = this.routes[currentPath] || new NotFoundPage();
    this.currentPage.init();
  }

  goTo(path: string) {
    this.navigate(path);
  }

  goToMain = () => {
    this.navigate('/main');
  };

  goToLogin = () => {
    this.navigate('/login');
  };

  goToAbout = () => {
    this.navigate('/about');
  };

  navigateBasedOnSession = () => {
    const userData = sessionStorage.getItem('MrrrChatUser');

    if (userData) {
      this.navigate('/main');
    } else {
      this.navigate('/login');
    }
  };

  isUserAuth() {
    const MrrrChatUserData = UserStore.getData();
    if (MrrrChatUserData && MrrrChatUserData.isAuth) {
      this.isAuth = true;
    } else {
      this.isAuth = false;
    }
    return this.isAuth;
  }
}

export const router = new AppRouter();
