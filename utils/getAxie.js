const { AxieGene, HexType } = require("agp-npm/dist/axie-gene")
const { axieContract, exchangeContract } = require('../app')
const { version } = require('../config.json')
const { createCardSetCanvas } = require('./createCardCanvas')
const { createAxieCanvas, createOriginAxieCanvas } = require('./createAxieCanvas')
const { address: axieContractAddress } = require('../assets/contracts/axie.json')
const axieClassProps = require('../assets/json/axie-class-props.json')
const cardsList = require('../assets/json/card-abilities.json')

const cardsArray = Object.values(cardsList)
const parts = ['eyes', 'mouth', 'ears', 'horn', 'back', 'tail']
const genes = ['d', 'r1', 'r2']
const probabilities = { d: 0.375, r1: 0.09375, r2: 0.03125 }
const max_quality = 6 * (probabilities.d + probabilities.r1 + probabilities.r2)
const purityBonus = [0, 0, 1, 2, 4, 6, 8]

module.exports.parseAxieData = async (listing) => {
    let axieId
    if (listing.decoded.method == 'createAuction') axieId = listing.decoded.inputs[2]
    else {
        const axieListing = await exchangeContract.methods.getListing(parseInt(listing.decoded.inputs[3])).call().catch(error => console.trace(error))
        if (!axieListing || axieListing?._tokenAddresses[0]?.toLowerCase() !== axieContractAddress) return
        axieId = axieListing._tokenNumbers
    }

    const axieData = await axieContract.methods.axie(parseInt(axieId)).call().catch(error => console.trace(error))

    if (!axieData?.genes['x'] || axieData.genes['x'] == '0') return

    const gene_x = BigInt(axieData?.genes.x).toString(2).padStart(256, '0')
    const gene_y = BigInt(axieData?.genes.y).toString(2).padStart(256, '0')
    const genes = BigInt('0b' + (gene_x + gene_y)).toString(16)

    const axieGene = new AxieGene(genes, HexType.Bit512)

    const stats = this.getStats(axieGene._genes)
    const { quality, purity } = this.getQualityAndPureness(axieGene._genes)
    this.parseTraitsColors(axieGene._genes)

    let axie = {
        id: axieId,
        class: axieGene._genes.cls,
        stats,
        quality,
        purity,
        matronId: axieData.matronId,
        sireId: axieData.sireId,
        birthDate: axieData.birthDate,
        breedCount: axieData.breedCount,
        stage: axieData.stage,
        traits: axieGene._genes,
    }

    if (listing.decoded.method == 'createAuction') {
        const startPrice = Number(parseFloat(listing.decoded.inputs[3]).toFixed(4))
        const endPrice = Number(parseFloat(listing.decoded.inputs[4]).toFixed(4))
        const duration = listing.decoded.inputs[6]

        axie = { duration, startPrice, endPrice, ...axie }
    } else {
        const bidPrice = Number(parseFloat(listing.decoded.inputs[2]).toFixed(4))

        axie = { bidPrice, ...axie }
    }

    if (version == 'origin') {
        axie['potentialPoints'] = this.getPotentialPoints(axie.traits)

        axie['canvas'] = await createOriginAxieCanvas(axie)
    } else {
        const cardSet = getCardSet(axie.traits)
        const cardSetCanvas = await createCardSetCanvas(cardSet)

        axie['canvas'] = await createAxieCanvas(axie, cardSetCanvas)
    }

    return axie
}

module.exports.getStats = (axieTraits) => {
    let stats = { ...axieClassProps[axieTraits.cls].baseStats }

    for (const part of parts) {
        const axiePartClass = axieTraits[part].d.cls
        stats = Object.entries(axieClassProps[axiePartClass].addionalStats).reduce((acc, [key, value]) =>
            // if key is already in map1, add the values, otherwise, create new pair
            ({ ...acc, [key]: (acc[key] || 0) + value })
            , { ...stats })
    }

    return stats
}

module.exports.getPotentialPoints = (axieTraits) => {
    let potentialPoints = {}

    potentialPoints[axieTraits.cls] = 1

    for (const part of parts) {
        const partClass = axieTraits[part].d.cls
        potentialPoints[partClass] = (potentialPoints[partClass] || 0) + 1
    }

    for (const [key, value] of Object.entries(potentialPoints)) {
        potentialPoints[key] = value + purityBonus[value - 1]
    }

    return potentialPoints
}

module.exports.getQualityAndPureness = (axieTraits) => {
    let quality = 0
    let purity = 0

    for (const part of parts) {
        if (axieTraits[part].d.cls == axieTraits.cls) {
            quality += probabilities.d
            purity++
        }

        if (axieTraits[part].r1.cls == axieTraits.cls) {
            quality += probabilities.r1
        }

        if (axieTraits[part].r2.cls == axieTraits.cls) {
            quality += probabilities.r2
        }
    }

    quality = Math.round((quality / max_quality) * 100)

    return { quality, purity }
}

module.exports.parseTraitsColors = (axieTraits) => {
    for (const part of parts) {
        for (const gene of genes) {
            const traitsGene = axieTraits[part][gene]
            traitsGene['color'] = axieClassProps[traitsGene.cls] ? axieClassProps[traitsGene.cls].color : '#ffffff'
        }
    }
}

const cardParts = ['mouth', 'horn', 'back', 'tail']
function getCardSet(traits) {
    return cardParts.map(part => {
        const cls = traits[part].d.cls
        const type = traits[part].d.type
        const name = traits[part].d.name

        const card = cardsArray.find(card => card.partName.includes(name) && card.id.startsWith(`${cls}-${type}`))
        return card
    })
}