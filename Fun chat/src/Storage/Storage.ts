export class SessionStorageApi<D> implements IStore<D> {
  private readonly key: string;

  constructor(key: string) {
    this.key = key;
  }

  public saveData(data: unknown) {
    window.sessionStorage.setItem(this.key, JSON.stringify(data));
  }

  public getData(): D | null {
    const data = window.sessionStorage.getItem(this.key);

    return data ? JSON.parse(data) : data;
  }

  public removeData(): void {
    window.sessionStorage.removeItem(this.key);
  }
}

interface IStore<G> {
  getData: () => G | null

  saveData: (data: G) => void

  removeData: () => void
}
