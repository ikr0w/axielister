const { Canvas } = require('canvas-constructor/cairo')
const canvas = require('canvas')
const originCardsList = require('../assets/json/origin-card-abilities.json')

canvas.registerFont('./assets/fonts/Roboto-Black.ttf', { family: 'Roboto' })

const axieCanvas = new Canvas(1475, 985)
const originAxieCanvas = new Canvas(1520, 850)
const parts = ['eyes', 'mouth', 'ears', 'horn', 'back', 'tail']

module.exports.createAxieCanvas = async (axie, cards) => {
    const [template, axieImg] = await Promise.all([
        canvas.loadImage('./assets/images/template.png'),
        canvas.loadImage(`https://storage.googleapis.com/assets.axieinfinity.com/axies/${axie.id}/axie/axie-full-transparent.png`)
            .catch(canvas.loadImage('./assets/images/unknown-axie.png'))
    ])

    axieCanvas.beginPath()

    axieCanvas.printImage(template, 0, 0, 1474, 583)
    axieCanvas.printImage(axieImg, -100, 150, 640, 480)

    // STATS
    axieCanvas.setColor('#ffffff')
    axieCanvas.setTextFont('60px "Roboto Bk"')
    axieCanvas.printText(axie.stats.hp, 120, 130)
    axieCanvas.printText(axie.stats.speed, 285, 130)
    axieCanvas.printText(axie.stats.skill, 540, 130)
    axieCanvas.printText(axie.stats.morale, 720, 130)

    //CARDS
    axieCanvas.printImage(cards[0], 20, 580)
    axieCanvas.printImage(cards[1], 390, 580)
    axieCanvas.printImage(cards[2], 760, 580)
    axieCanvas.printImage(cards[3], 1130, 580)

    let genesPositionY = 270
    let offsetByYPixels = 55

    let dGenesPositionX = 450
    let r1GenesPositionX = 800
    let r2GenesPositionX = 1150

    axieCanvas.setTextFont('35px "Roboto Bk"')
    axieCanvas.setColor('#ffffff')

    // DOMINANT TITLE
    axieCanvas.printText('D', dGenesPositionX, 220)

    // R1 TITLE
    axieCanvas.printText('R1', r1GenesPositionX, 220)

    // R2 TITLE
    axieCanvas.printText('R2', r2GenesPositionX, 220)

    parts.forEach(part => {
        // DOMINANT PARTS
        axieCanvas.setColor(axie.traits[part].d.color)
        axieCanvas.printText(axie.traits[part].d.name, dGenesPositionX, genesPositionY)

        // R1 PARTS
        axieCanvas.setColor(axie.traits[part].r1.color)
        axieCanvas.printText(axie.traits[part].r1.name, r1GenesPositionX, genesPositionY)

        // R2 PARTS
        axieCanvas.setColor(axie.traits[part].r2.color)
        axieCanvas.printText(axie.traits[part].r2.name, r2GenesPositionX, genesPositionY)

        genesPositionY = genesPositionY + offsetByYPixels
    })

    const buffer = axieCanvas.toBuffer()

    axieCanvas.clearRectangle()

    return buffer
}

module.exports.createOriginAxieCanvas = async (axie) => {
    const axieImg =
        await canvas.loadImage(`https://storage.googleapis.com/assets.axieinfinity.com/axies/${axie.id}/axie/axie-full-transparent.png`)
            .catch(() => canvas.loadImage('./assets/images/unknown.png'))

    const cardSet = await Promise.all(
        parts.map(part => {
            let partId = axie.traits[part].d.partId
            partId = partId.replace('?', '')
            return canvas.loadImage(`./assets/images/origin_cards/${originCardsList[partId].originCard.cardId}.png`)
        })
    )

    const potentialPointsCrests = await Promise.all(
        Object.keys(axie.potentialPoints).map(axieClass => {
            return canvas.loadImage(`./assets/images/crests/${axieClass}-crest.png`)
        })
    )

    originAxieCanvas.beginPath()

    originAxieCanvas.printImage(axieImg, -100, 50, 640, 480)

    originAxieCanvas.setTextFont('60px "Roboto Bk"')
    originAxieCanvas.setColor('#ffffff')

    const potentialPoints = Object.values(axie.potentialPoints)

    let crestPositionX = 10

    let pointTextPositionX = 90
    let pointTextPositionY = 53

    potentialPointsCrests.forEach((crest, index) => {
        originAxieCanvas.printImage(crest, crestPositionX, 0, 70, 70)
        crestPositionX = crestPositionX + 160

        originAxieCanvas.printText(potentialPoints[index], pointTextPositionX, pointTextPositionY)
        pointTextPositionX = pointTextPositionX + 160
    })

    let genesPositionY = 170
    let offsetByYPixels = 55

    let dGenesPositionX = 450
    let r1GenesPositionX = 850
    let r2GenesPositionX = 1200

    let offsetByXPixels = 250
    let cardPositionX = 10
    let cardPositionY = 470

    const cardWidth = 900 * 0.275
    const cardHeight = 1350 * 0.275

    originAxieCanvas.setTextFont('35px "Roboto Bk"')
    originAxieCanvas.setColor('#ffffff')

    // DOMINANT TITLE
    originAxieCanvas.printText('D', dGenesPositionX, 120)

    // R1 TITLE
    originAxieCanvas.printText('R1', r1GenesPositionX, 120)

    // R2 TITLE
    originAxieCanvas.printText('R2', r2GenesPositionX, 120)

    parts.forEach((part, index) => {
        // DOMINANT PARTS
        originAxieCanvas.setColor(axie.traits[part].d.color)
        originAxieCanvas.printText(axie.traits[part].d.name, dGenesPositionX, genesPositionY)

        // R1 PARTS
        originAxieCanvas.setColor(axie.traits[part].r1.color)
        originAxieCanvas.printText(axie.traits[part].r1.name, r1GenesPositionX, genesPositionY)

        // R2 PARTS
        originAxieCanvas.setColor(axie.traits[part].r2.color)
        originAxieCanvas.printText(axie.traits[part].r2.name, r2GenesPositionX, genesPositionY)

        genesPositionY = genesPositionY + offsetByYPixels

        // CARDS
        originAxieCanvas.printImage(cardSet[index], cardPositionX, cardPositionY, cardWidth, cardHeight)

        cardPositionX = cardPositionX + offsetByXPixels
    })

    const buffer = originAxieCanvas.toBuffer()

    originAxieCanvas.clearRectangle()

    return buffer
}