const { app, Menu, Tray, BrowserWindow, nativeImage } = require('electron');
const fs = require('fs')
const server = require('../src/service/serverService')
const { setWallpaperFromSources, saveWallpaper } = require('../src/service/wallpaperService')

let win = null
let tray = null

const logoLight = nativeImage.createFromPath(__dirname + '/logo-light.png').resize({ width: 25, height: 25 })
const logoDark = nativeImage.createFromPath(__dirname + '/logo-dark.png').resize({ width: 25, height: 25 })
const logo = nativeImage.createFromPath(__dirname + '/logo.png')

const userPath = app.getPath('userData')

// Function to handle a theme change in macOS
const onDarkThemeChange = () => {
    const { systemPreferences } = require('electron')
    if (systemPreferences.isDarkMode()) {
        tray.setImage(logoLight)
    } else {
        tray.setImage(logoDark)
    }
}

// Make sure only a single instance can run
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
    // Pick an icon for the tray
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

    // Set up the tray's menu
    const contextMenu = Menu.buildFromTemplate([
        { label: 'refresh', click: () => {
            // Read stashed settings for assumed sources
            fs.readFile(`${userPath}/data.json`, 'utf8', (err, data) => {
                if (err) console.log(err)
                const state = JSON.parse(data)
                setWallpaperFromSources(Object.keys(state.sources))
            })
        } },
        { label: 'save', click: () => { saveWallpaper() } },
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

    // Set up the application menu (toolbar)
    var menu = Menu.buildFromTemplate([
        {
            label: 'Menu',
            submenu: [
                { role: 'about' },
                { type:'separator' },
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
    
    // Start the local wallpaper API
    const serv = server.startServerWithEndpoints(app, userPath)

    // Window settings
    win = new BrowserWindow({ width: 800, height: 500, icon: logo, titleBarStyle: 'hiddenInset' })
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

    win.loadURL('http://localhost:3000')
    // win.loadURL(`file://${require('path').join(__dirname, '/../build/index.html')}`)
})

