// pages/healthArticle/replyComment.js
const urlPath = require('../common/config').url_microService;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentId: '', //评论id
    toUserId: '', //评论用户id
    username: '', //评论用户名称
    // 最大字符数
    maxTextLen: 50,
    // 默认长度
    textLen: 0,
    comment:''//回复内容
  },
  //获取用户输入内容
  comment(e) {
    let page = this;
    // 设置最大字符串长度(为-1时,则不限制)
    let maxTextLen = page.data.maxTextLen;
    // 文本长度
    let textLen = e.detail.value.length;

    page.setData({
      maxTextLen: maxTextLen,
      textLen: textLen,
      comment: e.detail.value.replace(/\s+/g, ''),
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      commentId: options.id.substring(0, 12),
      toUserId: options.id.substring(13, 25),
      articleId: options.id.substring(26, 38),
      username: options.id.substring(39, options.id.length),
    });
    console.log(this.data.commentId);
    console.log(this.data.toUserId);
    console.log(this.data.username);
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
 * 点击发布回复
 */
  replyCommentAction: function (e) {
    var that = this;
    var isrightful = that.checkInput();
    if (isrightful) {
      wx.request({
        url: urlPath + '/healthyArticle/insertCommentReply',
        method: 'POST',
        data: {
          userId: wx.getStorageSync('userId'),
          commentId: this.data.commentId,
          content: this.data.comment,
          toUserId: this.data.toUserId,
          articleId: this.data.articleId,
        },
        success: function (e) {
          console.log(e);
          if(e.data.code=100){
            wx.showToast({
              title: e.data.msg,
            })
          }
        }
      })
    }
  },
  /**检测用户输入是否规范 */
  checkInput: function () {
    if (this.data.comment == null || this.data.comment == "" || this.data.comment == undefined || this.data.comment.length <= 0) {
      wx.showToast({
        title: '请输入正确内容',
        icon: 'none',
        duration: 1500,
      })
      return false;
    } else {
      return true;
    }

  },
})