const http = require('../plugins/http')
const { createSignature, createSignatureOrder } = require('../helpers/hashing')


module.exports = {
    accountBalance: async (req, res) => {
        try {
            _h = await http.get('/v2/balance?timestamp=' + new Date().getTime() + '&signature=' + createSignature())
            _h = _h.filter(data => data.asset == 'USDT' || data.asset == 'BUSD')
            return res.status(200).json(_h)
        } catch (error) {
            return res.status(400).json({message: error})
        }
    },
    newOrder: async (req, res) => {
        try {
            const { pair, side, quantity, price, decimal } = req.body

            _cso = createSignatureOrder(pair, side, quantity, price, decimal)
            _h = await http.post('/v1/batchOrders?' + _cso.query + '&signature=' + _cso.signature)

            return res.status(200).json(_h)
        } catch (error) {
            return res.status(400).json({message: error})
        }
    }
}