const { BrowserWindow } = require('electron')

class AppWindow extends BrowserWindow {
  constructor(config, urlLocation) {
    const basicConfig = {
      width: 1440,
      height: 760,
      webPreferences: {
        nodeIntegration: true, // 是否集成Node，默认为false
        nodeIntegrationInWorker: true, //是否在Web工作器中启用了Node集成，默认为false
        webSecurity: false //  允许同源策略
      },
      show: false,
      backgroundColor: '#efefef'
    }
    const finalConfig = { ...basicConfig, ...config }
    super(finalConfig)
    this.loadURL(urlLocation)
    this.once('ready-to-show', () => {
      this.show()
    })
  }
}

module.exports = AppWindow
