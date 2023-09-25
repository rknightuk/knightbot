import fs from 'fs'

const files = fs.readdirSync('./bots').filter(f => f.includes('.json')).map(f => `./bots/${f}`)

const output = files.map(f => {
    const data = JSON.parse(fs.readFileSync(f, 'utf8'))
    return `<li><a href="${data.url}"><strong>${data.name}</strong> - <em>${data.description}</em></a></li>`
}).join('\n')

if (!fs.existsSync('./public'))
{
    fs.mkdirSync('./public')
}

const content = fs.readFileSync('./index.html', 'utf8').replace('{{ replace }}', output)

fs.writeFileSync('./public/index.html', content)