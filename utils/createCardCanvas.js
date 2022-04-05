const { Canvas, resolveImage } = require('canvas-constructor/cairo')
const canvas = require('canvas')
canvas.registerFont('./assets/fonts/Changa-One.ttf', { family: 'ChangaOne' })
canvas.registerFont('./assets/fonts/Muli-SemiBold.ttf', { family: 'Muli-SemiBold' })

const cardCanvas = new Canvas(320, 400)

module.exports.createCardSetCanvas = async (cards) => {
    const setOfCardsToCreate = cards.map(card => this.createCardCanvas(card))
    const setOfCardsBuffer = await Promise.all(setOfCardsToCreate)
    const setOfCardsImgs = setOfCardsBuffer.map(buffer => resolveImage(buffer))
    return Promise.all(setOfCardsImgs)
}

module.exports.createCardCanvas = async ({ id, iconId, skillName, defaultAttack, defaultDefense, defaultEnergy, description }) => {

    const [cardBase, cardIcon, cardAtk, cardDef] = await Promise.all([
        canvas.loadImage(`./assets/images/classic_cards/base/${id}.png`),
        canvas.loadImage(`./assets/images/classic_cards/effects/${iconId}.png`),
        canvas.loadImage(`./assets/images/classic_cards/bg/bg-${id.split('-')[0]}-atk.png`),
        canvas.loadImage(`./assets/images/classic_cards/bg/bg-${id.split('-')[0]}-def.png`)
    ])

    cardCanvas.beginPath()

    // CARD BASE
    cardCanvas.printImage(cardBase, 20, 0, 300, 400)

    // CARD EFFECT ICON
    cardCanvas.printImage(cardIcon, 37, 315, 23, 23)

    // CARD ATTACK STATS
    cardCanvas.printImage(cardAtk, 0, 75, 60, 70)
    cardCanvas.setColor('#7e2738')
    cardCanvas.setTextFont('39px "ChangaOne"')
    cardCanvas.setTextAlign('center')
    cardCanvas.printResponsiveText(defaultAttack, 28, 120, 70)
    cardCanvas.setColor('#ffffff')
    cardCanvas.setTextFont('35px "ChangaOne"')
    cardCanvas.setTextAlign('center')
    cardCanvas.printResponsiveText(defaultAttack, 28, 120, 70)

    // CARD DEF STATS
    cardCanvas.printImage(cardDef, 0, 145, 60, 70)
    cardCanvas.setColor('#277f56')
    cardCanvas.setTextFont('39px "ChangaOne"')
    cardCanvas.setTextAlign('center')
    cardCanvas.printResponsiveText(defaultDefense, 28, 193, 70)
    cardCanvas.setColor('#ffffff')
    cardCanvas.setTextFont('35px "ChangaOne"')
    cardCanvas.setTextAlign('center')
    cardCanvas.printResponsiveText(defaultDefense, 28, 193, 70)

    // CARD ENERGY
    cardCanvas.setTextFont('47px "ChangaOne"')
    cardCanvas.setTextAlign('left')
    cardCanvas.printText(defaultEnergy, 47, 56)

    // CARD SKILL DESCRIPTION
    cardCanvas.setTextFont('15px "Muli-SemiBold"')
    cardCanvas.printWrappedText(description, 80, 315, 205)

    // CARD SKILL NAME
    cardCanvas.setTextFont('28px "ChangaOne"')
    cardCanvas.setTextAlign('center')
    cardCanvas.printResponsiveText(skillName, 190, 52, 170)

    const buffer = cardCanvas.toBuffer()

    cardCanvas.clearRectangle()

    return buffer
}