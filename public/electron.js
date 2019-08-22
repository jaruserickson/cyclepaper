const { app, Menu, Tray, BrowserWindow, nativeImage, systemPreferences } = require('electron');
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const glob = require('glob')
const wallpaper = require('wallpaper')
const download = require('download');

let win = null;
let tray = null;

const logoLight = nativeImage.createFromPath(__dirname + '/logo-light.png').resize({width: 25, height: 25})
const logoDark = nativeImage.createFromPath(__dirname + '/logo-dark.png').resize({width: 25, height: 25})
const logo = nativeImage.createFromPath(__dirname + '/logo.png')

const userPath = app.getPath('userData')

function onDarkThemeChange () {
    if (systemPreferences.isDarkMode()) {
        tray.setImage(logoLight)
    } else {
        tray.setImage(logoDark)
    }
}

const serv = express()

serv.use(bodyParser.json())
serv.use(cors())

const cleanup = (dir) => {
    glob(dir + '/*.{jpg,png,jpeg}', function (er, files) {
        files.map((file) => { fs.unlinkSync(file) })
    })
}

serv.post('/', async function (req, res) {
    const url = req.body.url
    cleanup(userPath)
    const filepath = userPath + '/' + Math.random() + '.' + url.split(/\.(?=[^\.]+$)/).pop()
    download(url).then(data => {
        console.log(url + ' downloaded.')
        fs.writeFile(filepath, data, function () {
            wallpaper.set(filepath)
            lastpath = filepath
            console.log('wallpaper set at ' + filepath + ' to ' + url)
            res.send('wallpaper set at ' + filepath + ' to ' + url)
        })
    })
})


app.on('ready', () => {
    tray = new Tray(systemPreferences.isDarkMode() ? logoLight : logoDark)
    const contextMenu = Menu.buildFromTemplate([
        { label: 'show cyclepaper', click: function(){
            app.dock.show()
            win.show()
        } },
        { label: 'quit', click: function(){
            app.isQuitting = true
            app.quit()
        } }
    ])
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)
    
    systemPreferences.subscribeNotification(
        'AppleInterfaceThemeChangedNotification',
        onDarkThemeChange
    )

    serv.listen(8124, function () {
        console.log('wallpaper web server listening on port 8080')
    })

    var menu = Menu.buildFromTemplate([
        {
            label: 'Menu',
            submenu: [
            { role: 'about' },
            {type:'separator'},
            {
                label:'Quit', 
                click() { 
                    app.isQuitting = true
                    app.quit() 
                },
                accelerator: 'CmdOrCtrl+Q'
            }
        ]
        }
    ])
    Menu.setApplicationMenu(menu); 
    
    win = new BrowserWindow({ width: 800, height: 400, icon: logo, titleBarStyle: 'hiddenInset' })
    win.setMenu(null)
    win.on('minimize', (event) => {
        event.preventdefault()
        win.hide()
    })
    // win.webContents.openDevTools()
    win.on('close', (event) => {
        console.log(event)
        if (!app.isQuitting) {
            try {
                serv.close()
            } catch (TypeError) {
                console.log('Server was already closed.')
            }
            app.dock.hide()
            event.preventDefault()
            win.hide()
        }
    })

    win.loadURL(`file://${path.join(__dirname, '/../build/index.html')}`)
})


