const { app } = require('electron')
const isDev = require('electron-is-dev')
const url = require('url')
const path = require('path')
// const Store = require('electron-store');
const AppWindow = require('./src/AppWindow')

let mainWindow = null
// "http://www.txzqw.me/read-htm-tid-357213.html"

const createWindow = () => {
  if (isDev) {
    require('devtron').install()
  } // 开发环境打开调试器}
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
  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

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
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
