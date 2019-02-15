// pages/index/whr.js
const urlPath = require('../common/config').url_microService;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexs: [{
        name: 0,
        value: '男'
      },
      {
        name: 1,
        value: '女'
      },
    ],
    sex: '',
    waist: '',
    hip: '',
  },
  /**
   * 获取性别
   */
  radioChange: function(e) {
    this.setData({
      sex: e.detail.value,
    })
  },
  /**
   * 获取腰围cm
   */
  waist: function(e) {
    this.setData({
      waist: e.detail.value,
    })
  },
  /**
   * 获取臀围cm
   */
  hip: function(e) {
    this.setData({
      hip: e.detail.value,
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
    if (!sz.test(this.data.waist) || this.data.waist <= 0 || this.data.waist >= 200.00) {
      wx.showToast({
        title: '请输入正确的腰围',
        icon: 'none',
      })
      return false;
    } else if (!sz.test(this.data.hip) || this.data.hip <= 0 || this.data.hip >= 200.00) {
      wx.showToast({
        title: '请输入正确的臀围',
        icon: 'none',
      })
      return false;
    } else if (this.data.sex == null || this.data.sex == "" || this.data.sex == undefined) {
      wx.showToast({
        title: '请选择性别',
        icon: 'none',
      })
      return false;
    }
    return true;
  },
  /**
   * 计算腰臀比
   */
  calWHR: function() {
    var that = this;
    var userInputState = that.checkUserInput();
    if (userInputState) {
      wx.request({
        url: urlPath + '/healthyTool/whr',
        method: 'GET',
        data: {
          waist: this.data.waist,
          hip: this.data.hip,
          sex: this.data.sex,
        },
        success: function(e) {
          if (e.data.code == 200) {
            wx.showToast({
              title: e.data.msg,
              icon: 'none',
            })
          } else {
            console.log(e);
          }
        }
      })
    }
  },
})