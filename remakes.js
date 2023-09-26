import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

const run = async () => {
    const botPath = `./bots/remakes.json`
    const previousPath = `./bots/remakes.previous`

    const previousDataExists = fs.existsSync(previousPath)

    if (!previousDataExists)
    {
        console.log('🗒️ Making previous file')
        fs.writeFileSync(previousPath, '')
    }

    const botData = JSON.parse(fs.readFileSync(botPath, 'utf8'))
    let previous = fs.readFileSync(previousPath, 'utf8')

    console.log(`⚙️ Running bot for remakes`)

    const { movies, men, women } = botData.data

    let movie = movies[(Math.floor(Math.random() * movies.length)) - 1]
    let previousKey = `${movie.title}-${movie.year}`

    if (previous.includes(previousKey))
    {
        while (previous.includes(previousKey))
        {
            movie = movies[(Math.floor(Math.random() * movies.length)) - 1]
            previousKey = `${movie.title}-${movie.year}`
        }
    } else {
        previous += `\n${previousKey}`
    }

    fs.writeFileSync(previousPath, previous)

    let output = `${movie.title} starring #actor1# as #char1#, #actor2# as #char2#, and #actor3# as #char3#`

    movie.characters.every((c, i) => {
        const index = i+1
        output = output.replace(`#char${index}#`, c.character)
        let actor = null
        if (c.gender === 1)
        {
            actor = women[(Math.floor(Math.random() * women.length)) - 1]
        } else {
            actor = men[(Math.floor(Math.random() * women.length)) - 1]
        }
        output = output.replace(`#actor${index}#`, actor)
        return true
    })

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