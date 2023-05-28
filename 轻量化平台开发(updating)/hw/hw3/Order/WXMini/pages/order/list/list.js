// 引入文件
const fetch = require('../../../utils/fetch')
Page({
  data: {
    orderList: [],
    // 数据是否加载完毕
    is_last: false
  },
  // 加载文件的标识
  last_id: 0,
  // 定义请求接口，封装请求的公共部分（三个参数：数据、成功、失败）
  loadData: function(data, success, fail) {
    // 每一页10条数据
    data.row = 10
    fetch('food/orderlist', data).then((res) => {
      this.last_id = res.data.last_id
      this.setData({
        is_last: res.data.is_last
      }, () => {
        success(res.data)
      })
    }, fail)
  },

  onLoad: function(options) {
    wx.showLoading({
      title: '加载中...'
    })
    this.loadData({
      last_id: 0
    }, (data) => {
      this.setData({
        orderList: data.list,
      }, () => {
        wx.hideLoading();
      })
    })
  },
  onShow: function() {
    // 获取app
    var app = getApp();
    // 获取到并判断全局变量isReloadOrderList，是否为true，为true就刷新
    if (app.isReloadOrderList) {
      this.onLoad()
      app.isReloadOrderList = false
    }
  },
  orderdetail: function(e) {
    var index = e.currentTarget.dataset.postid
    wx.navigateTo({
      url: '../detail/detail?order_id=' + index
    })
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.loadData({
      last_id: 0
    }, (data) => {
      this.setData({
        orderList: data.list,
      }, () => {
        // 隐藏导航条栏加载框
        wx.hideNavigationBarLoading();
      })
    })
  },
  //  上拉触底事件
  onReachBottom: function() {
    // 判断数据是否到底，如果is_last为true到底了，则不执行请求
    if (this.data.is_last) {
      return
    }
    // 显示加载图标  
    wx.showLoading({
      title: '玩命加载中',
    })
    this.loadData({
      last_id: this.last_id,
    }, (data) => {
      var orderList = this.data.orderList;
      for (var i = 0; i < data.list.length; i++) {
        orderList.push(data.list[i]);
      }
      // 设置数据  
      this.setData({
        orderList: orderList
      }, () => {
        // 隐藏加载框  
        wx.hideLoading();
      })
    })
  }
})