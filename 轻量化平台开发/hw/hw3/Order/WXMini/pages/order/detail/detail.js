const fetch = require('../../../utils/fetch.js')
Page({
  data: {
  },
  onLoad: function (options) {
    // 取出缓存的note值
    var note = wx.getStorageSync('note')
    wx.setNavigationBarTitle({
      title: '订单详情'
    })
    fetch('food/order', { order_id: options.order_id }).then((res) => {
      var foods = res.data.foods
      //算总价
      var sum = 0;
      for (var i in foods) {
        sum += foods[i].price * foods[i].num
      }
      if (res.data.promotion.length > 0 && sum > res.data.promotion.discount) {
        sum -= res.data.promotion.discount
      }
      this.setData({
        order: res.data,
        sumMonney: sum,
        note: note
      })
    })
  },
  onUnload: function () {
    var app = getApp();
    // 支付成功之后调到订单页面，通知订单页刷新
    app.isReloadOrderList = true
    wx.switchTab({
      url: '/pages/order/list/list'
    })
  }
})