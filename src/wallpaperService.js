import axios from 'axios'
import cheerio from 'cheerio'

// const remote = require('electron').remote
// const app = remote.app
// const wallpaper = require('wallpaper')

const WHITELISTED_URLS = ['i.redd.it', 'imgur.com']
// const LOCATION = app.getPath('userData')

const getBase64Image = (url) => {
    return axios
      .get(url, { responseType: 'arraybuffer' })
      .then(response => new Buffer(response.data, 'binary').toString('base64'))
  }

const parseWebPage = (html) => {
    let data = []
    const $ = cheerio.load(html)
    $(`div.siteTable div.thing`).each((i, entry) => {
        if (WHITELISTED_URLS.contains(entry.attr('data-domain')))
            data.push(entry.attr('data-url'))
    })
}

export const setWallpaperFromSources = (sources) => {
    sources.map((source) => {
        axios.get(`https://old.reddit.com/r/${source}/top`)
            .then(response => {
                let images = parseWebPage(response.data)
                console.log(images)
                // // store random choice at LOCATION
                // getBase64Image()
                // wallpaper.set(`${LOCATION}/`)
            })
            .catch(err => console.error(err))
    })
}
