const WebSocket = require('ws')

module.exports = {
    markPrice: (pair, socket) => {
        const symbol = pair
        const ws = new WebSocket(`wss://fstream.binance.com/ws/${symbol}@markPrice`)

        ws.on('message', (data) => {
            if (data) {
                let json = JSON.parse(data)
                json = {...{pair: json.s, markPrice: json.p, time: json.T}}
                socket.emit('markprice', json)
            }
        })
    }
}