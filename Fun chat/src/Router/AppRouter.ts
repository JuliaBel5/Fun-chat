import { AboutPage } from "../components/AboutPage/AboutPage";
import { LoginPage } from "../components/LoginPage/LoginPage";
import { MainPage } from "../components/MainPage/MainPage";
import { NotFoundPage } from "../components/NotFounPage/NotFoundPage";

interface Page {
    init(): void;
    hide(): void;
   }
   

export class AppRouter {
  
    private routes: { [key: string]: any };
    private currentPage: Page | undefined;
    about: AboutPage;
    login: LoginPage;
    main: MainPage;

    constructor() {

        window.addEventListener('popstate', () => this.navigate());
        this.about = new AboutPage()
        this.login =  new LoginPage()
        this.main = new MainPage()
        
        this.routes = {
            '/': new LoginPage(),
            '/about': this.about, 
            '/login': this.login,
            '/main': this.main,
        };
        this.about.bindMainPage(this.goToMain)
        this.about.bindLoginPage(this.goToLogin)
        this.navigate();
    }
   
    navigate(path?: string) {
        if (this.currentPage) {
            this.currentPage.hide();
        }

        if (path) {
            window.history.pushState({}, '', path);
        } else {
            window.history.pushState({}, '', window.location.pathname);
        }

        const currentPath = window.location.pathname;
        this.currentPage = this.routes[currentPath] || new NotFoundPage();
        this.currentPage?.init();
    }

  goTo(path: string) {
      this.navigate(path);
  }
goToMain = () => {
        this.navigate('/main');
    }

    goToLogin = () => {
        this.navigate('/login');
    }

}
   

   