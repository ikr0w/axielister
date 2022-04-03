const InputDataDecoder = require('ethereum-input-data-decoder')
const { address: marketplaceContractAddress, abi: marketplaceContractABI } = require('../assets/contracts/marketplace.json')
const { web3 } = require('../app.js')

const txDecoder = new InputDataDecoder(marketplaceContractABI)

let previousBlock
module.exports.getLatestTransaction = async () => {
    const currentBlock = await web3.eth.getBlockNumber().catch(error => console.trace(error))

    if (!currentBlock || currentBlock == previousBlock) return
    previousBlock = currentBlock

    const blockTransactions = await web3.eth.getBlock(currentBlock, true)
        .then(block => {
            if (!block?.transactions?.length) return

            const marketplaceTransactions = block.transactions.filter(tx => tx.to == marketplaceContractAddress) // Filter transactions to marketplace contract only
            if (!marketplaceTransactions.length) return

            return marketplaceTransactions
                .map(transaction => {
                    transaction['decoded'] = txDecoder.decodeData(transaction.input) // Decode input data
                    return transaction
                })
                .filter(transaction => transaction.decoded.method !== null) // Filter transactions to buy and sell only
                .map(transaction => {
                    parseDecodedTransaction(transaction.decoded)
                    return transaction
                })
        }).catch(error => console.trace(error))

    return blockTransactions
}

function parseDecodedTransaction(decodedTx) {
    if (decodedTx.method == 'settleAuction') {
        // Format input data for buy / settleAuction transactions
        decodedTx.inputs[2] = web3.utils.fromWei(decodedTx.inputs[2], 'ether') // _bidAmount
        decodedTx.inputs[3] = decodedTx.inputs[3].toString() // _listingIndex
        decodedTx.inputs[4] = decodedTx.inputs[4].toString() // _listingState
    } else {
        // Format input data for sell / createAuction transactions
        decodedTx.inputs[2] = decodedTx.inputs[2][0].toString() // _tokenNumbers
        decodedTx.inputs[3] = web3.utils.fromWei(decodedTx.inputs[3][0], 'ether') // _startingPrices
        decodedTx.inputs[4] = web3.utils.fromWei(decodedTx.inputs[4][0], 'ether') // _endingPrices
        decodedTx.inputs[6] = decodedTx.inputs[6][0].toString() // _durations
    }
}