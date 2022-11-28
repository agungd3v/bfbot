require('dotenv/config')
const app = require('express')();
const http = require('http').Server(app)
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

app.use(require('cors')())
app.use(require('body-parser').json())

const rts = require('./routes')

app.use('/', rts)

io.on('connection', function(socket) {
    // user connection here
})
_a = require('./services/order')
_a.preOrder('btcusdt', null)

http.listen(process.env.APP_PORT || 3000, function() {
   console.log('listening on *:3000')
})