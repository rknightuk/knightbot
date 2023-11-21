# KnightBot

Node scripts for bots to post to [Bugle](https://bugle.lol).

## Adding a bot

Bots are defined in two files:

- `bots/index.js`
- `bots/BOTNAME.json`

The `index` file loads in the JSON config for a bot. Assume a bot named `dave`:

```js
// bots/index.js

const data = {
    dave: {}, // this key is important
}

Object.keys(data).forEach(k => {
    data[k] = {
        ...data[k],
        ...JSON.parse(fs.readFileSync(`./bots/${k}.json`, 'utf8')) // loads `bots/dave.json`
    }
})

export default data
```

```json
// dave.json
{
  "name": "Dave",
  "username": "dave",
  "url": "https://bugle.lol/@dave",
  "description": "Being a Dave", // this is only used for the generated home page for KnightBot
  "grammar": {
    "origin": "I am Dave and I am #word#",
    "word": [
        "cool",
        "fancy"
    ]
  }
}
```

To run a bot, specify the bot key like so: `node index.js dave`. By default the script will run the data via [Tracery](http://www.tracery.io/)/[`tracery-grammar`](https://www.npmjs.com/package/tracery-grammar). This requires a `grammar` string and any additional words to inject into the string.

For more complicated bots, like the [Bad Movie Remake bot](https://bugle.lol/@movieremakes) set a custom generator in `index.js`:

```js

const data = {
    remakes: {
        includeImage: true,
        generate: (botData) => {
            // do some custom stuff
            return {
                previousCheck: '123',
                content: 'the content'
            }
        }
    }
}
```

The `previousCheck` is to see if a post has been made before. For tracery bots, this makes sense to be the full content but in the case of the movie bot, I only want to check the movie title itself.

`includeImages` will feed the content to `https://deepai.org` and include the image in the toot.