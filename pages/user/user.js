// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
    if (wx.getStorageSync('userId') == "") {

      this.showErrorToastUtils();
    }

  },
  // 错误提示
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

  }
})