// pages/healthArticle/healthArticle.js
const urlPath = require('../common/config').url_microService;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgList: [{
      articleId: 1, //文章id
      title: "标题一", //标题
      createTime: "2017-3-5 23:01:59", //创建时间
      article: '', //导语
      author: '', //作者
      content: '', //内容
      pic: "../../images/wechatHL.png", //图片
    }, ],
    isFirstPage: '', //是否是第一页
    isLastPage: '', //是否是最后一页
    pages: '', //一共多少页
    total: '', //总共多少条数据
    pageNum: 1,
    isLast: false, //判断是否是最后一页
    search_title: '',
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
    var that = this;
      that.getHealthArticle();
    
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
    var that=this;
      that.getHealthArticle();
    
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
    var that = this;
    that.setData({
      pageNum: this.data.pageNum - 1,
      isLast: false,
    })
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    setTimeout(function() {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      if (that.data.search_title != null || that.data.search_title != '') {
        that.searchQuestion();
      } else {
        that.getHealthArticle();
      }

    }, 1500);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    that.setData({
        pageNum: this.data.pageNum + 1,
      }),
      wx.showToast({
        title: '正在加载', //这里成功
        icon: 'loading',
        duration: 1500,
      }),
      setTimeout(function() {
      if (that.data.search_title != null || that.data.search_title != '') {
          that.searchQuestion(); 
        } else {
          that.getHealthArticle();
        }

        if (that.data.isLastPage == true) {
          that.setData({
            isLast: true,
          });
        }
      }, 1500)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 获取文章列表
   */
  getHealthArticle: function() { //定义函数名称
    var that = this;
    console.log(this.data.pageNum+"不是搜索");
    wx.request({
      url: urlPath + '/healthyArticle/healthyArticle', //请求地址
      header: { //请求头
        "Content-Type": "applciation/x-www-form-urlencoded"
      },
      data: {
        currentPage: this.data.pageNum,
      },
      method: "GET", //get为默认方法/POST
      success: function(res) {
        console.log(res);
        that.setData({
          msgList: res.data.list,
          total: res.data.total,
          isFirstPage: res.data.isFirstPage,
          isLastPage: res.data.isLastPage,
          pages: res.data.pages,
          total: res.data.total,
          pageNum: res.data.pageNum,
        });
      }
    });
  },
  /**
   * 文章详情
   */
  gotoProjectDetail: function(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/healthArticle/healthArticleDetail?articleId=' + e.currentTarget.id,
    })

  },
  /**模糊搜索文章 */
  searchQuestion: function() {
    var that = this;
    console.log(this.data.pageNum + "是搜索");

    if (this.data.search_title != null) {
      wx.request({
        url: urlPath + '/healthyArticle/selectHealthyArticleByTitle',
        method: 'GET',
        data: {
          title: this.data.search_title,
        },
        success: function(res) {
          console.log(res);
          if (res.data.list.length == 0) {
            wx.showToast({
              title: '没有该内容哦',
              icon: "success",
              duration: 1500,
            })
          }
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
  },
})