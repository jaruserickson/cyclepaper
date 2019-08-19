const { app, Menu, Tray, BrowserWindow, nativeImage, systemPreferences } = require('electron');
let win = null;
let tray = null;

const logoLight = nativeImage.createFromPath(__dirname + '/logo-light.png').resize({width: 25, height: 25})
const logoDark = nativeImage.createFromPath(__dirname + '/logo-dark.png').resize({width: 25, height: 25})
const logo = nativeImage.createFromPath(__dirname + '/logo.png')

function onDarkThemeChange () {
    if (systemPreferences.isDarkMode()) {
        tray.setImage(logoLight)
    } else {
        tray.setImage(logoDark)
    }
}

app.on('ready', () => {
    tray = new Tray(systemPreferences.isDarkMode() ? logoLight : logoDark)
    const contextMenu = Menu.buildFromTemplate([
        { label: 'show cyclepaper', click: function(){
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

    win = new BrowserWindow({ width: 800, height: 400, icon: logo, titleBarStyle: 'hiddenInset' })
    win.on('minimize', (event) => {
        event.preventdefault()
        win.hide()
    })
    win.on('close', (event) => {
        if (!app.isQuitting) {
            event.preventDefault()
            win.hide()
        }
    })

    win.loadURL('http://localhost:3000/')
});
