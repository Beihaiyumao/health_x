// pages/healthQuestion/healthQuestion.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionList:'',
    total:'',
    pageNum:'',
    isFristPage: true,
    isLastPage:true,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
    wx.request({
      url: 'http://39.105.56.223/health-0.0.1-SNAPSHOT/question/allQuestion',
      method:'POST',
      success:function(e){
        console.log(e);
        that.setData({
          questionList:e.data.list,
          total:e.data.total,
          pageNum:e.data.pageNum,
          isFristPage:e.data.isFristPage,
          isLastPage:e.data.isLastPage,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})