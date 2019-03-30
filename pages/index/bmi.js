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

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
            })
          }
        }
      })
    }
  },
})