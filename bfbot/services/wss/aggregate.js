const WebSocket = require('ws')

module.exports = {
    aggregate: (pair, socket) => {
        const symbol = pair
        const ws = new WebSocket(`${process.env.BINANCE_SOCKET}/${symbol}@aggTrade`)
        _r = []
        ws.on('message', (data) => {
            if (data) {
                let json = JSON.parse(data)
                json = {...{pair: json.s, markPrice: json.p, isBuyer: json.m, qty: json.q, time: json.T}}
                // socket.emit('aggregate', json)
                if (_r.length >= 5) {
                    _r.pop()
                    _r = [json, ..._r]
                } else {
                    _r = [json, ..._r]
                }
                if (_r.length == 5) {
                    console.clear()
                    console.table(_r)
                }
            }
        })
    }
}