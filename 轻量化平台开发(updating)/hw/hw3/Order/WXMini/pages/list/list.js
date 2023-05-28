const fetch = require('../../utils/fetch.js')
Page({
  data: {
    activeIndex: 0,
    toView: "a0",
    cartList: [],
    currentType: 0,
    currentIndex: 0,
    sumMonney: 0, // 总价钱
    cupNumber: 0, // 购物车里商品的总数量
    showCart: false, // 是否展开购物车
    loading: false,
    containerH: '',
    heightArr: [], // 数组:查找到的所有单元的内容高度
    order_id: 1
  },
  onLoad: function(options) {
    // 显示模态对话框
    wx.showLoading({
      title: "努力加载中"
    })
    // 请求数据
    fetch('food/list').then((res) => {
      wx.hideLoading();
      this.setData({
        listData: res.data,
        loading: true
      })
    })
  },

  // 点击左侧菜单项选择
  selectMenu: function(e) {
    let index = e.currentTarget.dataset.index
    console.log(index)
    this.setData({
      activeIndex: index,
      toView: "a" + index,
    })
  },
  // 加入购物车
  addToCart: function(e) {
    console.log(e)
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    this.setData({
      currentType: type,
      currentIndex: index,
    });
    var a = this.data
    // 声明数组addItem
    var addItem = {
      "name": a.listData[a.currentType].foods[a.currentIndex].name,
      "price": a.listData[a.currentType].foods[a.currentIndex].specfoods[0].price,
      "number": 1,
      "sum": a.listData[a.currentType].foods[a.currentIndex].specfoods[0].price,
    }
    var sumMonney = a.sumMonney + a.listData[a.currentType].foods[a.currentIndex].specfoods[0].price;
    // 把新数组(addItem) push到 原数组cartList
    var cartList = this.data.cartList;
    cartList.push(addItem);
    this.setData({
      cartList: cartList,
      showModalStatus: false,
      sumMonney: sumMonney,
      cupNumber: a.cupNumber + 1,
    });
  },
  // 展开购物车
  showCartList: function() {
    if (this.data.cartList.length != 0) {
      this.setData({
        showCart: !this.data.showCart,
      });
    }
  },
  // 购物车添加商品数量
  addNumber: function(e) {
    var index = e.currentTarget.dataset.index;
    var cartList = this.data.cartList;
    cartList[index].number++;
    var sum = this.data.sumMonney + cartList[index].price;
    cartList[index].sum += cartList[index].price;
    this.setData({
      cartList: cartList,
      sumMonney: sum,
      cupNumber: this.data.cupNumber + 1,
    })
  },
  // 购物车减少商品数量
  decNumber: function(e) {
    var index = e.currentTarget.dataset.index;
    var cartList = this.data.cartList;
    var sum = this.data.sumMonney - cartList[index].price;
    cartList[index].sum -= cartList[index].price;
    cartList[index].number == 1 ? cartList.splice(index, 1) : cartList[index].number--;
    this.setData({
      cartList: cartList,
      sumMonney: sum,
      showCart: cartList.length == 0 ? false : true,
      cupNumber: this.data.cupNumber - 1,
    });
  },
  // 清空购物车
  clearCartList: function() {
    this.setData({
      cartList: [],
      showCart: false,
      sumMonney: 0,
      cupNumber: 0
    });
  },
  // 点击"选好了"，缓存购物车的值
  goBalance: function(e) {
    if (this.data.sumMonney == 0) {
      return
    }
    // 请求接口返回参数{error: 0（错误代码）, order_id: 1}}
    var order_id = this.data.order_id
    var order_num = this.data.cupNumber
    var cartList = this.data.cartList
    // 将cartList转为json字符串
    cartList = JSON.stringify(cartList)
    var method = "POST"
    var sendData = JSON.stringify({
      id: order_id,
      num: order_num,
      cartList: cartList
    })
    console.log(sendData)
    fetch("food/order", sendData, method).then(function(res) {
      if (res.data.error !== 0) {
        wx.showModal({
          title: '下单失败',
          content: '操作失败请重试',
        })
        return
      }
      // 请求成功后跳转到订单确认页面，把返回的order_id订单编号传过去
      wx.navigateTo({
        url: '../order/balance/balance?order_id=' + res.data.order_id
      })
    })
  }
})