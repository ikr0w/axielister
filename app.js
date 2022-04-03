const { Client, Intents, Options } = require('discord.js')
const Web3 = require('web3')
const { bot_activity, bot_token } = require('./config.json')
const { abi: axieContractABI, address: axieContractAddress } = require('./assets/contracts/axie.json')
const { abi: exchangeContractABI, address: exchangeContractAddress } = require('./assets/contracts/exchange.json')

const client = new Client({
    makeCache: Options.cacheWithLimits({ ...Options.defaultMakeCacheSettings, MessageManager: { maxSize: 100 } }),
    sweepers: {
        messages: {
            interval: 30,
            lifetime: 300
        }
    },
    restTimeOffset: 500,
    restRequestTimeout: 30000,
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
    ],
    partials: ['CHANNEL']
})

const web3 = new Web3('https://api.roninchain.com/rpc', {
    timeout: 30000, // ms
    clientConfig: {
        // Useful if requests are large
        maxReceivedFrameSize: 100000000,   // bytes - default: 1MiB
        maxReceivedMessageSize: 100000000, // bytes - default: 8MiB

        // Useful to keep a connection alive
        keepalive: true,
        keepaliveInterval: -1 // ms
    },
    reconnect: {
        auto: true,
        delay: 2000, // ms
        maxAttempts: 20,
        onTimeout: true
    }
})

const axieContract = new web3.eth.Contract(axieContractABI, axieContractAddress)
const exchangeContract = new web3.eth.Contract(exchangeContractABI, exchangeContractAddress)

module.exports = { client, web3, axieContract, exchangeContract }

const { clockAuction } = require('./clockAuction.js')

client.on('ready', (client) => {
    client.user.setActivity(bot_activity.text, { type: bot_activity.type })
    console.log(`[${new Date().toLocaleString()}] READY TO LISTEN`)
    clockAuction.start()
})

client.login(bot_token)