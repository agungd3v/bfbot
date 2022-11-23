require('dotenv/config')
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

app.get('/', function(req, res) {
    res.status(200).json({status: true})
})

io.on('connection', function(socket) {
    const buff = require('./services/wss/aggregate')
    buff.aggregate('btcusdt', socket)
})

http.listen(process.env.APP_PORT || 3000, function() {
   console.log('listening on *:3000')
})