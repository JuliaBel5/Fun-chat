export interface UserData {
  user: string
  password: string
  isAuth: boolean
}

export type StartPageProps = {
  navigate: () => void,
  goToLogin: () => void,
  goToAbout: () => void,
};
