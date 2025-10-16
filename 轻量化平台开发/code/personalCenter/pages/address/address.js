// pages/address/address.js
Page({
  data: {
    addressInfo: null
  },
  chooseAddress() {
    wx.chooseAddress({
      // 成功之后，把所有数据存放在addressInfo里，在wxml中调用
      success: res => {
        this.setData({
          addressInfo: res
        })
      },
      // 接口返回失败信息，打印在控制台中
      fail: err => {
        console.log(err)
      }
    })
  }
})