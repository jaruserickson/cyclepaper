import snoowrap from 'snoowrap'
import axios from 'axios'

const r = new snoowrap({
    userAgent: 'wallpaper cyclist by /u/jakeroooo',
    clientId: process.env.REACT_APP_CLIENT_ID,
    clientSecret: process.env.REACT_APP_CLIENT_SECRET,
    refreshToken: process.env.REACT_APP_REFRESH_TOKEN
})

const setWallpaperToURL = (url) => {
    axios.post('http://localhost:8124/', {url}).then((res) => console.log(res))
}

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

export const setWallpaperFromSources = (sources) => {
    getImages(sources).then(images => {
        const imageUrl = images[Math.floor(Math.random() * images.length)].url
        setWallpaperToURL(imageUrl)
        return imageUrl
    })
}

export const saveWallpaper = () => new Promise((res, rej) => {
    axios.post('http://localhost:8124/save').then((result) => {
        res(result.data)
    })
})