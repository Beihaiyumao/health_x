// pages/user/userInfo.js
const urlPath = require('../common/config').url_microService;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headPhoto: "", //头像
    username: '', //用户名
    address: '', //地址
    email: '', //邮箱不允许修改
    phone: '', //电话
    sex: '', //性别

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getUserInfo();
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
   * 获取用户信息
   */
  getUserInfo: function() {
    var that=this;
    console.log(wx.getStorageSync('userId'));
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
            headPhoto: e.data.object.pic,
            username: e.data.object.username,
            address: e.data.object.address,
            email: e.data.object.email,
            sex: e.data.object.sex,
            phone: e.data.object.phone,
          })
        }
      }
    })
  },
  /**
   * 保存修改信息
   */
  saveChangeUserInfo: function() {

  },
  /**
   * 校验用户输入合法性
   */
  checkInput: function() {

  },
})