const WebSocket = require('ws')
const http = require('../../plugins/http')

const balancePosition = (listenKey, socket) => {
    const ws = new WebSocket(`${process.env.BINANCE_SOCKET}/${listenKey}`)

    ws.onopen = () => {
        _p = {
            method: 'SUBSCRIBE',
            params: [
                'ACCOUNT_UPDATE@E',
            ],
            
        }
        ws.send(JSON.stringify(_p))
    }

    ws.on('message', (data) => {
        if (data) {
            let json = JSON.parse(data)
            // json = {...{pair: json.s, markPrice: json.p, time: json.T}}
            // socket.emit('balanceposition', json)
            console.log(json)
        }
    })
}

module.exports = {
    getListenKey: async (req, res) => {
        try {
            _h = await http.post('/v1/listenKey')
            if (_h) {
                balancePosition(_h.listenKey)
                res.status(200).json({message: _h.listenKey})
            }
        } catch (error) {
            res.status(400).json({message: error})
        }
    }
}