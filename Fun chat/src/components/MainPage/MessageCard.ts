import { createElement } from '../../Utils/createElement'
import { Message } from '../EventEmitter/types'

export class MessageCard {
  costructor() {}

  createMessageElement(message: Message, user: string, activeUser: string) {
    const isFromUser = message.from === user
    const messageElement = createElement(
      'div',
      isFromUser ? 'message-tosend-wrapper' : 'message-toreceive-wrapper',
      '',
      message.id,
    )
    const timeOfSending = createElement('div', 'time-of-sending')
    timeOfSending.textContent = new Date(message.datetime).toLocaleString()
    const text = createElement(
      'div',
      isFromUser ? 'message-tosend' : 'message-toreceive',
      message.text,
    )
    const sender = createElement(
      'div',
      'sender',
      isFromUser ? `You say:` : `${activeUser} says:`,
    )
    const edited = createElement('div', 'edited')
    if (!message.status.isEdited) {
      edited.textContent = ''
    } else {
      edited.textContent = 'Edited'
    }
    messageElement.append(sender, timeOfSending, text, edited)
    if (isFromUser) {
      //сортирую на полученные, отправленные, прочитанные и непрочитанные
      this.createOutcomingData(message, messageElement)
    }
    return messageElement
  }

  createOutcomingData(message: Message, messageElement: HTMLElement) {
    const delivered = createElement('div', 'delivered')
    if (!message.status.isDelivered) {
      delivered.textContent = 'Sent'
    } else if (!message.status.isReaded) {
      delivered.textContent = 'Delivered'
    } else {
      delivered.textContent = 'Read'
    }

    messageElement.append(delivered)

    return messageElement
  }
}
