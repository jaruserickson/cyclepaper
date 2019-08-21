import wallpaper from 'wallpaper'
import fs from 'fs'
import path from 'path'
import os from 'os'

const snoowrap = require('snoowrap')

const r = new snoowrap({
    userAgent: 'wallpaper cyclist by /u/jakeroooo',
    clientId: process.env.REACT_APP_CLIENT_ID,
    clientSecret: process.env.REACT_APP_CLIENT_SECRET,
    refreshToken: process.env.REACT_APP_REFRESH_TOKEN
})

const convertToBase64 = (img) => {
    let canvas = document.createElement('canvas');
    canvas.width = window.screen.width;
    canvas.height = window.screen.height;
    let context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);
    let dataURL = canvas.toDataURL('image/jpg');
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
}

const setAsBackground = (event) => {
    let base64Image = this.convertToBase64(event.target);
    let picturePath = path.join(os.homedir(), '/Pictures', 'background.jpg');
    picturePath = path.normalize(picturePath);
    fs.writeFile(picturePath, base64Image, 'base64', (err) => {
        wallpaper.set(picturePath, {scale: 'stretch'})
        .then(() => {
            console.log(path.resolve(picturePath));
            this.$snackbar.open('Done !');
        });
    });
}
// const wallpaper = require('wallpaper')

const setWallpaperToURL = (url) => {
    return setAsBackground(convertToBase64(url))
  }

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
        setWallpaperToURL(images[Math.floor(Math.random() * images.length)].url)
    })
}
