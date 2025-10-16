// pages/test/test.js
Page({
  chooseImage: function() {
    wx.chooseImage({
      count: 1, // 最多可以选择9张图片
      sizeType: ['original', 'compressed'], // 图片尺寸 原图，压缩图
      sourceType: ['album', 'camera'], // 图片来源 从相册选图，使用相机
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
      }
    })
  },
  chooseAddress: function() {
    wx.chooseAddress({
      // 返回用户选择的收货地址信息
      success: function(res) {
        console.log(res.userName) // 收货人姓名
        console.log(res.postalCode) // 邮编
        console.log(res.provinceName) // 省
        console.log(res.cityName) // 市
        console.log(res.countyName) // 区、县
        console.log(res.detailInfo) // 详细收货地址
        console.log(res.nationalCode) // 收货地址国家码
        console.log(res.telNumber) // 收货人手机号码
      }
    })
  },
  makePhoneCall: function() {
    wx.makePhoneCall({
      phoneNumber: '400-100-1111', // 需要拨打的电话号码
    })
  }
})