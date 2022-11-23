const WebSocket = require('ws')

module.exports = {
    aggregate: (pair, socket) => {
        const symbol = pair
        const ws = new WebSocket(`wss://fstream.binance.com/ws/${symbol}@aggTrade`)

        ws.on('message', (data) => {
            if (data) {
                let json = JSON.parse(data)
                json = {...{pair: json.s, markPrice: json.p, isBuyer: json.m, qty: json.q, time: json.T}}
                socket.emit('aggregate', json)
            }
        })
    }
}