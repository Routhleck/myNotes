// 引入fetch文件
const fetch=require('../../utils/fetch.js')
Page({
  data: {
  },
  onLoad: function (options) {
    wx.showLoading({
      title: "努力加载中"
    })
    // 设置小程序导航栏标题文字内容
    wx.setNavigationBarTitle({ 
      title: '消费记录' 
    })
    // 请求消费记录接口 
    fetch('food/record').then((res)=>{
      // 关闭加载信息
      wx.hideLoading();
      this.setData({
        listData:res.data
      })
    }) 
  }
})