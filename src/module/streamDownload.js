let path = null;
let fs = null;
try {
  fs = window.require('fs');
  path = window.require('path');
} catch (err) {
  fs = require('fs');
  path = require('path');
}
const request = require('request');

class StreamDownload {
  constructor({ id, patchUrl, baseDir, fileName }) {
    this.id = id;
    this.patchUrl = patchUrl;
    this.baseDir = baseDir;
    this.fileName = fileName;
    this.date = Date.now(); // 毫秒时间戳
    this.reqStream = null; //   利用request 创建一个可读流
    this.status = '0'; // 在排队：0 进行中：1  暂停 ：2  错误：3  完成：4  默认在排队中
    this.percentage = 0;
    this.downloadCallback = null;
    this.error = null;
    this.receivedBytes = 0;
    this.totalBytes = 0;
  }

  /**计算进度
   * @param {Number} received  文件下载大小
   * @param {Number} total   文件大小
   * */
  showProcess(received, total) {
    this.percentage = ((received * 100) / total).toFixed(2); // 保留两位小数
    console.log(`${this.fileName}:${this.percentage}%`);
    this.downloadCallback && this.downloadCallback('process', { process: this.percentage });
  }

  // 回调
  registerCallback(callback) {
    this.downloadCallback = callback;
  }

  /** 下载文件
   * @param {String} patchUrl  地址
   * @param {String} baseDir  本地文件夹路径
   * @param {String} fileName  下载文件名称
   * @param {Function}  callback  下载回调函数
   * */
  downloadFile() {
    // 使用流数据获取连接数据 🔄 后期改进需要进行并行执行下载
    this.reqStream = request({ method: 'GET', uri: this.patchUrl });
    const outStream = fs.createWriteStream(path.join(this.baseDir, this.fileName));
    this.reqStream.pipe(outStream);
    // 监听response事件，当接收到响应头时，返回一个http.IncomingMessage实例 用于获取响应头信息
    this.reqStream.on('response', res => {
      this.totalBytes = parseInt(res.headers['content-length'], 10);
      this.status = '1';
    });

    //  监听错误信息
    this.reqStream.on('error', err => {
      this.error = err;
      this.status = '3';
      this.downloadCallback && this.downloadCallback('error', { err: this.error });
    });

    // 监听数据响应
    this.reqStream.on('data', chunk => {
      this.receivedBytes += chunk.length;
      this.showProcess(this.receivedBytes, this.totalBytes);
    });

    // 下载完成
    this.reqStream.on('end', () => {
      this.status = '4';
      this.downloadCallback && this.downloadCallback('finished');
    });
  }

  // 暂停下载
  pauseDownloadFile() {
    this.reqStream.pause();
    this.status = '2';
    this.downloadCallback && this.downloadCallback('pause');
  }

  // 恢复下载
  resumeDownloadFile() {
    this.reqStream.resume();
    this.status = '1';
    this.downloadCallback && this.downloadCallback('resume');
  }

  // 重新下载
  restartDownloadFile() {
    this.date = new Date.getTime();
    this.reqStream = null; //   利用request 创建一个可读流
    this.status = '0'; // 在排队：0 进行中：1  暂停 ：2  错误：3  完成：4  默认在排队中
    this.percentage = 0;
    this.downloadCallback = null;
    this.error = null;
    this.receivedBytes = 0;
    this.totalBytes = 0;
    this.downloadFile();
    this.downloadCallback && this.downloadCallback('restart');
  }
}

module.exports = StreamDownload;
