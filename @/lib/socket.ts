import s, { io } from 'socket.io-client'
import { WEBSOCKET_ENDPOINT } from '../../services/constant'

export const socket = io(WEBSOCKET_ENDPOINT, {
  autoConnect: false,
})

// setTimeout(() => {
//   if (!socket.connected) {
//     socket.connect()
//   }
// }, 1000)
