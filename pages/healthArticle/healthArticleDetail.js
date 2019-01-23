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

    "collectinfo": '',
    inputComment:false,//是否显示评论框
    comment:'',//评论内容
    // 最大字符数
    maxTextLen: 50,
    // 默认长度
    textLen: 0,
    userId:"",
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
      comment: e.detail.value,
    });
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
    console.log(this.data.articleId)
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

},
/**
 * 点击评论
 */
  commentBtnClick: function(){
    var that =this;
    that.setData({
      inputComment:true,
    })
  },
/**
 * 发布评论
 */
  releaseComment:function(){
    var that = this;
    var isrightful = that.checkInput();
    console.log(isrightful)
    if (isrightful){
      wx.request({
        url: urlPath + '/healthyArticle/insertArticleComment',
        method: 'POST',
        data: ({
          articleId: this.data.articleId,
          content: this.data.comment,
          userId: wx.getStorageSync('userId'),
        }),
        success: function (e) {
          console.log(e);
          if (e.data.code == 100) {
            wx.showToast({
              title: '评论成功', //这里成功
              icon: 'success',
              duration: 1000,
            });
          }
          else {
            wx.showLoading({
              title: '发布失败',
              duration: 1500,
            })
          }
        }
      })
    }
    
    
  },
  checkInput:function(){
    console.log(this.data.comment+"kog")
    var commentIsK =/^(?!(\.s+$))/;
    if(this.data.comment==null || this.data.comment==""|| this.data.comment==undefined || commentIsK.test(this.data.comment)){
      wx.showLoading({
        title: '请输入正确内容',
        duration:1500,
      })
      return false;
    }else{
      return true;
    }
    
  }
})