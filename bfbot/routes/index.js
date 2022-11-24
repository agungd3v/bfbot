const r = require('express').Router()
const a = require('../services/wss/balanceposition')
const b = require('../services/account')

r.get('/listenkey', a.getListenKey)
r.get('/balance', b.accountBalance)
r.post('/order', b.newOrder)

module.exports = r