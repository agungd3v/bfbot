const http = require('../plugins/http')
const { createSignature } = require('../helpers/hashing')

const accountBalance = async () => {
    try {
        _h = await http.get('/v2/balance?timestamp=' + new Date().getTime() + '&signature=' + createSignature())
        _h = _h.filter(data => data.asset == 'USDT' || data.asset == 'BUSD')
        console.log(_h)
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    accountBalance
}