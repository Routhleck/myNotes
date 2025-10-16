Page({
    data: {
      current: 0
    },
    swiperChange: function(e) {
      this.setData({
        current: e.detail.current
      })
    }
  })