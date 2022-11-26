const crypto = require('crypto')

const createSignature = (symbol) => {
    const queryString = 'timestamp=' + new Date().getTime()
    return crypto.createHmac('sha256', process.env.BINANCE_SECRET_KEY).update(queryString).digest('hex')
}

const createSignatureOrder = (symbol, position, quantity, priceMark, decimal) => {
    _time = new Date().getTime()
    // Calculate TP/SL
    if (position == 'BUY') {
        _stopPriceTP = ((parseFloat(priceMark) / 100) * 0.5) + parseFloat(priceMark)
        _stopPriceSL = parseFloat(priceMark) - ((parseFloat(priceMark) / 100) * 0.5)
    }
    if (position == 'SELL') {
        _stopPriceTP = parseFloat(priceMark) - ((parseFloat(priceMark) / 100) * 0.5)
        _stopPriceSL = ((parseFloat(priceMark) / 100) * 0.5) + parseFloat(priceMark)
    }
    // Order
    _o = {
        symbol: symbol,
        side: position,
        type: 'LIMIT',
        timeInForce: 'GTC',
        quantity: quantity,
        price: priceMark
    }
    // Stop Loss
    _sl = {
        symbol: symbol,
        side: position == 'BUY' ? 'SELL' : 'BUY',
        type: 'STOP_MARKET',
        quantity: quantity,
        stopPrice: _stopPriceSL.toFixed(decimal),
        workingType: 'MARK_PRICE',
        reduceOnly: 'true'
    }
    // Take Profit
    _tp = {
        symbol: symbol,
        side: position,
        type: 'TAKE_PROFIT_MARKET',
        quantity: quantity,
        stopPrice: _stopPriceTP.toFixed(decimal),
        workingType: 'MARK_PRICE',
        reduceOnly: 'true'
    }
    // Generate query
    _paramOrder = [_o, _tp, _sl]
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