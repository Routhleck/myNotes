// pages/person/person.js
Page({
  info: function() {
    // 保留当前页面，点击页面左上角箭头，返回上一个页面
    wx.navigateTo({
      url: '/pages/detail/detail',
    })
  },
  order: function(e) {
    // 跳转到订单查询页面 
    // wx.redirectTo({
    //   url: '/pages/order/order',
    // })
    wx.navigateTo({
      url: '/pages/order/order',
    })
  },
  address: function() {
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
  contact: function (e) {
    // 调用拨打电话API
    wx.makePhoneCall({
      phoneNumber: '400-321'   // 该电话号码为模拟数据
    })
  }
})