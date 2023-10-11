import fs from 'fs'

const run = async () => {
    const res = await fetch('https://intersect.rknight.me/search.json')
    const data = await res.json()

    const botData = {
        name: 'Intersect Links',
        username: 'intersectlinks',
        url: 'https://bugle.lol/@intersectlinks',
        description: 'Tooting a random link from The Intersect every 6 hours',
        links: data.links.filter(l => {
            return !l.link.includes('rknight.me') && !l.link.includes('twitter.com')
        }),
    }

    fs.writeFileSync('./bots/intersect.json', JSON.stringify(botData, '', 2))
}

run()