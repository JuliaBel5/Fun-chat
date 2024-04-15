export type User = {
  login: string;
  isLogined: boolean;
 };

 export type ThirdPartyUserLogin = {
  id: null;
  type: "USER_EXTERNAL_LOGIN";
  payload: {
     users: User[];
  };
 };

 export type ThirdPartyUserLogout = {
  id: null;
  type: "USER_EXTERNAL_LOGOUT";
  payload: {
     users: User[];
  };
 };
 
export type UserLogin = {
  id: string,
  type: "USER_LOGIN",
  payload: {
    users: User;
 };
};

export type UserLogout = {
  id: string,
  type: "USER_LOGOUT",
  payload: {
    users: User;
 };
};

 export type ActiveUsersList = {
  id: string;
  type: "USER_ACTIVE";
  payload: {
     users: User[];
  };
 };

 export type InactiveUsersList = {
  id: string;
  type: "USER_INACTIVE";
  payload: {
     users: User[];
  };
 };
 export type MessageSent = {
  id: string;
  type: "MSG_SEND";
  payload: {
     message: {
       id: string;
       from: string;
       to: string;
       text: string;
       datetime: number;
       status: {
         isDelivered: boolean;
         isReaded: boolean;
         isEdited: boolean;
       };
     };
  };
 };

 
  export type MessageSentFromUser = {
  id: null,
  type: "MSG_SEND",
  payload: {
    message: {
      id: string,
      from: string,
      to: string,
      text: string,
      datetime: number,
      status: {
        isDelivered: boolean,
        isReaded: boolean,
        isEdited: boolean,
      }
    }
  }
}


export type HistoryOfMessages ={
  id: string,
  type: "MSG_FROM_USER",
  payload: {
    messages: [],
  }
}

export type MessageDelivered = {
  id: null,
  type: "MSG_DELIVER",
  payload: {
    message: {
      id: string,
      status: {
        isDelivered: boolean,
      }
    }
  }
}

export type ReadStatusChange = {
  id: string,
  type: "MSG_READ"
  payload: {
    message: {
      id: string,
      status: {
        isReaded: boolean,
      }
    }
  }
}

export type ReadStatusNotification = {
  id: null,
  type: "MSG_READ"
  payload: {
    message: {
      id: string,
      status: {
        isReaded: boolean,
      }
    }
  }
}

export type MessageDeleted = {
  id: string,
  type: "MSG_DELETE"
  payload: {
    message: {
      id: string,
      status: {
        isDeleted: boolean,
      }
    }
  }
}

export type MessageEdited = {
  id: string,
  type: "MSG_EDIT"
  payload: {
    message: {
      id: string,
      text: string,
      status: {
        isEdited: boolean,
      }
    }
  }
}

export type ErrorMessage = {
  id: string,
  type: "ERROR",
  payload: {
    error: "incorrect payload parameters",
  }
}