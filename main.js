const { app, ipcMain } = require('electron')
const isDev = require('electron-is-dev')
const url = require('url')
const path = require('path')
const AppWindow = require('./src/AppWindow')
const urlCatch = require('./src/module/urlCatch')

let mainWindow = null;
// "http://www.txzqw.me/read-htm-tid-357213.html"

const createWindow = () => {
  isDev && require('devtron').install()    // 开发环境打开调试器
  // 窗口配置
  const mainWindowConfig = {
    width: 2440,
    height: 1200
  }
  // 打开文件或url
  const urlLocation = isDev ? 'http://localhost:3000'
    : url.format({
      pathname: path.join(__dirname, './build/index.html'),
      protocol: 'file',
      slashes: true
    })

  // 创建主窗口
  mainWindow = new AppWindow(mainWindowConfig, urlLocation)
  // 打开开发者工具。
  mainWindow.webContents.openDevTools()
  // 当 window 被关闭，这个事件会被触发。
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', () => {
  // 创建窗口
  createWindow()

  // 监听渲染进程获取url 动作
  ipcMain.on('catch-url', (event, url) => {
    event.reply('catch-state', true)
    urlCatch(url).then(data => {
      global.sharedObject = { linkData: data }
      event.reply('catch-data', true)
      event.reply('catch-state', false)
    }).catch(err => {
      event.reply('catch-data', false)
      event.reply('catch-state', false)
    })
  })
})

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
