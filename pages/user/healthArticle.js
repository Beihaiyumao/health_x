// pages/user/healthArticle.js
const urlPath = require('../common/config').url_microService;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search_title: '',
    userId: '',
    msgList:'',
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏
    pages: '', //一共多少页
    total: '', //总共多少条数据
    pageNum: 1,
    navbarActiveIndex: 0,
    navbarTitle: [
      "健康百科",
      "健康问答"
    ],
    questionList: '', //收藏问题列表
    isLastArticle:false,//
    isLastQuestion:false,//
    pageSize: 10, //每页显示多少数据
    loading:true,
  },
  /**
   * 点击导航栏
   */
  onNavBarTap: function(event) {
    // 获取点击的navbar的index
    let navbarTapIndex = event.currentTarget.dataset.navbarIndex
    // 设置data属性中的navbarActiveIndex为当前点击的navbar
    this.setData({
      navbarActiveIndex: navbarTapIndex
    })
    if (this.data.navbarActiveIndex == '0') {
      this.getMyHealthArticle();
    } else {
      this.getMyHealthQuestion();
    }
  },

  /**
   * 
   */
  onBindAnimationFinish: function({
    detail
  }) {
    // 设置data属性中的navbarActiveIndex为当前点击的navbar
    this.setData({
      navbarActiveIndex: detail.current,
      loading:true,
    })
    if (this.data.navbarActiveIndex == '0') {
      this.getMyHealthArticle();
     
    } else {
      this.getMyHealthQuestion();
    }
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
    this.getMyHealthArticle();
    // this.getMyHealthQuestion();
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
    var that = this;
    that.setData({
        pageSize: this.data.pageSize + 10,
      }),
      wx.showToast({
        title: '正在加载', //这里成功
        icon: 'loading',
        duration: 1500,
      })
    if (this.data.navbarActiveIndex == '0') {
      this.getMyHealthArticle();
    } else {
      this.getMyHealthQuestion();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 获取我收藏的文章列表
   */
  getMyHealthArticle: function() {
    var that = this;
    wx.request({
      url: urlPath + '/user/myCollectionArticle',
      method: 'GET',
      data: {
        userId: wx.getStorageSync('userId'),
        pageSize: this.data.pageSize,
      },
      success: function(res) {
        console.log(res);
        if(res.data.total==0){
          wx.showToast({
            title: '您还没有收藏任何文章哦',
            icon:'none',
          })
        }else{
          that.setData({
            msgList: res.data.list,
            total: res.data.total,
            isFirstPage: res.data.isFirstPage,
            pages: res.data.pages,
            total: res.data.total,
            isFromSearch: true, //第一次加载，设置true
            searchLoading: true, //把"上拉加载"的变量设为true，显示
            pageNum: res.data.pageNum,
            isLastArticle: res.data.isLastPage,
            loading:false,
          })
          for (var i = 0; i < res.data.list.length; i++) {
            var createTime = "msgList[" + i + "].createTime";
            that.setData({
              [createTime]: that.renderTime(res.data.list[i].createTime),
            })
          }
        }
      }
    })
  },
  //时间转换
  renderTime(date) {
    var dateee = new Date(date).toJSON();
    return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
  },
  /**
   * 获取我收藏的问题
   */
  getMyHealthQuestion: function() {

    var that = this;
    wx.request({
      url: urlPath + '/question/selectMyCollectionQuestion',
      method: 'GET',
      data: {
        userId: wx.getStorageSync('userId'),
        pageSize: this.data.pageSize,
      },
      success: function(e) {
        console.log(e);
        if(e.data.total==0){
          wx.showToast({
            title: '您还没有收藏任何问题哦',
            icon:'none',
          })
        }else{
          that.setData({
            questionList: e.data.list,
            isLastQuestion: e.data.isLastPage,
            loading:false,
          })
        }

      }
    })
  },
  /**
 * 文章详情
 */
  gotoProjectDetail: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/healthArticle/healthArticleDetail?articleId=' + e.currentTarget.id,
    })

  },
  /**
 * 问题详情
 */
  gotoQuetionDetail: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/healthQuestion/healthQuestionDetail?questionId=' + e.currentTarget.id,
    })

  },
})