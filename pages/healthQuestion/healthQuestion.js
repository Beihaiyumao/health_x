// pages/healthQuestion/healthQuestion.js
const urlPath = require('../common/config').url_microService;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionList: '',
    total: '',
    pageNum: '',
    isFristPage: true,
    isLastPage: true,

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
    var that = this;
    wx.request({
      url: urlPath + '/question/allQuestion',
      method: 'GET',
      success: function(e) {
        console.log(e);
        that.setData({
          questionList: e.data.list,
          total: e.data.total,
          pageNum: e.data.pageNum,
          isFristPage: e.data.isFristPage,
          isLastPage: e.data.isLastPage,
        })
      }
    })
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
   * 点击新增按钮
   */
  addHealthQuestion: function() {
    if (wx.getStorageSync('userId') != null && wx.getStorageSync('userId') != "" && wx.getStorageSync('userId') != undefined) {
      wx.navigateTo({
        url: '../healthQuestion/addHealthQuestion',
      })
    } else {
      this.showErrorToastUtils();
    }

  },
  // 未登录提示
  showErrorToastUtils: function (e) {
    wx.showModal({
      title: '您未登录！',
      content: '确定去登录吗?',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../login/login'
          });
        } else if (res.cancel) {
          wx.switchTab({
            url: '../healthQuestion/healthQuestion',
          })
        }
      }
    })
  },
})