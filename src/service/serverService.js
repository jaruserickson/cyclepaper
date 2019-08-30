const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const glob = require('glob')
const download = require('download')
const wallpaper = require('wallpaper')
const fs = require('fs')


const cleanup = (dir) => {
    glob(dir + '/*.{jpg,png,jpeg}', (er, files) => {
        files.map((file) => { fs.unlinkSync(file) })
    })
}

module.exports.startServerWithEndpoints = (app, userPath) => {
    const serv = express()

    serv.use(bodyParser.json())
    serv.use(cors())

    serv.post('/', (req, res) => {
        const url = req.body.url
        cleanup(userPath)
        const filePath = userPath + '/' + Math.random() + '.' + url.split(/\.(?=[^\.]+$)/).pop()
        
        download(url).then(data => {
            console.log(url + ' downloaded.')
            fs.writeFile(filePath, data, () => {
                wallpaper.set(filePath)
                console.log('wallpaper set at ' + filePath + ' to ' + url)
                res.send('wallpaper set at ' + filePath + ' to ' + url)
            })
        })
    })

    serv.post('/save', (req, res) => {
        const dateString = (Date.now() * Math.random()).toString()
        const getSavedFilename = (file) => app.getPath('desktop') + '/cyclepaper_save_' + dateString.substr(dateString.length - 3) + '.' +  file.split('.').pop()
        
        glob(userPath + '/*.{jpg,png,jpeg}', (er, files) => {
            files.map((file) => {
                const filePath = getSavedFilename(file)
                fs.copyFileSync(file, filePath)
            })
        })
    })

    const settingsPath = `${userPath}/data.json`

    serv.get('/settings', (req, res) => {
        if (fs.existsSync(settingsPath)) {
            res.send(fs.readFileSync(settingsPath, 'utf8'))
        } else {
            res.sendStatus(204) // No content
        }
    })

    serv.post('/settings', (req, res) => {
        const state = req.body.state
        fs.writeFileSync(settingsPath, JSON.stringify(state), 'utf-8')
    })

    serv.listen(8124, () => {
        console.log('wallpaper local server listening on port 8124')
    })

    return serv
}

module.exports.close = (server) => server.close()
