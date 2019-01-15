// pages/healthArticle/healthArticleDetail.js
const urlPath = require('../common/config').url_microService;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleId: '',
    article: '', //导语
    author: '',
    content: '', //内容
    pic: '',
    title: '',
    createTime: '',
    "comment_show": true,

    "collectinfo": ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      articleId: options.articleId
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
    var that = this;
    //获取文章具体信息
    wx.request({
        url: urlPath+'/healthyArticle/selectHealthyArticleById?articleId=' + this.data.articleId, //请求地址
        header: { //请求头
          "Content-Type": "applciation/json"
        },
        
        method: "GET", //get为默认方法/POST
        success: function(res) {
          console.log(res);
          if (res.data != "") {
            that.setData({
              article: res.data.article,
              author: res.data.author,
              content: res.data.content,
              createTime: res.data.createTime,
              pic: res.data.pic,
              title: res.data.title
            })
          }
          else{
            wx.showToast({ //这里提示失败原因
              title: '未知错误',
              icon: 'loading',
              duration: 1500
            })
          }
        }

     
    }),
    //获取用户评论
    wx.request({
      url: urlPath+'/healthyArticle/commentList?articleId=' + this.data.articleId, //请求地址
      method:'GET',
      success:function(e){
        console.log(e);
        that.setData({
          "comment_show": true,

          "collectinfo": e.data.list
        })
      }
    }),
    //获取评论回复
    wx.request({
      url: urlPath+'/healthyArticle/commentReply?articleCommentId=' + this.data.collectinfo[0],
      method:'GET',
      success:function(e){
        
      }
    })
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

}
})