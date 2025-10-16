const fetch = require('../../../utils/fetch.js')
Page({
  data: {
    sumMonney: 0,
    cutMonney: 0,
    note: '',
    max: '20',
    taken: '',
  },
  onLoad: function(options) {
    // 请求订单接口
    fetch('food/order', { order_id: options.order_id}).then((res) => {
      var foods = res.data.foods
      // 计算总价
      var sum = 0;
      for (var i in foods) {
        sum += foods[i].price * foods[i].num
      }
      if (res.data.promotion.length > 0 && sum > res.data.promotion.discount) {
        sum -= res.data.promotion.discount
      }
      this.setData({
        order: res.data,
        sumMonney: sum
      })
    })
  },
  // 实时监控textarea值，采用同步的方式存储note值（'key',value）
  listenerTextarea: function(e) {
    var note = e.detail.value;
    wx.setStorageSync('note', note)
  },
  // 点击“去支付”
  gotopay: function(e) {
    var order_id = this.data.order_id
    // 请求支付接口，把订单号传给后台，返回数据{error: 0, order_id: 1}
    var method = 'POST'
    fetch('food/pay', {order_id:order_id},method).then((res)=>{
      if(res.data.error !== 0){
        wx.showModal({
          title: '支付失败',
          content: '请您重新尝试',
        })
        return
      }
      wx.showToast({
        title: '支付成功',
        icon: 'success',
        duration: 2000,
        success: function () {
          setTimeout(function () {
            wx.navigateTo({
              url: '../detail/detail?order_id=' + res.data.order_id
            })
          })
        }
      })
    });
  }
})