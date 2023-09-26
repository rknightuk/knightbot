import fs from 'fs'

const files = fs.readdirSync('./bots').filter(f => f.includes('.json')).map(f => `./bots/${f}`)

const list = files.map(f => {
    const data = JSON.parse(fs.readFileSync(f, 'utf8'))
    return `<li><a href="${data.url}"><strong>${data.name}</strong></a> - <em>${data.description}</em></li>`
}).join('\n')

const links = files.map(f => {
    const data = JSON.parse(fs.readFileSync(f, 'utf8'))
    return `<a style="display:none" rel="me" href="https://bugle.lol/@${data.username}"></a>`
}).join('\n')

if (!fs.existsSync('./public'))
{
    fs.mkdirSync('./public')
}

const content = fs.readFileSync('./index.html', 'utf8').replace('{{ list }}', list).replace('{{ links }}', links)

fs.writeFileSync('./public/index.html', content)