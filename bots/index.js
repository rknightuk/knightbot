import fs from 'fs'

const data = {
    family: {},
    treatday: {},
    intersect: {
        generate: (botData) => {
            const link = botData.links[(Math.floor(Math.random() * botData.links.length)) - 1]
            return {
                previousCheck: link.link,
                content: `[${link.title}](${link.link}) (from [${link.source.title}](https://intersect.rknight.me${link.source.url}))`,
            }
        },
    },
    remakes: {
        includeImage: true,
        generate: (botData) => {
            const { movies, men, women } = botData.data
            const movie = movies[(Math.floor(Math.random() * movies.length)) - 1]
            const previousKey = `${movie.title}-${movie.year}`

            let content = `${movie.title} starring #actor1# as #char1#, #actor2# as #char2#, and #actor3# as #char3#`

            movie.characters.every((c, i) => {
                const index = i+1
                content = content.replace(`#char${index}#`, c.character)
                let actor = null
                if (c.gender === 1)
                {
                    actor = women[(Math.floor(Math.random() * women.length)) - 1]
                } else {
                    actor = men[(Math.floor(Math.random() * women.length)) - 1]
                }
                content = content.replace(`#actor${index}#`, actor)
                return true
            })

            return {
                previousCheck: previousKey,
                content: content
            }
        },
    },
}

Object.keys(data).forEach(k => {
    data[k] = {
        ...data[k],
        ...JSON.parse(fs.readFileSync(`./bots/${k}.json`, 'utf8'))
    }
})

export default data