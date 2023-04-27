const app = getApp()
Page({
  data: {
    userInfo: {},
    hasUserInfo: false
  },
  credit: function () {
    wx.request({
      url: 'http://127.0.0.1:3000/credit',
      data: { token: app.globalData.token },
      success: res => {
        console.log(res.data)
      }
    })
  },
  getUserInfo: function () {
    wx.getUserProfile({
      desc: '获取头像昵称',
      success: res => {
        console.log(res)
        wx.setStorage({ key: 'userInfo', data: res.userInfo })
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },
  sendUserInfo: function () {
    var token = app.globalData.token
    wx.getUserProfile({
      desc: '获取头像昵称',
      success: res => {
        wx.request({
          url: 'http://127.0.0.1:3000/userinfo?token=' + token,
          method: 'post',
          data: {
            rawData: res.rawData,
            signature: res.signature,
            encryptedData: res.encryptedData,
            iv: res.iv
          }
        })
      }
    })
  }
})