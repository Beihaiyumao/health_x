// pages/user/user.js
const urlPath = require('../common/config').url_microService;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headPage: '',
    userId: '',
    username: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(wx.getStorageSync('userId'));
    if (wx.getStorageSync('userId') == "") {
      this.showErrorToastUtils();

    }

  },
  /**
   * 退出登录
   */
  loginOut: function() {
    wx.clearStorageSync("userId");
    wx.clearStorageSync();
    wx.switchTab({
      url: '../index/index',
    })

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
    this.getUserInfo();
  },
  /**
   * 获取用户信息
   */
  getUserInfo: function() {
    console.log(wx.getStorageSync('userId'));
    var that = this;
    if (wx.getStorageSync('userId') == "") {

      this.showErrorToastUtils();
    }
    wx.request({
      url: urlPath + '/user/selectUserInfo',
      method: 'GET',
      data: {
        userId: wx.getStorageSync('userId'),
      },
      success: function(e) {
        console.log(e);
        if (e.data.code == 100) {
          that.setData({
            headPage: e.data.object.pic,
            username: e.data.object.username,
          })
        }
      }
    })
  },
  // 未登录提示
  showErrorToastUtils: function(e) {
    wx.showModal({
      title: '您未登录！',
      content: '确定去登录吗?',
      success: function(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../login/login'
          });
        } else if (res.cancel) {
          wx.switchTab({
            url: '../index/index',
          })
        }
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
   * 跳转我的收藏
   */
  myHealthArticle: function() {
    wx.navigateTo({
      url: '../user/healthArticle',
    })
  },
  /**
   * 跳转我的问题
   */
  myHealthQuestion: function() {
    wx.navigateTo({
      url: '../user/healthQuestion',
    })
  },
  /**
   * 跳转修改密码
   */
  changePassword: function() {
    wx.navigateTo({
      url: '../user/changPassword',
    })
  },
  /**
   * 跳转个人中心
   */
  userInfo: function() {
    wx.navigateTo({
      url: '../user/userInfo',
    })
  }
})