const fs = window.require('fs')
const path = window.require('path')
const request = require('request')

class StreamDownload {
  constructor({ patchUrl, baseDir, fileName }) {
    this.patchUrl = patchUrl
    this.baseDir = baseDir
    this.fileName = fileName
    this.percentage = 0
    this.downloadCallback = null
    this.error = null
  }

  /**计算进度
   * @param {Number} received  文件下载大小
   * @param {Number} total   文件大小
   * */
  showProcess(received, total) {
    this.percentage = ((received * 100) / total).toFixed(2) // 保留两位小数
    console.log(`${this.percentage}%`)
    this.downloadCallback('process', this.percentage)
  }

  /** 下载文件
   * @param {String} patchUrl  地址
   * @param {String} baseDir  本地文件夹路径
   * @param {String} fileName  下载文件名称
   * @param {Function}  callback  下载回调函数
   * */
  downloadFile(callback) {
    this.downloadCallback = callback // 注册回调函数

    let receivedBytes = 0
    let totalBytes = 0
    // 使用流数据获取连接数据
    const reqStream = request({ method: 'GET', uri: this.patchUrl })
    // 创建一个可写入流
    const outStream = fs.createWriteStream(
      path.join(this.baseDir, this.fileName)
    )
    reqStream.pipe(outStream)
    // 监听response事件，当接收到响应头时，返回一个http.IncomingMessage实例 用于获取响应头信息
    reqStream.on('response', res => {
      console.log(res.headers)
      totalBytes = parseInt(res.headers['content-length'], 10)
    })

    //  监听错误信息
    reqStream.on('error', err => {
      this.error = err
      this.downloadCallback('error', this.error)
    })

    // 监听数据响应
    reqStream.on('data', chunk => {
      receivedBytes += chunk.length
      this.showProcess(receivedBytes, totalBytes)
    })

    reqStream.on('end', () => {
      debugger
      this.downloadCallback('finished')
    })
  }
}

module.exports = StreamDownload
