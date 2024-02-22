import { io } from 'socket.io-client';
import BaseSetting from '@config/setting';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

const url = BaseSetting.api.replace('/v1', '');
const socket = io(url, {
  cors: {
    origin: '*',
  },
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 3,
});

function connectAndJoinRoom(getState) {
  const tenant_id = getState().auth.userData?.tenant_id;
  const id = getState().auth.userData?.id;
  if (!socket.connected && tenant_id) {
    socket.connect();
    socket.emit(
      'joinRoom',
      { tenant_id, id, role_slug: 'patient' },
      callBack => {
        console.log('callBack =======>>>', callBack);
      },
    );
  }
}
export const socketMiddleware = () => params => next => action => {
  const { getState } = params;
  const { type } = action;

  switch (type) {
    case 'socket/notification':
      connectAndJoinRoom(getState);
      socket.on('notification', data => {
        Toast.show({
          text1: data.msg,
          type: 'success',
        });
      });
      break;

    case 'socket/connect':
      connectAndJoinRoom(getState);
      socket.on('connect_error', error => {
        console.error('Socket.IO connection error:', error);
      });

      break;
    case 'socket/disconnect':
      socket.disconnect();
      break;

    default:
      break;
  }

  return next(action);
};
