const http = require('../plugins/http')

const markIndex = async () => {
    try {
        const h = await http.get('/v1/premiumIndex?symbol=BTCUSDT')
        console.log(h)
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    markIndex
}