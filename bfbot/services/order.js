const WebSocket = require('ws')
const http = require('../plugins/http')
const { signatureOrder, signatureOnlySymbol } = require('../helpers/hashing')

// for create order with take profit and stop loss
const newOrder = async (params) => {
    try {
        _gi = await http.get('/v1/premiumIndex?symbol=' + params.pair)
        if (_gi) {
            _gimc = 0
            if (params.side == 'BUY') {
                _gimc = params.price - ((Math.floor(_gi.markPrice) / 100) * 0.29)
            }
            if (params.side == 'SELL') {
                _gimc = params.price + ((Math.round(_gi.markPrice) / 100) * 0.29)
            }
            _cso = signatureOrder(params.pair, params.side, '0.09', _gimc)
            _h = await http.post('/v1/batchOrders?' + _cso.query + '&signature=' + _cso.signature)
            if (_h) {
                console.log('New Order Created!')
            }
        }
    } catch (error) {
        console.log(error)
    }
}

// for cancel all orders
const cancelOrders = async (pair) => {
    try {
        _sco = signatureOnlySymbol(pair)
        _http = await http.delete('/v1/allOpenOrders?' + _sco.query + '&signature=' + _sco.signature)
        if (_http) return _http
    } catch (error) {
        console.log(error)
    }
}

// for check any orders open base on value length
const openOrders = async (pair) => {
    try {
        _sco = signatureOnlySymbol(pair)
        _http = await http.get('/v1/openOrders?' + _sco.query + '&signature=' + _sco.signature)
        if (_http) return _http
    } catch (error) {
        console.log(error)
    }
}

// for check any position open base on entryPrice
const openPosition = async (pair) => {
    try {
        _sco = signatureOnlySymbol(pair)
        _http = await http.get('/v2/positionRisk?' + _sco.query + '&signature=' + _sco.signature)
        if (_http) return _http[0]
    } catch (error) {
        
    }
}

const getAggregateTrade = (pair) => {
    // Connect socket market trade @aggTrade
    _wss = new WebSocket(`${process.env.BINANCE_SOCKET}/${pair}@aggTrade`)
    // Default variable buy, sell, deal
    _buy = []
    _sell = []
    _deal = {pair: _symbol}
    // Receive data from socket
    _wss.on('message', (data) => {
        if (data) {
            _json = JSON.parse(data)
            // socket.emit('aggregate', json)
            _json.m ? _buy.push(parseFloat(_json.p)) : _sell.push(parseFloat(_json.p))
            if (_buy.length >= 1000 || _sell.length >= 1000) {
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
                _wss.close()
            }
        }
    })
    // Send data to order function
    _wss.on('close', () => {
        return newOrder(_deal)
    })
}

module.exports = {
    preOrder: async (pair, socket) => {
        // Pair coin to usdt
        _symbol = pair
        // Check open orders
        _oos = await openOrders(_symbol)
        if (_oos.length == 0) {
            return getAggregateTrade(_symbol)
        }
        _opn = await openPosition(_symbol)
        if (_opn) {
            if (_oos.length >= 1) {
                _aol = _oos.filter(data => data.type == 'LIMIT')
                if (_aol.length == 1) {
                    cancelOrders(_symbol)
                    return getAggregateTrade(_symbol)
                }
                if (_opn.entryPrice == '0.0') {
                    cancelOrders(_symbol)
                    return getAggregateTrade(_symbol)
                } else {
                    console.log('Nothing to open...')
                }
            }
        }
    }
}