// pages/index/index.js
Page({
  changeImage: function(e) {
    // 第1种方式：只能跳转到tabBar页面
    wx.switchTab({
      url: '/pages/person/person'
    })
    // 第2种方式：可以跳转到tabBar或者非tabBar页面
    // wx.reLaunch({
    //   url: '/pages/person/person'
    // })
  }
})