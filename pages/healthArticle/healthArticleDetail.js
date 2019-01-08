// pages/healthArticle/healthArticleDetail.js
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
    wx.request({
        url: 'http://39.105.56.223/health-0.0.1-SNAPSHOT/healthyArticle/selectHealthyArticleById?articleId=' + this.data.articleId, //请求地址
        header: { //请求头
          "Content-Type": "applciation/json"
        },

        method: "POST", //get为默认方法/POST
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
    wx.request({
      url: 'http://39.105.56.223/health-0.0.1-SNAPSHOT/healthyArticle/commentList?articleId=' + this.data.articleId, //请求地址
      method:'POST',
      success:function(e){
        console.log(e);
        that.setData({
          "comment_show": true,

          "collectinfo": e.data.list
        })
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