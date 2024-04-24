export interface User {
  login: string
  isLogined: boolean
}

export interface ThirdPartyUserLogin {
  id: null
  type: 'USER_EXTERNAL_LOGIN'
  payload: {
    user: {
      login: string
      isLogined: boolean
    }
  }
}

export interface ThirdPartyUserLogout {
  id: null
  type: 'USER_EXTERNAL_LOGOUT'
  payload: {
    user: {
      login: string
      isLogined: boolean
    }
  }
}

export interface UserLogin {
  id: string
  type: 'USER_LOGIN'
  payload: {
    users: User
  }
}

export interface UserLogout {
  id: string
  type: 'USER_LOGOUT'
  payload: {
    users: User
  }
}

export interface ActiveUsersList {
  id: string
  type: 'USER_ACTIVE'
  payload: {
    users: User[]
  }
}

export interface InactiveUsersList {
  id: string
  type: 'USER_INACTIVE'
  payload: {
    users: User[]
  }
}
export interface MessageSent {
  id: string
  type: 'MSG_SEND'
  payload: {
    message: {
      id: string
      from: string
      to: string
      text: string
      datetime: number
      status: {
        isDelivered: boolean
        isReaded: boolean
        isEdited: boolean
      }
    }
  }
}

export interface MessageSentFromUser {
  id: null
  type: 'MSG_SEND'
  payload: {
    message: {
      id: string
      from: string
      to: string
      text: string
      datetime: number
      status: {
        isDelivered: boolean
        isReaded: boolean
        isEdited: boolean
      }
    }
  }
}

export interface HistoryOfMessages {
  id: string
  type: 'MSG_FROM_USER'
  payload: {
    messages: Message[]
  }
}

export interface MessageDelivered {
  id: null
  type: 'MSG_DELIVER'
  payload: {
    message: {
      id: string
      status: {
        isDelivered: boolean
      }
    }
  }
}

export interface ReadStatusChange {
  id: string
  type: 'MSG_READ'
  payload: {
    message: {
      id: string
      status: {
        isReaded: boolean
      }
    }
  }
}

export interface ReadStatusNotification {
  id: null
  type: 'MSG_READ'
  payload: {
    message: {
      id: string
      status: {
        isReaded: boolean
      }
    }
  }
}

export interface MessageDeleted {
  id: string
  type: 'MSG_DELETE'
  payload: {
    message: {
      id: string
      status: {
        isDeleted: boolean
      }
    }
  }
}

export interface MessageEdited {
  id: string
  type: 'MSG_EDIT'
  payload: {
    message: {
      id: string
      text: string
      status: {
        isEdited: boolean
      }
    }
  }
}

export interface ErrorMessage {
  id: string
  type: 'ERROR'
  payload: {
    error: 'incorrect payload parameters'
  }
}

export type MessageStatus = {
  isDelivered: boolean
  isEdited: boolean
  isReaded: boolean
}

export type Message = {
  datetime: number
  from: string
  id: string
  status: MessageStatus
  text: string
  to: string
}

export type UnreadUserMessages = {
  login: string
  newMessages: string[]
}
