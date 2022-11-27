const crypto = require('crypto')

const createSignature = (symbol) => {
    const queryString = 'timestamp=' + new Date().getTime()
    return crypto.createHmac('sha256', process.env.BINANCE_SECRET_KEY).update(queryString).digest('hex')
}

const createSignatureOrder = (symbol, position, quantity, priceMark) => {
    _time = new Date().getTime()
    // Calculate TP/SL
    if (position == 'BUY') {
        _mark = Math.round(priceMark).toFixed(2)
        _stopPriceTP = ((parseFloat(_mark) / 100) * 2.51) + parseFloat(_mark)
        _stopPriceSL = parseFloat(_mark) - ((parseFloat(_mark) / 100) * 1.01)
    }
    if (position == 'SELL') {
        _mark = Math.floor(priceMark).toFixed(2)
        _stopPriceTP = parseFloat(_mark) - ((parseFloat(_mark) / 100) * 2.51)
        _stopPriceSL = ((parseFloat(_mark) / 100) * 1.01) + parseFloat(_mark)
    }
    // Order
    _o = {
        type: 'LIMIT',
        symbol: symbol,
        side: position,
        quantity: quantity,
        price: _mark,
        timeInForce: 'GTC',
        workingType: 'MARK_PRICE'
    }
    // Stop Loss
    _sl = {
        type: 'STOP_MARKET',
        symbol: symbol,
        side: position == 'BUY' ? 'SELL' : 'BUY',
        quantity: quantity,
        stopPrice: _stopPriceSL.toFixed(2),
        workingType: 'MARK_PRICE',
        closePosition: 'true'
    }
    // Take Profit
    _tp = {
        type: 'TAKE_PROFIT_MARKET',
        symbol: symbol,
        side: position == 'BUY' ? 'SELL' : 'BUY',
        quantity: quantity,
        stopPrice: _stopPriceTP.toFixed(2),
        workingType: 'MARK_PRICE',
        closePosition: 'true'
    }
    // Generate query
    console.log(_mark)
    _paramOrder = [_sl, _tp, _o]
    _stringQuery = 'batchOrders=' + encodeURIComponent(JSON.stringify(_paramOrder)) + '&timestamp=' + _time
    // _signature
    _signature = crypto.createHmac('sha256', process.env.BINANCE_SECRET_KEY).update(_stringQuery).digest('hex')

    return {
        signature: _signature,
        query: _stringQuery
    }
}

const queryString = (obj) => {
    _q = ''
    for (const [key, value] of Object.entries(obj)) {
        _str = `${key}=${value}`
        _q = _q == '' ? _str : _q +`&${_str}`
    }

    return _q
}

module.exports = {
    createSignature,
    createSignatureOrder
}