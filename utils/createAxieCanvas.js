const { Canvas } = require('canvas-constructor/cairo')
const canvas = require('canvas')
canvas.registerFont('./assets/fonts/Roboto-Black.ttf', { family: 'Roboto' })
const axieCanvas = new Canvas(1474, 983)

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

    // DOMINANT PARTS
    axieCanvas.setTextFont('35px "Roboto Bk"')
    axieCanvas.setColor('#ffffff')
    axieCanvas.printText('D', 450, 220)
    axieCanvas.setColor(axie.traits.eyes.d.color)
    axieCanvas.printText(axie.traits.eyes.d.name, 450, 270)
    axieCanvas.setColor(axie.traits.mouth.d.color)
    axieCanvas.printText(axie.traits.mouth.d.name, 450, 325)
    axieCanvas.setColor(axie.traits.ears.d.color)
    axieCanvas.printText(axie.traits.ears.d.name, 450, 380)
    axieCanvas.setColor(axie.traits.horn.d.color)
    axieCanvas.printText(axie.traits.horn.d.name, 450, 435)
    axieCanvas.setColor(axie.traits.back.d.color)
    axieCanvas.printText(axie.traits.back.d.name, 450, 490)
    axieCanvas.setColor(axie.traits.tail.d.color)
    axieCanvas.printText(axie.traits.tail.d.name, 450, 545)

    // R1 PARTS
    axieCanvas.setColor('#ffffff')
    axieCanvas.printText('R1', 800, 220)
    axieCanvas.setColor(axie.traits.eyes.r1.color)
    axieCanvas.printText(axie.traits.eyes.r1.name, 800, 270)
    axieCanvas.setColor(axie.traits.mouth.r1.color)
    axieCanvas.printText(axie.traits.mouth.r1.name, 800, 325)
    axieCanvas.setColor(axie.traits.ears.r1.color)
    axieCanvas.printText(axie.traits.ears.r1.name, 800, 380)
    axieCanvas.setColor(axie.traits.horn.r1.color)
    axieCanvas.printText(axie.traits.horn.r1.name, 800, 435)
    axieCanvas.setColor(axie.traits.back.r1.color)
    axieCanvas.printText(axie.traits.back.r1.name, 800, 490)
    axieCanvas.setColor(axie.traits.tail.r1.color)
    axieCanvas.printText(axie.traits.tail.r1.name, 800, 545)

    // R2 PARTS
    axieCanvas.setColor('#ffffff')
    axieCanvas.printText('R2', 1150, 220)
    axieCanvas.setColor(axie.traits.eyes.r2.color)
    axieCanvas.printText(axie.traits.eyes.r2.name, 1150, 270)
    axieCanvas.setColor(axie.traits.mouth.r2.color)
    axieCanvas.printText(axie.traits.mouth.r2.name, 1150, 325)
    axieCanvas.setColor(axie.traits.ears.r2.color)
    axieCanvas.printText(axie.traits.ears.r2.name, 1150, 380)
    axieCanvas.setColor(axie.traits.horn.r2.color)
    axieCanvas.printText(axie.traits.horn.r2.name, 1150, 435)
    axieCanvas.setColor(axie.traits.back.r2.color)
    axieCanvas.printText(axie.traits.back.r2.name, 1150, 490)
    axieCanvas.setColor(axie.traits.tail.r2.color)
    axieCanvas.printText(axie.traits.tail.r2.name, 1150, 545)

    const buffer = axieCanvas.toBuffer()

    axieCanvas.clearRectangle()

    return buffer
}