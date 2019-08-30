const snoowrap = require('snoowrap')
const axios = require('axios')

const r = new snoowrap({
    userAgent: 'wallpaper cyclist by /u/jakeroooo',
    clientId: process.env.REACT_APP_CLIENT_ID,
    clientSecret: process.env.REACT_APP_CLIENT_SECRET,
    refreshToken: process.env.REACT_APP_REFRESH_TOKEN
})

const setWallpaperToURL = (url) => new Promise((resolve, reject) => {
    axios.post('http://localhost:8124/', {url}).then((res) => {
        console.log(res)
        resolve(res)
    }).catch((err) => reject(err))
})
    
const getImages = (sources) => new Promise((resolve, reject) => {
    let images = []
    sources.map((source, index) => {
        r.getSubreddit(source).getTop({time: 'month'})
            .then((top) => {
                images.push(...top.filter((item) => item.url.match(/\.(jpeg|jpg|png)$/) != null))
                if (index === sources.length - 1) resolve(images)
            })
            .catch((err) => reject(err))
    })
})

module.exports.validateSubreddit = (sub) => new Promise((resolve, reject) => {
    r.getSubreddit(sub).search({'query': 'test', 'sort': 'year'})
        .then(() => { resolve('Subreddit exists.') })
        .catch((err) => { reject(err) })
})

module.exports.setWallpaperFromSources = (sources) => new Promise((resolve, reject) => {
    getImages(sources).then(images => {
        const image = images[Math.floor(Math.random() * images.length)]
        setWallpaperToURL(image.url).then(() => {
            resolve({
                sub: image.permalink.split('/')[2],
                url: `https://reddit.com${image.permalink}`
            })
        }).catch((err) => reject(err)) 
    })
})

module.exports.saveWallpaper = () => new Promise((res, rej) => {
    axios.post('http://localhost:8124/save').then((result) => {
        res(result.data)
    })
})