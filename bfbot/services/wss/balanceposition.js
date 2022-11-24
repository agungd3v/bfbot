const WebSocket = require('ws')
const http = require('../../plugins/http')

module.exports = {
    getListenKey: async (req, res) => {
        try {
            _h = await http.post('/v1/listenKey')
            if (_h) {
                res.status(200).json({message: _h.listenKey})
            }
        } catch (error) {
            res.status(400).json({message: error})
        }
    },
    balancePosition: (listenKey, socket) => {
        const ws = new WebSocket(`wss://fstream.binance.com/ws/${listenKey}`)

        ws.on('message', (data) => {
            if (data) {
                let json = JSON.parse(data)
                // json = {...{pair: json.s, markPrice: json.p, time: json.T}}
                socket.emit('balanceposition', json)
            }
        })
    }
}