const { MessageEmbed, MessageAttachment } = require('discord.js')
const CronJob = require('cron').CronJob
const { client, web3 } = require('./app.js')
const { getLatestTransaction } = require('./utils/getLatestTransaction')
const { parseAxieData } = require('./utils/getAxie')
const axieClassProps = require('./assets/json/axie-class-props.json')

module.exports.clockAuction = new CronJob('*/3 * * * * *' /** cron expression for every 3 seconds */, async function () {
    const axieListings = await getLatestTransaction().catch(error => console.trace(error))

    if (!Array.isArray(axieListings) || !axieListings.length) return

    Promise.allSettled(axieListings.map(listing => postListing(listing)))
})

async function postListing(listing) {
    if (listing.decoded.method == 'settleAuction') {
        const txData = await web3.eth.getTransactionReceipt(listing.hash)
        if (!txData?.status) return
    }

    const axie = await parseAxieData(listing)
    if (!axie) return

    const fileAttachment = new MessageAttachment(axie.canvas, 'axieImage.png')

    const axieClassEmoji = axieClassProps[axie.class.toLowerCase()].emoji || ''
    const formattedPrice =
        listing.decoded.method == 'createAuction'
            ? `**${axie.startPrice}** ➡️ **${axie.endPrice} Ξ**\n⏰ <t:${parseInt(Date.now() / 1000) + parseInt(axie.duration)}:R>`
            : `**${axie.bidPrice} Ξ**`

    const axieEmbed = new MessageEmbed()
        .setDescription(`[${axieClassEmoji} Axie #${axie.id}](https://marketplace.axieinfinity.com/axie/${axie.id}) - [Ronin Tx](https://explorer.roninchain.com/tx/${listing.hash})`)
        .addField(`Breed`, `**Breed Count:** ${axie.breedCount}/7\n**Purity:** ${axie.purity}/6\n**Quality:** ${axie.quality}%\n**Birthdate:** <t:${axie.birthDate}:D>`, true)
        .addField(`Price`, formattedPrice, true)
        .addField(`${listing.decoded.method == 'createAuction' ? 'Buyer' : 'Seller'}`, `[Profile](https://marketplace.axieinfinity.com/profile/${listing.from.toLowerCase().replace('0x', 'ronin:')})`, true)
        .setColor(axieClassProps[axie.class.toLowerCase()].color)
        .setTimestamp()
        .setImage('attachment://axieImage.png')

    const channelId = listing.decoded.method == 'createAuction' ? axieClassProps[axie.class].listingChannelId : axieClassProps[axie.class].salesChannelId

    const channel = await client.channels.fetch(channelId)
    channel.send({ embeds: [axieEmbed], files: [fileAttachment] }).catch(error => console.trace(error.message))
}