// pages/user/feedback.js
const urlPath = require('../common/config').url_microService;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    feedback: '', //反馈内容
    wechat: '',
    maxTextLen: 200, //最大输入反馈内容字数
  },
  /**
   * 获取用户反馈内容
   */
  getFeedback: function(e) {
    this.setData({
      feedback: e.detail.value
    })
  },
  /**
   * 用户联系方式
   */
  wechat: function(e) {
    this.setData({
      wechat: e.detail.value
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
   * 检验用户输入的合法性
   */
  checkUserInput: function() {
    if (this.data.feedback == undefined || this.data.feedback == null || this.data.feedback == "") {
      wx.showToast({
        title: '请输入反馈内容',
        icon: 'none',
      })
      return false;
    } else if (this.data.feedback.length > this.data.maxTextLen) {
      wx.showToast({
        title: '反馈内特请保持在{{maxTextLen}}字内',
        icon: 'none',
      })
      return false
    } else if (this.data.wechat == undefined || this.data.wechat == null || this.data.wechat == "" || this.data.wechat.length > 20) {
      wx.showToast({
        title: '请输入正确的联系方式,以便我们能第一时间和您取得联系',
        icon: 'none',
      })
      return false
    }
    return true;
  },
  /**
   * 提交反馈
   */
  addFeedback: function() {
    var that = this;
    var isTrue = that.checkUserInput();
    if (isTrue) {
      wx.request({
        url: urlPath + '/admin/insertFeedback',
        method: 'POST',
        data: {
          userId: wx.getStorageSync('userId'),
          msg: this.data.feedback,
          wechat: this.data.wechat,
        },
        success: function(e) {
          console.log(e);
          if (e.data.code == 100) {
            wx.showToast({
                title: '反馈成功',
                icon: 'success',
              }),
              wx.switchTab({
                url: '../user/user'
              });
          } else {
            wx.showToast({
              title: '反馈失败,请重试',
              icon: 'loading',
            })
          }
        }
      })
    }
  },
})