export interface UserData {
  firstName: string
  password: string
}

export type StartPageProps = {
  navigate: () => void,
  goToLogin: () => void
};
