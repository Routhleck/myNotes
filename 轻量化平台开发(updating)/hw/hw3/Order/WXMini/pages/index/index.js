// pages/home/home.js
const fetch = require('../../utils/fetch.js')
Page({
  data: {
    // 显示面板指示点
    indicatorDots: true,
    // 图片自动切换
    autoplay: true,
    // 自动切换时间间隔
    interval: 5000,
    // 滑动动画时长
    duration: 1000
  },
  onLoad: function(options) {
    // 显示模态对话框
    wx.showLoading({
      title: "努力加载中"
    })
    // 请求数据
    fetch('food/index').then((res) => {
      // 请求成功，关闭对话框
      wx.hideLoading();
      // 把接口返回数据setData给listData
      this.setData({
        listData: res.data,
      })
    },() => {
      // 请求失败，关闭对话框，执行fetch.js文件中的fail方法
      wx.hideLoading();
    });
  },
  gostart: function() {
    wx.navigateTo({
      url: "../list/list",
    })
  }
})