// pages/test/test.js
Page({
  onLoad: function(options) {
    // 保存数据缓存
    wx.setStorage({
      key: 'key', // 本地缓存中指定的key
      data: 'value', // 需要存储的内容（支持对象或字符串）
      success: res => {
        // 获取数据缓存
        wx.getStorage({
          key: 'key', // 本地缓存中指定的 key
          success: res => { // 接口调用成功的回调函数
            console.log(res.data)
          },
          fail: res => { } // 接口调用失败的回调函数
        })
      }, // 接口调用成功的回调函数
      fail: res => {} // 接口调用失败的回调函数
    })
  }
})