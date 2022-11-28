const WebSocket = require('ws')
const http = require('../plugins/http')
const { createSignatureOrder } = require('../helpers/hashing')

const newOrder = async (params) => {
    try {
        _gi = await http.get('/v1/premiumIndex?symbol=' + params.pair)
        if (_gi) {
            _gimc = 0
            if (params.side == 'BUY') {
                _gimc = params.price - ((Math.floor(_gi.markPrice) / 100) * 0.5)
            }
            if (params.side == 'SELL') {
                _gimc = params.price + ((Math.round(_gi.markPrice) / 100) * 0.5)
            }
            _cso = createSignatureOrder(params.pair, params.side, '1.00', _gimc)
            _h = await http.post('/v1/batchOrders?' + _cso.query + '&signature=' + _cso.signature)
            if (_h) {
                console.log('New Order Created!')
            }
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    preOrder: (pair, socket) => {
        const symbol = pair
        const ws = new WebSocket(`${process.env.BINANCE_SOCKET}/${symbol}@aggTrade`)

        _buy = []
        _sell = []
        _deal = {pair: symbol.toUpperCase()}

        ws.on('message', (data) => {
            if (data) {
                let json = JSON.parse(data)
                // socket.emit('aggregate', json)
                json.m ? _buy.push(parseFloat(json.p)) : _sell.push(parseFloat(json.p))
                if (_buy.length >= 10 || _sell.length >= 10) {
                    ws.close()
                    if (_buy.length > _sell.length) {
                        _biggest = Math.max(..._buy)
                        _average = _buy.reduce((x, y) => x + y, 0) / _buy.length
                        _final = _biggest + (_biggest - _average)
                        _deal = {..._deal, ...{side: 'BUY', price: Math.round(_final)}}
                    }
                    if (_buy.length < _sell.length) {
                        _smallest = Math.min(..._sell)
                        _average = _sell.reduce((x, y) => x + y, 0) / _sell.length
                        _final = _smallest - (_average - _smallest)
                        _deal = {..._deal, ...{side: 'SELL', price: Math.floor(_final)}}
                    }

                    return newOrder(_deal)
                }
            }
        })
    }
}