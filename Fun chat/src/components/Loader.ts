import { createElement } from '../Utils/createElement';

export class Loader {
  loader: HTMLDivElement | undefined;

  overlay: HTMLDivElement | undefined;

  init() {
    this.loader = createElement('div', 'loader');

    this.loader.addEventListener('click', () => {
      const audio = new Audio();
      audio.src = 'meow2.mp3';
      audio.play();
    });

    this.overlay = createElement('div', 'loading-overlay');
  }

  showLoader = (delay = 300000, message?: string) => {
    if (!this.overlay || !this.loader) return;
    document.body.append(this.overlay, this.loader);
    if (message) {
      const text = createElement('div', 'title', message);
      this.loader.append(text);
    }
    setTimeout(() => {
      if (!this.overlay || !this.loader) return;
      this.loader.remove();
      this.overlay.remove();
    }, delay);
  };

  hideLoader() {
    if (!this.overlay || !this.loader) return;
    this.loader.remove();
    this.overlay.remove();
  }
}
