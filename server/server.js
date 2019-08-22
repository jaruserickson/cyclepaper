const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const glob = require('glob')
const child_process = require('child_process')
const wallpaper = require('wallpaper')
const download = require('download');

const app = express()

app.use(bodyParser.json())
app.use(cors())

const cleanup = (dir) => {
    glob(dir + '/*.{jpg,png,jpeg}', function (er, files) {
        files.map((file) => { fs.unlinkSync(file) })
    })
}

// const run_script = (script, url) => child_process.exec(__dirname + `/script/${script} ${url}`, 
//     (error, stdout, stderr) => {
//         console.log(stdout);
//         console.log(stderr);
//         if (error !== null) {
//             console.log(`exec error: ${error}`);
//         }
//     })

app.post('/', async function (req, res) {
    const url = req.body.url
    // if (process.platform === 'darwin') {
    cleanup(__dirname)
    const filepath = __dirname + '/' + Math.random() + '.' + url.split(/\.(?=[^\.]+$)/).pop()
    download(url).then(data => {
        console.log(url + ' downloaded.')
        fs.writeFile(filepath, data, function () {
            wallpaper.set(filepath)
            lastpath = filepath
            console.log('wallpaper set at ' + filepath + ' to ' + url)
            res.send('wallpaper set at ' + filepath + ' to ' + url)
        })
    })
    // } else if (process.platform === 'win32') {
    //     run_script('win.bat', url)
    // } else {
    //     run_script('linux.sh', url)
    // }
})

app.listen(8080, function () {
    console.log('wallpaper web server listening on port 8080')
})