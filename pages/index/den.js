// pages/index/den.js
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
    height: '',
    weight: '',
    age: '',
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
   * 获取年龄
   */
  age: function(e) {
    this.setData({
      age: e.detail.value
    })
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
   * 检查用户输入
   */
  checkInput: function() {
    var sz = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
    var zs = /^([0-9]{1,})$/;
    if (!(sz.test(this.data.height)) || this.data.height <= 0.00 || this.data.height > 2.50) {
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
    } else if (!zs.test(this.data.age) || this.data.age <= 0 || this.data.age >= 120) {
      wx.showToast({
        title: '请输入正确的年龄',
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
   * 每日能量需求
   */
  calDEN: function() {
    var that = this;
    var userInputState = that.checkInput();
    if (userInputState) {
      wx.request({
        url: urlPath + '/healthyTool/den',
        method: "GET",
        data: {
          height: this.data.height,
          weight: this.data.weight,
          age: this.data.age,
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