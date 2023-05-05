// pages/index/index.js
var tempFilePath = null
var audioCtx = wx.createInnerAudioContext()
var rec = wx.getRecorderManager()
rec.onStop(res => {
  tempFilePath = res.tempFilePath
  console.log(tempFilePath)
})
Page({
  // 开始录音
  record: function() {
    rec.start()
  },
  // 停止录音
  stop: function() {
    rec.stop()
  },
  // 回放录音
  playback: function() {
    audioCtx.src = tempFilePath
    audioCtx.play()
  },
  // 上传录音文件
  upload: function() {
    if (!tempFilePath) {
      wx.showToast({
        title: '您还没有录音',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.uploadFile({
      url: 'http://localhost:3000/upload', // 服务器地址
      filePath: tempFilePath,
      name: 'file'
    })
  },
  // 播放文章
  play: function() {
    wx.showLoading({
      title: '下载音频文件中',
      mask: true
    })
    // 从服务器上，把音频文件下载到本地
    wx.downloadFile({
      url: 'http://localhost:3000/1.mp3', // 服务器资源地址
      success: res => {
        // 下载完成，播放音频
        audioCtx.src = res.tempFilePath
        audioCtx.play()
        wx.hideLoading()
      }
    })
  },
  // 暂停/继续播放
  pause: function() {
    if (audioCtx.paused) {
      audioCtx.play()
    } else {
      audioCtx.pause()
    }
  }
})