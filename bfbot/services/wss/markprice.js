const WebSocket = require('ws')

const symbol = 'btcusdt'
const ws = new WebSocket(`wss://fstream.binance.com/ws/${symbol}@markPrice`)

ws.on('message', (data) => {
    if (data) {
        let json = JSON.parse(data)
        json = {...{pair: json.s, markPrice: json.p}}
        console.log(json)
    }
})