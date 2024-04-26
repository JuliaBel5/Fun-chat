export class SessionStorageApi<D> implements IStore<D> {
  /*
     
Ключ для взаимодействия с полем в "SessionStorageApi".*/
  private readonly key: string

  /*
     
Конструктор создания класса "SessionStorageApi".*
@param key ключ взаимодействия с полем "SessionStorageApi".*/
  constructor(key: string) {
    this.key = key
  }

  public saveData(data: unknown) {
    window.sessionStorage.setItem(this.key, JSON.stringify(data))
  }

  public getData(): D | null {
    const data = window.sessionStorage.getItem(this.key)

    return data ? JSON.parse(data) : data
  }

  public removeData(): void {
    window.sessionStorage.removeItem(this.key)
  }
}

/*
 
Интерфейс хранилища данных*/
interface IStore<G> {
  getData: () => G | null

  saveData: (data: G) => void

  removeData: () => void
}
