require('dotenv/config')
const app = require('express')();
const http = require('http').Server(app)
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

const rts = require('./routes')

app.use('/', rts)

io.on('connection', function(socket) {
    _a = require('./services/wss/aggregate')
    _b = require('./services/wss/markprice')
    _c = require('./services/wss/balanceposition')
    _a.aggregate('btcusdt', socket)
    _b.markPrice('btcusdt', socket)
    _c.balancePosition('zsmGSrxapRRu3d5LDteSQ6WCNeeAhxBoLxAqY5VKnM4rVwYUzHSfTVqahtNolCRo', socket)
})

http.listen(process.env.APP_PORT || 3000, function() {
   console.log('listening on *:3000')
})