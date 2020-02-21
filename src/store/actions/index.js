const request = require('request')
const fs = require('fs')
const path = require('path')

// 定义执行动作
export const VIDEO_DOWNLOADING = 'VIDEO_DOWNLOADING'
export const VIDEO_DOWNLOAD_COMPLETE = 'VIDEO_DOWNLOAD_COMPLETE'
export const VIDEO_DOWNLOAD_PROGRESS = 'DOWNLOAD_PROGRESS'

// action 生成函数
// 下载视频
export const videoDownloading = videoId => {
  return {
    type: VIDEO_DOWNLOADING,
    videoId: videoId
  }
}

/** 下载中
 * @param {Object} payload {videoId percentage downloaded total}
 */
export const videoDownloadProgress = payload => {
    return {
      type: VIDEO_DOWNLOAD_PROGRESS,
      payload: payload
    }
  }
  
  // 下载完成
  export const videoDownloadComplete = videoId => {
    return {
      type: VIDEO_DOWNLOAD_COMPLETE,
      videoId: videoId
    }
  }
  
/**
 * @param {Object} videoInfo  {id url title downloadDir}
 */
export const downloadVideo = videoInfo => {
  return dispatch => {
    let receivedBytes = 0
    let totalBytes = 0
    let video = request({ method: 'GET', uri: videoInfo.url })
    video.pipe(
      fs.createWriteStream(path.join(videoInfo.downloadDir, videoInfo.fileName))
    )
    // 开始下载
    dispatch(videoDownloading(videoInfo.id))

    // 监听response事件，当接收到响应头时，返回一个http.IncomingMessage实例 用于获取响应头信息
    video.on('response', response => {
      console.log(response.headers)
      totalBytes = parseInt(response.headers['content-length'], 10)
    })

    //  监听错误信息
    video.on('error', error => {
      dispatch(videoDownloadComplete(videoInfo.id))
      console.error(error)
    })

    // 数据传递
    video.on('data', chunk => {
      receivedBytes += chunk.length
      let percentage = ((receivedBytes / totalBytes) * 100).toFixed(2)
      if (percentage % 2 === 0) {
        dispatch(
          videoDownloadProgress({
            videoId: videoInfo.id,
            percentage: percentage,
            downloaded: (receivedBytes / 1024 / 1024).toFixed(2),
            total: (totalBytes / 1024 / 1024).toFixed(2)
          })
        )
      }
    })

    // 下载完成
    video.on('end', () => {
      dispatch(videoDownloadComplete(videoInfo.id))
    })
  }
}

