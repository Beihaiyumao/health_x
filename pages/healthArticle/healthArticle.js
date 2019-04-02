// pages/healthArticle/healthArticle.js
const urlPath = require('../common/config').url_microService;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgList: [ ],
    isFirstPage: '', //是否是第一页
    isLastPage: '', //是否是最后一页
    pages: '', //一共多少页
    total: '', //总共多少条数据
    pageNum: 1,
    isLast: false, //判断是否是最后一页
    search_title: '',
    pageSize: 10,
    articleGenreList:[], //文章分类
    articleGenre:'',
    current_scroll: 999999999999,
    errorState:false,
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
    this.getHealthArticle();
    this.getArticleGenre();
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1500,
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

    // this.searchQuestion();
    // this.getArticleGenre();
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
   * 获取文章分类列表
   */
  getArticleGenre:function(){
    var that=this;
    wx.request({
      url: urlPath + '/admin/selectAllArticleGenre?pageSize=' + 100 + '&all=' + 100,
      method: "GET",
      success:function(e){
        console.log(e);
        that.setData({
          articleGenreList:e.data.list,
        })
      },
      fail:function(){
        that.setData({
          errorState:true,
        })
      }
    })
  },
  /**
   * 点击文章分类
   */
  handleChangeScroll({ detail }) {
    this.setData({
      articleGenre: detail.key,
      current_scroll: detail.key
    });
    if (detail.key != 999999999999){
      this.getHealthArticle();
    }
    else{
      this.setData({
        articleGenre: '',
      });
      this.getHealthArticle();
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this;
    that.setData({
      pageSize: this.data.pageSize -10,
      isLast: false,
    })
    if(this.data.pageSize<=0){
      that.setData({
        pageSize: 10,
        isLast: false,
      })
    }
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    setTimeout(function() {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      if (that.data.search_title != '') {
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
        pageSize: this.data.pageSize + 10,
      }),
      wx.showToast({
        title: '正在加载', //这里成功
        icon: 'loading',
        duration: 1500,
      }),
      setTimeout(function() {
        if (that.data.search_title != '') {
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
    wx.request({
      url: urlPath + '/healthyArticle/healthyArticle', //请求地址
      header: { //请求头
        "Content-Type": "applciation/x-www-form-urlencoded"
      },
      data: {
        pageSize: this.data.pageSize,
        articleGenre: this.data.articleGenre,
      },
      method: "GET", //get为默认方法/POST
      success: function(res) {
        console.log(res);
        that.setData({
          msgList:res.data.list,
          total: res.data.total,
          isFirstPage: res.data.isFirstPage,
          isLastPage: res.data.isLastPage,
          pages: res.data.pages,
          total: res.data.total,
          pageNum: res.data.pageNum,
          errorState: false,
        });
        for(var i=0;i<res.data.list.length;i++){
          var createTime = "msgList[" + i +"].createTime";
         that.setData({
          [createTime]: that.renderTime(res.data.list[i].createTime),
         })
        }
      },
      fail: function () {
        that.setData({
          errorState: true,
        })
      }
    });
  },
  //时间转换
  renderTime(date) {
    var dateee = new Date(date).toJSON();
    return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
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
    if (this.data.search_title != null || that.data.search_title != '') {
      wx.request({
        url: urlPath + '/healthyArticle/selectHealthyArticleByTitle',
        method: 'GET',
        data: {
          title: this.data.search_title,
          pageSize: this.data.pageSize,
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
          });
          for (var i = 0; i < res.data.list.length; i++) {
            var createTime = "msgList[" + i + "].createTime";
            that.setData({
              [createTime]: that.renderTime(res.data.list[i].createTime),
            })
          }
        }
      })
    }
  },
})