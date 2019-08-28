const { app, Menu, Tray, BrowserWindow, nativeImage } = require('electron');
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const glob = require('glob')
const wallpaper = require('wallpaper')
const download = require('download')
let win = null;
let tray = null;

const logoLight = nativeImage.createFromPath(__dirname + '/logo-light.png').resize({width: 25, height: 25})
const logoDark = nativeImage.createFromPath(__dirname + '/logo-dark.png').resize({width: 25, height: 25})
const logo = nativeImage.createFromPath(__dirname + '/logo.png')

const userPath = app.getPath('userData')

const onDarkThemeChange = () => {
    const { systemPreferences } = require('electron')
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
    glob(dir + '/*.{jpg,png,jpeg}', (er, files) => {
        files.map((file) => { fs.unlinkSync(file) })
    })
}

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

const settingsPath = userPath + '/data.json'

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

app.requestSingleInstanceLock()
app.on('second-instance', (event, argv, cwd) => {
    if (win) {
        if (win.isMinimized()) {
            win.restore()
        }
        win.focus()
    }
})

app.on('ready', () => {
    let logoPicked = logo
    if (process.platform === 'darwin') {
        const { systemPreferences } = require('electron')
        if (systemPreferences.isDarkMode()) {
            logoPicked = logoLight
        } else {
            logoPicked = logoDark
        }
    }
    tray = new Tray(logoPicked)
    const contextMenu = Menu.buildFromTemplate([
        { label: 'show cyclepaper', click: () => {
            if (process.platform === 'darwin') app.dock.show()
            win.show()
        } },
        { label: 'quit', click: () => {
            app.isQuitting = true
            app.quit()
        } }
    ])
    tray.setToolTip('cyclepaper')
    tray.setContextMenu(contextMenu)
    
    if (process.platform === 'darwin') {
        const { systemPreferences } = require('electron')
        systemPreferences.subscribeNotification(
            'AppleInterfaceThemeChangedNotification',
            onDarkThemeChange
        )
    }

    serv.listen(8124, () => {
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
        event.preventDefault()
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
            if (process.platform === 'darwin') app.dock.hide()
            event.preventDefault()
            win.hide()
        }
    })
    // win.loadURL('http://localhost:3000')
    win.loadURL(`file://${path.join(__dirname, '/../build/index.html')}`)
})


