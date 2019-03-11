// pages/user/healthArticle.js
const urlPath = require('../common/config').url_microService;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search_title:'',
    userId: '',
    msgList: [{
      articleId: 1, //文章id
      title: "", //标题
      createTime: "", //创建时间
      article: '', //导语
      author: '', //作者
      content: '', //内容
      pic: "", //图片
    }, ],
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏
    isFirstPage: '', //是否是第一页
    isLastPage: '', //是否是最后一页
    pages: '', //一共多少页
    total: '', //总共多少条数据
    pageNum: 1,
    navbarActiveIndex: 0,
    navbarTitle: [
      "健康百科",
      "健康问答"
    ],
    articleOrQuestion:true,
  },
  /**
  * 点击导航栏
  */
  onNavBarTap: function (event) {
    // 获取点击的navbar的index
    let navbarTapIndex = event.currentTarget.dataset.navbarIndex
    // 设置data属性中的navbarActiveIndex为当前点击的navbar
    this.setData({
      navbarActiveIndex: navbarTapIndex
    })
  },

  /**
   * 
   */
  onBindAnimationFinish: function ({ detail }) {
    // 设置data属性中的navbarActiveIndex为当前点击的navbar
    console.log(detail.current)
    if (detail.current==1){
      this.setData({
        articleOrQuestion:false,
      })
      
    }else{
      this.setData({
        articleOrQuestion:true,
      })
      this.getMyHealthArticle();
    }
   
    this.setData({
      navbarActiveIndex: detail.current
    })
  },
  //获取用户输入的值
  search_title: function (e) {
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
    this.getMyHealthArticle();
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
   * 获取我收藏的文章列表
   */
  getMyHealthArticle: function() {
    var that = this;
    wx.request({
      url: urlPath+'/user/myCollectionArticle',
      method: 'GET',
      data: {
        userId: wx.getStorageSync('userId'),
      },
      success: function(res) {
        console.log(res);

        that.setData({
          msgList: res.data.list,
          total: res.data.total,
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
  searchMyArticle: function () {
    var that = this;
    if (this.data.search_title != null) {
      wx.request({
        url: urlPath+'/user/selectMyHealthArticle',
        method: 'GET',
        data: {
          title: this.data.search_title,
          userId: wx.getStorageSync('userId'),
        },
        success: function (res) {
          console.log(res);
          if(res.data.list.length==0){
            wx.showToast({
              title: '没有该内容哦',
              icon:"success",
              duration:1500,
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
  }
})