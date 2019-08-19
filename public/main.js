const {app, BrowserWindow} = require('electron');
let win = null;

function createWindow () {
    win = new BrowserWindow({ width: 800, height: 300, frame: false, titleBarStyle: 'hidden' });
    win.loadURL('http://localhost:3000/')
};

app.on('ready', createWindow);
