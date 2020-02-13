const { app } = require('electron')
const isDev = require('electron-is-dev')
const AppWindow = require('./src/AppWindow')
const urlCatch = require('./src/module/urlCatch')
const url = require('url')
const path = require('path')

let mainWindow

const createWindow = () => {
  // 开发环境打开调试器
  isDev && require('devtron').install()
debugger
  urlCatch("http://www.txzqw.me/read-htm-tid-357213.html")

  // 窗口配置
  const mainWindowConfig = {
    width: 1440,
    height: 768
  }

  // 打开文件或url
  const urlLocation = isDev
    ? 'http://localhost:3000'
    : url.format({
        pathname: path.join(__dirname, './build/index.html'),
        protocol: 'file',
        slashes: true
      })

  // 创建主窗口
  mainWindow = new AppWindow(mainWindowConfig, urlLocation)
  // 打开开发者工具。
  mainWindow.webContents.openDevTools()
  console.log(mainWindow)
  // 当 window 被关闭，这个事件会被触发。
  mainWindow.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (mainWindow === null) {
    createWindow()
  }
})
