import tracery from 'tracery-grammar'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

const make = (grammar) => {
    const output = grammar.flatten('#origin#')
    return output.charAt(0).toUpperCase() + output.slice(1)
}

const run = async () => {
    const botKey = process.argv[2]
    if (!botKey) {
        console.log('❌ You must pass a bot key')
        return
    }

    if (botKey === 'remakes')
    {
        console.log('❌ Remakes must be run with node remakes.js')
        return
    }

    const botPath = `./bots/${botKey}.json`
    const previousPath = `./bots/${botKey}.previous`

    const botExists = fs.existsSync(botPath)

    if (!botExists) 
    {
        console.log(`❌ No bot found for "${botKey}"`)
        return
    }

    const previousDataExists = fs.existsSync(previousPath)

    if (!previousDataExists)
    {
        console.log('🗒️ Making previous file')
        fs.writeFileSync(previousPath, '')
    }

    const botData = JSON.parse(fs.readFileSync(botPath, 'utf8'))
    let previous = fs.readFileSync(previousPath, 'utf8')

    console.log(`⚙️ Running bot for ${botData.name}`)
 
    var grammar = tracery.createGrammar(botData.grammar)
    
    grammar.addModifiers(tracery.baseEngModifiers)
    
    let output = make(grammar)

    if (previous.includes(output))
    {
        while (previous.includes(output))
        {
            output = make(grammar)
        }
    } else {
        previous += `\n${output}`
    }

    fs.writeFileSync(previousPath, previous)

    const response = await fetch(`https://bugle.lol/@${botData.username}`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            'api_key': process.env.BUGLE_API_KEY,
            'content': output,
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