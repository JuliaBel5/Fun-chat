import { AboutPage } from "../components/AboutPage/AboutPage";
import { LoginPage } from "../components/LoginPage/LoginPage";
import { MainPage } from "../components/MainPage/mainPage";
import { NotFoundPage } from "../components/NotFounPage/NotFoundPage";

export class AppRouter {
  
    private routes: { [key: string]: any } = {
       '/': new LoginPage(),
       '/about': new AboutPage(),
       '/login': new LoginPage(),
       '/main': new MainPage(),
    };
    private currentPage: any;

    constructor() {
       window.addEventListener('popstate', () => this.navigate());
       this.navigate();
    }
   
    navigate(path?: string) {
        if (this.currentPage) {
            // Assuming each page class has a method to hide its content
            this.currentPage.hide();
        }

        if (path) {
            window.history.pushState({}, '', path);
        } else {
            window.history.pushState({}, '', window.location.pathname);
        }

        const currentPath = window.location.pathname;
        this.currentPage = this.routes[currentPath] || new NotFoundPage();
        this.currentPage.init();
    }

  goTo(path: string) {
      this.navigate(path);
  }
   }
   
   const router = new AppRouter();
   