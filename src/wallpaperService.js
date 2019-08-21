import axios from 'axios'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { resolve } from 'q';
const snoowrap = require('snoowrap')

const r = new snoowrap({
    userAgent: 'wallpaper cyclist by /u/jakeroooo',
    clientId: process.env.REACT_APP_CLIENT_ID,
    clientSecret: process.env.REACT_APP_CLIENT_SECRET,
    refreshToken: process.env.REACT_APP_REFRESH_TOKEN
})

// const wallpaper = require('wallpaper')

// const setWallpaperToURL = (url) => {
//     return axios
//         .get(url, { responseType: 'arraybuffer' })
//         .then(response => {
//             let base64Image = new Buffer(response.data, 'binary').toString('base64')

//             // Write file to path then 
//             let picturePath = path.join(os.homedir(), "/Pictures", "background.jpg")
//             picturePath = path.normalize(picturePath)
//             fs.writeFile(picturePath, base64Image, 'base64', (err) => {
//                 wallpaper.set(picturePath, {scale: "stretch"})
//                 .then(() => {
//                     console.log(path.resolve(picturePath))
//                     this.$snackbar.open("Done !")
//                 })
//             })
//         })
//   }

const getImages = (sources) => new Promise((resolve, reject) => {
    let images = []
    sources.map((source, index) => {
        r.getSubreddit(source).getTop({time: 'month'})
            .then((top) => {
                images.push(...top)
                if (index === sources.length - 1) resolve(images)
            })
            .catch((err) => reject(err))
    })
})

export const setWallpaperFromSources = async (sources) => {
    getImages(sources).then(images => {
        console.log(images[Math.floor(Math.random() * images.length)].url)
    })
}
