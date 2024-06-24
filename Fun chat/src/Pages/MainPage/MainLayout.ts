import { createElement } from '../../Utils/createElement';
import { ActiveChat } from './ActiveChat';
import { Footer } from './Footer';
import { Header } from './Header';
import { UserList } from './LeftPanel';

export class MainLayout {
  gameArea: HTMLDivElement | undefined;

  header: Header = new Header();

  container: HTMLDivElement | undefined;

  leftPanel: HTMLDivElement | undefined;

  rightPanel: HTMLDivElement | undefined;

  rightInputContainer: HTMLDivElement | undefined;

  leftInput: HTMLInputElement | undefined;

  mainInput: HTMLInputElement | undefined;

  leftInputContainer: HTMLDivElement | undefined;

  sendButton: HTMLButtonElement | undefined;

  activeChat: ActiveChat = new ActiveChat();

  startChatPanel: HTMLDivElement | undefined;

  userList: UserList = new UserList();

  footer: Footer = new Footer();

  init() {
    this.gameArea = createElement('div', 'gamearea');
    document.body.append(this.gameArea);
    this.gameArea.append(this.header.header);

    this.container = createElement('div', 'game-container');
    this.gameArea.append(this.container, this.footer.footer);
    this.leftPanel = createElement('div', 'left-panel');
    this.rightPanel = createElement('div', 'right-panel');

    this.leftPanel.append(this.userList.leftInputContainer);
    if (
      !this.activeChat.startChatPanel
      || !this.activeChat.activeChat
      || !this.activeChat.rightInputContainer
    ) { return; }
    this.rightPanel.append(
      this.activeChat.startChatPanel,
      this.activeChat.activeChat,
      this.activeChat.rightInputContainer,
    );

    this.activeChat.activeChat.style.display = 'none';
    this.activeChat.rightInputContainer.style.display = 'none';
    this.container.append(this.leftPanel, this.rightPanel);
  }

  hide() {
    if (this.gameArea) {
      this.gameArea.remove();
    }
  }
}
