let path = null
let fs = null
try {
  fs = window.require('fs')
  path = window.require('path')
} catch (err) {
  fs = require('fs')
  path = require('path')
}
const request = require('request')

class StreamDownload {
  constructor({ id, patchUrl, baseDir, fileName }) {
    this.id = id
    this.patchUrl = patchUrl
    this.baseDir = baseDir
    this.fileName = fileName
    this.status = '0' // 在排队：0 进行中：1  暂停 ：2  完成：3 默认在排队中
    this.percentage = 0
    this.downloadCallback = null
    this.error = null
    this.receivedBytes = 0
    this.totalBytes = 0
  }

  /**计算进度
   * @param {Number} received  文件下载大小
   * @param {Number} total   文件大小
   * */
  showProcess(received, total) {
    this.percentage = ((received * 100) / total).toFixed(2) // 保留两位小数
    console.log(`${this.fileName}:${this.percentage}%`)
    this.downloadCallback &&
      this.downloadCallback('process', { process: this.percentage })
  }

  // 回调
  registerCallback(callback) {
    this.downloadCallback = callback
  }

  /** 下载文件
   * @param {String} patchUrl  地址
   * @param {String} baseDir  本地文件夹路径
   * @param {String} fileName  下载文件名称
   * @param {Function}  callback  下载回调函数
   * */
  downloadFile() {
    let receivedBytes = 0
    let totalBytes = 0
    // 使用流数据获取连接数据   // 后期改进需要进行异步执行
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
      this.downloadCallback &&
        this.downloadCallback('error', { err: this.error })
    })

    // 监听数据响应
    reqStream.on('data', chunk => {
      receivedBytes += chunk.length
      this.showProcess(receivedBytes, totalBytes)
    })

    reqStream.on('end', () => {
      this.downloadCallback && this.downloadCallback('finished')
    })
  }

  // 暂停下载
  pauseDownloadFile() {}
}

module.exports = StreamDownload
