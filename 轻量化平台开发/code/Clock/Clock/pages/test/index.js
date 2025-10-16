// pages/test/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onReady: function () {
    var ctx = wx.createCanvasContext('myCanvas')
    ctx.setStrokeStyle('#ff0000')
    ctx.setLineWidth(2)
    ctx.moveTo(160, 100)
    ctx.arc(100, 100, 60, 0, 2 * Math.PI, true)

    ctx.moveTo(140, 100)
    ctx.arc(100, 100, 40, 0, Math.PI, false)

    ctx.moveTo(85,80)
    ctx.arc(80, 80, 5, 0, 2 * Math.PI, true)

    ctx.moveTo(125, 80)
    ctx.arc(120, 80, 5, 0, 2 * Math.PI, true)

    ctx.stroke()
    ctx.draw()
  }
})