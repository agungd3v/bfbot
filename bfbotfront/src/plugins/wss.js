import { io } from 'socket.io-client'

const socket = io('http://localhost:3000')

// export default {
//     install: (app, options) => app.config.globalProperties.$io = socket
// }

export default socket