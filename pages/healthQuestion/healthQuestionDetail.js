// pages/healthQuestion/healthQuestionDetail.js
const urlPath = require('../common/config').url_microService;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionId: '',
    title: '',
    detail: '',
    createTime: '',
    answerList: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      questionId: options.questionId
    });
    this.getQuestionDetail();
    this.getDoctorAnswer();
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
    this.getQuestionDetail();
    this.getDoctorAnswer();
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
   * 获取问题详情
   */
  getQuestionDetail: function() {
    console.log(this.data.questionId);
    var that = this;
    wx.request({
      url: urlPath + '/question/selectQuestionDetailById?questionId=' + this.data.questionId,
      method: 'GET',
      data: {
        questionId: this.data.questionId,
      },
      success: function(e) {
        console.log(e);
        if (e.data.code == 100) {
          wx.showToast({
              title: e.data.msg,
              icon: "success",
            }),
            that.setData({
              title: e.data.object.title,
              detail: e.data.object.detail,
              createTime: e.data.object.createTime.substring(0, 10),
            })
        } else {
          wx.showToast({
            title: e.data.msg,
            icon: 'none',
          })
        }
      }
    })
  },
  /**
   * 医生回答列表
   */
  getDoctorAnswer: function() {
    var that = this;
    wx.request({
      url: urlPath + '/question/questionAnswer?questionId=' + this.data.questionId,
      method: 'GET',
      data: {
        questionId: this.data.questionId,
      },
      success: function(e) {
        console.log(e);
        that.setData({
          answerList: e.data.list,
        })
      }
    })
  },
})