// pages/user/healthQuestion.js
const urlPath = require('../common/config').url_microService;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: wx.getStorageSync('userId'),
    msgList: [{
      title: "标题一", //标题
      createTime: "2017-3-5 23:01:59", //创建时间
      detail: '', //问题内容
      questionId: '', //问题id
    }, ],
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏
    isFirstPage: '', //是否是第一页
    isLastPage: '', //是否是最后一页
    pages: '', //一共多少页
    total: '', //总共多少条数据
    pageNum: 1,
    search_title: '', //模糊查询
  },
  //获取用户输入的值
  search_title: function(e) {
    this.setData({
      search_title: e.detail.value
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
    this.getMyHealthQuestion();
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
   * 获取我的问题列表
   */
  getMyHealthQuestion: function() {
    var that = this;
    wx.request({
      url: urlPath+'/user/myQuestion',
      method: 'GET',
      data: {
        userId: this.data.userId,
      },
      success: function(res) {
        console.log(res);
        that.setData({
          msgList: res.data.list,
          isFirstPage: res.data.isFirstPage,
          isLastPage: res.data.isLastPage,
          pages: res.data.pages,
          total: res.data.total,
          isFromSearch: true, //第一次加载，设置true
          searchLoading: true, //把"上拉加载"的变量设为true，显示
          pageNum: res.data.pageNum,
        })
      }
    })
  },
  /**
   * 模糊查询
   */
  searchMyQuestion: function() {
    var that = this;
    if (this.data.search_title != null) {
      wx.request({
        url: urlPath+'/user/selectMyQuestion',
        method: 'GET',
        data: {
          title: this.data.search_title,
          userId:this.data.userId,
        },
        success: function(res) {
          console.log(res);
          that.setData({
            msgList: res.data.list,
            isFirstPage: res.data.isFirstPage,
            isLastPage: res.data.isLastPage,
            pages: res.data.pages,
            total: res.data.total,
            isFromSearch: true, //第一次加载，设置true
            searchLoading: true, //把"上拉加载"的变量设为true，显示
            pageNum: res.data.pageNum,
          })
        }
      })
    }
  }
})