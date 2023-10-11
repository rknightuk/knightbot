import tracery from 'tracery-grammar'
import fs from 'fs'
import dotenv from 'dotenv'
import deepai from 'deepai'

dotenv.config()
deepai.setApiKey(process.env.DEEP_AI_KEY);

import bots from './bots/index.js'

const make = (grammar) => {
    const output = grammar.flatten('#origin#')
    return output.charAt(0).toUpperCase() + output.slice(1)
}

const getPreviousData = (botKey) => {
    const previousPath = `./bots/${botKey}.previous`
    const previousDataExists = fs.existsSync(previousPath)

    if (!previousDataExists)
    {
        console.log('🗒️ Making previous file')
        fs.writeFileSync(previousPath, '')
    }

    return fs.readFileSync(previousPath, 'utf8')
}

const generateWithTracey = (botData) => {
    const grammar = tracery.createGrammar(botData.grammar)
    grammar.addModifiers(tracery.baseEngModifiers)

    const output = grammar.flatten('#origin#')
    const content = output.charAt(0).toUpperCase() + output.slice(1)
    return {
        previousCheck: content,
        content: content
    }
}

const run = async () => {
    const botKey = process.argv[2]

    if (!botKey) {
        console.log('❌ You must pass a bot key')
        return
    }

    if (!bots[botKey])
    {
        console.log('❌ No bot found')
        return
    }

    const botData = bots[botKey]
    let previous = getPreviousData(botKey)

    console.log(`⚙️ Running bot for ${botData.name}`)

    let generateFunction = generateWithTracey

    if (botData.generate)
    {
        generateFunction = botData.generate
    }

    let output = generateFunction(botData)

    if (previous.includes(output.previousCheck))
    {
        while (previous.includes(output.previousCheck))
        {
            output = generateFunction(botData)
        }
    } else 
    {
        previous += `\n${output.content}`
    }

    fs.writeFileSync(`./bots/${botKey}.previous`, previous)

    let image = null

    if (botData.includeImage)
    {
        const imageResponse = await deepai.callStandardApi("text2img", {
            text: output.content,
        })

        image = imageResponse.output_url
    }

    const response = await fetch(`https://bugle.lol/@${botData.username}`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            'api_key': process.env.BUGLE_API_KEY,
            'content': output,
            'image_upload': image,
        })
    })

    if (response.ok)
    {
        const json = await response.json()
        const newToot = `https://bugle.lol/@${botData.username}/${json.uuid}`

        console.log(`✅ Posted to Bugle ${newToot}`)
    } else {
        console.log('😞 Did not post')
    }
}

run()