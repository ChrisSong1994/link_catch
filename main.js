const { app } = require('electron')
const isDev = require('electron-is-dev')
const url = require('url')
const path = require('path')
// const Store = require('electron-store');
const AppWindow = require('./src/AppWindow')
const StreamDownload = require('./src/module/streamDownload')

let mainWindow = null
// "http://www.txzqw.me/read-htm-tid-357213.html"

const createWindow = () => {
  const download1 = new StreamDownload({
    id: 'F12F58D789EA5C51DDAA70A5EB50DF52B523B5E8.nba_2889711_1920x1080_5904',
    patchUrl:
      'http://ssl.cdn.turner.com/nba/big/nba/wsc/2019/11/16/F12F58D789EA5C51DDAA70A5EB50DF52B523B5E8.nba_2889711_1920x1080_5904.mp4',
    baseDir: '/Users/songjun/学习/github/link_catch',
    fileName: '贾莫兰特25分集锦.mp4'
  })

  const download2 = new StreamDownload({
    id: 'e471848d-ee67-4b91-a57b-03db0d8ecb1b.nba_2890003_1920x1080_5904',
    patchUrl:
      'http://ssl.cdn.turner.com/nba/big/2019/11/16/e471848d-ee67-4b91-a57b-03db0d8ecb1b.nba_2890003_1920x1080_5904.mp4',
    baseDir: '/Users/songjun/Desktop',
    fileName: '11月16日NBA十佳球.mp4'
  })

  download1.downloadFile(type => {
    if (type === 'finished') download2.downloadFile()
  })

  isDev && require('devtron').install() // 开发环境打开调试器
  // 窗口配置
  const mainWindowConfig = { width: 2440, height: 1200 }
  // 打开文件或url
  const urlLocation = isDev
    ? 'http://localhost:5000'
    : url.format({
        pathname: path.join(__dirname, './build/index.html'),
        protocol: 'file',
        slashes: true
      })

  // 创建主窗口
  mainWindow = new AppWindow(mainWindowConfig, urlLocation)
  // 打开开发者工具
  mainWindow.webContents.openDevTools()
  // 当 window 被关闭，这个事件会被触发
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  //  窗口缩放
  mainWindow.on('resize', () => {
    mainWindow.webContents.send('resize')
  })
}

// 创建窗口
app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
