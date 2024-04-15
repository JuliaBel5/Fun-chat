import { AboutPage } from '../components/AboutPage/AboutPage'
import { LoginPage } from '../components/LoginPage/LoginPage'
import { MainPage } from '../components/MainPage/MainPage'
import { NotFoundPage } from '../components/NotFounPage/NotFoundPage'
import { Validation } from '../components/validation'


interface Page {
  init(): void
  hide(): void
}

export class AppRouter {
  private routes: { [key: string]: AboutPage | MainPage | Validation | LoginPage}
  private currentPage: Page | undefined
  about: AboutPage
  main: MainPage
  validation: Validation
  loginPage: LoginPage | undefined

  constructor() {
    window.addEventListener('popstate', () => this.navigate())

    this.about = new AboutPage()
    this.validation = new Validation()
    this.loginPage = this.validation.login
    this.main = this.validation.main

    this.routes = {
      '/': this.validation,
      '/about': this.about,
      '/login': this.validation,
      '/main': this.main,
    }

    this.main.webSocketClient.on('USER_LOGIN', () => this.goToMain())
    this.main.webSocketClient.on('USER_LOGOUT', () => this.goToLogin())

    if (this.loginPage) {
      this.loginPage.bindGoAboutButton(this.goToAbout)
      // this.loginPage.bindSubmit(this.goToMain)
    }
    if (this.main.header.goToAbout) {
      this.main.header.bindGoAboutButton(this.goToAbout)
    }
    this.about.bindMainPage(this.navigateBasedOnSession)
    this.about.bindLoginPage(this.navigateBasedOnSession)
    this.checkSessionAndNavigate()
  }

  navigate(path?: string) {
    if (this.currentPage) {
      this.currentPage.hide()
    }

    if (path) {
      window.history.pushState(path, '', path)
    } else {
      window.history.replaceState(
        window.location.pathname,
        '',
        window.location.pathname,
      )
    }

    const currentPath = window.location.pathname
    this.currentPage = this.routes[currentPath] || new NotFoundPage()
    this.currentPage?.init()
  }

  goTo(path: string) {
    this.navigate(path)
  }

  goToMain = () => {
    this.navigate('/main')
  }

  goToLogin = () => {
    this.navigate('/login')
  }

  goToAbout = () => {
    this.navigate('/about')
  }

  checkSessionAndNavigate = () => {
    const currentPath = window.location.pathname
    const MrrrChatUserData = sessionStorage.getItem('MrrrChatUser')
    if (MrrrChatUserData) {
      this.main.user = JSON.parse(MrrrChatUserData).firstName
      this.main.password = JSON.parse(MrrrChatUserData).password
      if (this.main.user && this.main.password) {
        if (
          currentPath === '/' ||
          currentPath === '/login' ||
          currentPath === '/main'
        ) {
          this.navigate('/main')
        }
      } else {
        this.navigate()
      }
    } else if (currentPath === '/main') {
      this.navigate('/login')
    } else {
      this.navigate()
    }
  }

  navigateBasedOnSession = () => {
    const userData = sessionStorage.getItem('MrrrChatUser')

    if (userData) {
      this.navigate('/main')
    } else {
      this.navigate('/login')
    }
  }
}
