const createSignature = (symbol) => {
    const queryString = 'timestamp=' + new Date().getTime()
    return require('crypto').createHmac('sha256', process.env.BINANCE_SECRET_KEY).update(queryString).digest('hex')
}

module.exports = {
    createSignature
}