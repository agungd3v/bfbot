const WebSocket = require('ws')

module.exports = {
    aggregate: (pair, socket) => {
        const symbol = pair
        const ws = new WebSocket(`${process.env.BINANCE_SOCKET}/${symbol}@aggTrade`)
        _buy = []
        _sell = []
        ws.on('message', (data) => {
            if (data) {
                let json = JSON.parse(data)
                json = {...{pair: json.s, markPrice: json.p, isBuyer: json.m, qty: json.q, time: json.T}}
                // socket.emit('aggregate', json)
                json.isBuyer ? _buy.push(parseFloat(json.markPrice)) : _sell.push(parseFloat(json.markPrice))
                // console.log(_buy, 'LONG', _sell, 'SHORT')
                if (_buy.length >= 10 || _sell.length >= 10) {
                    if (_buy.length > _sell.length) {
                        _biggest = Math.max(..._buy)
                        _average = _buy.reduce((x, y) => x + y, 0) / _buy.length
                        _final = _biggest + (_biggest - _average)
                        // console.log(_biggest, 'BUY', _average, 'AVERAGE', _final.toFixed(2), 'FINAL')
                    }
                    if (_buy.length < _sell.length) {
                        _smallest = Math.min(..._sell)
                        _average = _sell.reduce((x, y) => x + y, 0) / _sell.length
                        _final = _smallest - (_average - _smallest)
                        // console.log(_smallest.toFixed(2), 'SELL', _average.toFixed(2), 'AVERAGE', _final.toFixed(2), 'FINAL')
                    }
                    ws.close()
                }
            }
        })
    }
}