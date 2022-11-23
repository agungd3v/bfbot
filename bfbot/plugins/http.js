const axios = require('axios')

const instance = axios.create({
    baseURL: process.env.BINANCE_API_URL
})

instance.defaults.headers.common['X-MBX-APIKEY'] = process.env.BINANCE_API_KEY
instance.defaults.headers.post['Content-Type'] = 'application/json'

instance.interceptors.request.use(
    function (config) {
        return config
    },
    function (error) {
        throw Promise.reject(error)
    }
)

instance.interceptors.response.use(
    function (response) {
        response = typeof response.data !== undefined ? response.data : response
        return response
    },
    function (error) {
        console.log(error)
        throw error.response.data
    }
)

module.exports = instance