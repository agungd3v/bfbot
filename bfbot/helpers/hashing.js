const crypto = require('crypto')

const signatureOnlySymbol = (symbol) => {
    _queryString = 'timestamp=' + new Date().getTime() + '&symbol=' + symbol.toUpperCase()
    return {
        signature: crypto.createHmac('sha256', process.env.BINANCE_SECRET_KEY).update(_queryString).digest('hex'),
        query: _queryString
    }
}

const signatureOrder = (symbol, position, quantity, priceMark) => {
    _time = new Date().getTime()
    // Calculate TP/SL
    if (position == 'BUY') {
        _mark = Math.floor(priceMark).toFixed(2)
        _stopPriceTP = ((parseFloat(_mark) / 100) * 1.11) + parseFloat(_mark)
        _stopPriceSL = parseFloat(_mark) - ((parseFloat(_mark) / 100) * 1.01)
    }
    if (position == 'SELL') {
        _mark = Math.round(priceMark).toFixed(2)
        _stopPriceTP = parseFloat(_mark) - ((parseFloat(_mark) / 100) * 1.11)
        _stopPriceSL = ((parseFloat(_mark) / 100) * 1.01) + parseFloat(_mark)
    }
    // Order
    _o = {
        type: 'LIMIT',
        symbol: symbol.toUpperCase(),
        side: position,
        quantity: quantity,
        price: _mark,
        timeInForce: 'GTC',
        workingType: 'MARK_PRICE'
    }
    // Stop Loss
    _sl = {
        type: 'STOP_MARKET',
        symbol: symbol.toUpperCase(),
        side: position == 'BUY' ? 'SELL' : 'BUY',
        quantity: quantity,
        stopPrice: _stopPriceSL.toFixed(2),
        workingType: 'MARK_PRICE',
        closePosition: 'true'
    }
    // Take Profit
    _tp = {
        type: 'TAKE_PROFIT_MARKET',
        symbol: symbol.toUpperCase(),
        side: position == 'BUY' ? 'SELL' : 'BUY',
        quantity: quantity,
        stopPrice: _stopPriceTP.toFixed(2),
        workingType: 'MARK_PRICE',
        closePosition: 'true'
    }
    // Generate query
    _paramOrder = [_sl, _tp, _o]
    _stringQuery = 'batchOrders=' + encodeURIComponent(JSON.stringify(_paramOrder)) + '&timestamp=' + _time
    // _signature
    _signature = crypto.createHmac('sha256', process.env.BINANCE_SECRET_KEY).update(_stringQuery).digest('hex')

    return {
        signature: _signature,
        query: _stringQuery
    }
}

module.exports = {
    signatureOnlySymbol,
    signatureOrder
}