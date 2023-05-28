module.exports = function(path, data, method) {
  // 暴露接口
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://127.0.0.1:8081/api/' + path, //api地址
      method: method, // 请求方法
      data: data, // 参数
      header: {
        'Content-Type': 'json'
      }, // 请求头，默认
      success: resolve,
      fail: function() {
        reject()
        wx.showModal({
          showCancel: false,
          title: '失败'
        })
      }
    })
  })
}