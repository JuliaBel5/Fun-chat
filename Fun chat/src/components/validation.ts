
import { showLoader } from '../Utils/loader'
import { LoginPage } from './LoginPage/LoginPage'

type userData = {
  firstName: string
  password: string
}

export class Validation {
 private userAuthData: userData | undefined


  user: string | undefined

  login: LoginPage | undefined
  password: string | undefined
 
  constructor() {
    this.login = new LoginPage()
  }

  init() {

if (this.login) {
      this.login.init()
     
      this.login.bindFirstNameInput(this.handleErrors)
      this.login.bindpasswordInput(this.handleErrors)
      this.login.bindSubmit(this.handleSubmit)
}
    //}
  }

  handleSubmit = (): void => {
    if (
      !this.login ||
      !(this.login.firstNameInput instanceof HTMLInputElement) ||
      !(this.login.passwordInput instanceof HTMLInputElement)
    ) {
      throw new Error("It's not an input element")
    }

    const { firstNameInput, passwordInput } = this.login
    const firstNameValue = firstNameInput.value.trim()
    const passwordValue = passwordInput.value.trim()

    if (firstNameValue && passwordValue) {
      this.userAuthData = {firstName: '', password: ''}
      this.userAuthData.firstName = firstNameValue
      this.userAuthData.password = passwordValue
      this.user = firstNameValue
      this.password = passwordValue
      sessionStorage.setItem('MrrrChatUser', JSON.stringify(this.userAuthData))

      if (this.login.gameArea) {
        this.login.hide()
        showLoader()

        setTimeout(() => {
          this.user = this.userAuthData?.firstName
          this.password = this.userAuthData?.password
          const event = new CustomEvent('loginSuccessful');
          window.dispatchEvent(event);
                    
        }, 700)
      }
    }
  }

 

  handleErrors = (): void => {
    if (this.login) {
      // eslint-disable-next-line no-useless-escape
      const alphaHyphenPattern = /^[A-Za-z\-]+$/
      const uppercaseFirstLetterPattern = /^[A-Z]/

      if (
        this.login.firstNameInput instanceof HTMLInputElement &&
        this.login.passwordInput instanceof HTMLInputElement &&
        this.login.firstNameError &&
        this.login.passwordError &&
        this.login.loginButton
      ) {
        this.login.firstNameError.textContent = ''
        this.login.passwordError.textContent = ''
        this.login.loginButton.classList.remove('this.login.loginButton')
        this.login.loginButton.classList.add('disabled')

        if (
          this.login.firstNameInput.value &&
          !alphaHyphenPattern.test(this.login.firstNameInput.value)
        ) {
          this.login.firstNameError.textContent =
            'Please, use English alphabet letters and hyphen'
        } else if (
          this.login.firstNameInput.value &&
          !uppercaseFirstLetterPattern.test(
            this.login.firstNameInput.value.charAt(0)
          )
        ) {
          this.login.firstNameError.textContent =
            'First name must begin with an uppercase letter'
        } else if (
          this.login.firstNameInput.value &&
          this.login.firstNameInput.value.length < 3
        ) {
          this.login.firstNameError.textContent =
            'First name must be at least 3 characters long'
        } else if (this.login.firstNameInput.value) {
          this.login.firstNameError.textContent = ''
        }

        if (
          this.login.passwordInput.value &&
          !alphaHyphenPattern.test(this.login.passwordInput.value)
        ) {
          this.login.passwordError.textContent =
            'Please, use English alphabet letters and hyphen'
        } else if (
          this.login.passwordInput.value &&
          !uppercaseFirstLetterPattern.test(
            this.login.passwordInput.value.charAt(0)
          )
        ) {
          this.login.passwordError.textContent =
            'Last name must begin with an uppercase letter'
        } else if (
          this.login.passwordInput.value &&
          this.login.passwordInput.value.length < 4
        ) {
          this.login.passwordError.textContent =
            'Last name must be at least 4 characters long'
        } else if (this.login.passwordInput.value) {
          this.login.passwordError.textContent = ''
        }

        if (
          this.login.firstNameInput.value &&
          this.login.passwordInput.value &&
          !this.login.firstNameError.textContent &&
          !this.login.passwordError.textContent
        ) {
          this.login.loginButton.classList.remove('disabled')
          this.login.loginButton.classList.add('startButton')
          this.login.loginButton.disabled = false
          
        }
      }
    }

   
  }


  hide() {
    this.login?.hide()
  }
  
}
