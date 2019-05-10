// pages/index/bmi.js
const urlPath = require('../common/config').url_microService;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '',
    weight: '',
    resultState: false,
    result: '',
    hidden: true,
    share:true,
  },
  /**
   * 获取身高m
   */
  height: function(e) {
    this.setData({
      height: e.detail.value
    })
  },
  /**
   * 获取体重kg
   */
  weight: function(e) {
    this.setData({
      weight: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.sharePic();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
  },


sharePic:function(){
  let promise2 = new Promise(function (resolve, reject) {
    wx.getImageInfo({
      src: '/images/healthTool/result.jpg',
      success: function (res) {
        resolve(res);
      }
    })
  });
  Promise.all([
    promise2
  ]).then(res => {
    const ctx = wx.createCanvasContext('shareImg')
    //主要就是计算好各个图文的位置
    ctx.drawImage('../../' + res[0].path, 0, 0, 545, 771)
    ctx.setTextAlign('center')
    ctx.setFillStyle('black')
    ctx.setFontSize(22)
    ctx.fillText('BMI计算器', 545 / 2, 30)
    ctx.fillText('您的身高是:'+this.data.height+'cm', 545 / 2, 100)
    ctx.fillText('您的体重是:'+this.data.weight+'kg', 545 / 2, 140)
    ctx.fillText(this.data.result, 545 / 2, 170)
    ctx.stroke()
    ctx.draw()
  });
},
  /**
    * 生成分享图
   */
  share: function () {
    var that = this;
    wx.showLoading({
      title: '努力生成中...'
    })
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 545,
      height: 771,
      destWidth: 545,
      destHeight: 771,
      canvasId: 'shareImg',
      success: function (res) {
        console.log(res.tempFilePath);
        that.setData({
          prurl: res.tempFilePath,
          hidden: false
        })
        wx.hideLoading()
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  /**
   * 保存到相册
  */
  save: function () {
    var that = this
    //生产环境时 记得这里要加入获取相册授权的代码
    wx.saveImageToPhotosAlbum({
      filePath: that.data.prurl,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好哒',
          confirmColor: '#72B9C3',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              that.setData({
                hidden: true
              })
            }
          }
        })
      }
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 检测用户输入
   */
  checkUserInput: function() {
    var sz = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
    if (!(sz.test(this.data.height)) || this.data.height <= 50.00 || this.data.height > 250) {
      wx.showToast({
        title: '请输入正确的身高',
        icon: 'none',
      })
      return false;
    } else if (!sz.test(this.data.weight) || this.data.weight <= 0.00 || this.data.weight > 150.00) {
      wx.showToast({
        title: '请输入正确的体重',
        icon: 'none',
      })
      return false
    }
    return true;
  },
  /**
   * 开始计算
   */
  calBMI: function() {
    var that = this;
    var checkInputInfo = that.checkUserInput();
    if (checkInputInfo) {
      wx.request({
        url: urlPath + '/healthyTool/bmi',
        method: 'GET',
        data: {
          height: this.data.height,
          weight: this.data.weight,
        },
        success: function(e) {
          //数据有误
          if (e.data.code == 200) {
            wx.showToast({
              title: e.data.msg,
              icon: 'none',
            })
            
          } else {
            console.log(e);
            that.setData({
              resultState: true,
              result: e.data.msg,
              share:false,
            })
            that.sharePic();
          //  that.share();
          }
        },
        fail:function(){
          wx.showToast({
            title: "未知错误,请重试!",
            icon: 'none',
          })
        }
      })
    }
  },
})