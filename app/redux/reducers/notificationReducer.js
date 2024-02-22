export default notificationReducer = (state, action) => {
  switch (action.type) {
    case 'updateNotification': {
      return {
        ...state,
        notification: action.payload,
      };
    }
    case 'onNotificationOpen': {
      return {
        ...state,
        openedNotification: action.payload,
      };
    }
    case 'updateCountOfNotifications': {
      return {
        ...state,
        countOfNotification: action.payload,
      };
    }
    default:
      return state;
  }
};
