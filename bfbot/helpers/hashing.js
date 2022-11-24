const crypto = require('crypto')

const createSignature = (symbol) => {
    const queryString = 'timestamp=' + new Date().getTime()
    return crypto.createHmac('sha256', process.env.BINANCE_SECRET_KEY).update(queryString).digest('hex')
}

const createSignatureOrder = (symbol, position) => {
    _q = ''
    _s = {
        symbol: symbol,
        side: 'BUY',
        positionSide: position,
        type: 'LIMIT',
        timeInForce: 'GTC',
        quantity: '0.00006',
        price: '16700.00001',
        workingType: 'MARK_PRICE',
        recvWindow: 5000,
        timestamp: new Date().getTime()
    }
    for (const [key, value] of Object.entries(_s)) {
        _str = `${key}=${value}`
        _q = _q == '' ? _str : _q +`&${_str}`
    }

    return {
        signature: crypto.createHmac('sha256', process.env.BINANCE_SECRET_KEY).update(_q).digest('hex'),
        query: _q
    }
}

module.exports = {
    createSignature,
    createSignatureOrder
}