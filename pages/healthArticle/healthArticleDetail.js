// pages/healthArticle/healthArticleDetail.js
const urlPath = require('../common/config').url_microService;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleId: '', //文章id
    article: '', //导语
    author: '', //作者
    content: '', //内容
    pic: '', //文章图片
    title: '', //标题
    createTime: '', //发布时间 
    collectinfo: '',
    comment: '', //评论内容
    commentTotal: '', //评论总条数
    notComment: false,
    // 最大字符数
    maxTextLen: 50,
    // 默认长度
    textLen: 0,
    userId: "", //用户id
    collectionPhoto: '/images/healthArticle/notCo.png', //未收藏图片
    commentId: '', //回答id
    toUserId: '', //回复评论者id
    replyComment: '', //回复内容
    username: '',
    collectionArticleId: '', //收藏id
    likeArticle: '/images/healthArticle/notLike.png', //未点赞
    likeArticleId:'',//点赞id
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
  replyComment: function(e) {
    this.setData({
      replyComment: e.detail.value,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      articleId: options.articleId,

    });
    this.getHealthArticleDetail();
    this.getUserCommentInfo();
    this.getUserIsCollection();
    this.userIsNotLike();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // this.getHealthArticleDetail();
    // this.getUserCommentInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getHealthArticleDetail();
    this.getUserCommentInfo();
    this.getUserIsCollection();
    this.userIsNotLike();
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
  onShareAppMessage: function(res) {
    var that = this;
    var shareId = that.data.articleId;
    var title = that.data.title;
    if (res.from === 'button')
      return {
        title: title,
        path: '/pages/healthArticle/healthArticleDetail?articleId=' + shareId,
        success: function(res) {}
      }

  },
  /**
   * 点击收藏
   */
  userCollect: function() {
    var that = this;
    if (wx.getStorageSync('userId') == "") {
      wx.showToast({
        title: '您还未登陆,请先去登陆',
        icon: 'none',
      })
    } else {
      that.getUserIsCollection();
      wx.request({
        url: urlPath + '/healthyArticle/collectionArticles',
        method: 'POST',
        data: {
          userId: wx.getStorageSync('userId'),
          articleId: this.data.articleId,
        },
        success: function(e) {
          //100证明未收藏
          if (e.data.code == 100) {
            that.setData({
              collectionPhoto: '/images/healthArticle/isCo.png'
            })
            wx.showToast({
              title: e.data.msg, //这里成功
              icon: 'success',
              duration: 1000,
            });
          } else {
            //取消收藏
            wx.request({
              url: urlPath + '/healthyArticle/deleteCollectionAritcle',
              method: 'GET',
              data: {
                collectionArticleId: that.data.collectionArticleId,
              },
              success: function(e) {
                if (e.data.code == 100) {
                  that.setData({
                    collectionPhoto: '/images/healthArticle/notCo.png',
                  })
                  wx.showToast({
                    title: e.data.msg,
                    icon: 'success',
                    duration: 1000,
                  });
                } else {
                  wx.showToast({
                    title: e.data.msg,
                    icon: 'loading',
                    duration: 1000,
                  });
                }
              }
            })
          }
        }
      })
    }

  },
  /**
   *获取文章详情
   */
  getHealthArticleDetail: function() {
    var that = this;
    //获取文章具体信息
    wx.request({
      url: urlPath + '/healthyArticle/selectHealthyArticleById?articleId=' + this.data.articleId, //请求地址
      header: { //请求头
        "Content-Type": "applciation/json"
      },

      method: "GET", //get为默认方法/POST
      success: function(res) {
        if (res.data != "") {
          that.setData({
            article: res.data.article,
            author: res.data.author,
            content: res.data.content,
            createTime: res.data.createTime.substring(0, 10),
            pic: res.data.pic,
            title: res.data.title
          })
        } else {
          wx.showToast({ //这里提示失败原因
            title: '未知错误',
            icon: 'loading',
            duration: 1500
          })
        }
      }
    })
  },
  /**
   * 获取用户评论信息
   */
  getUserCommentInfo: function() {
    var that = this;
    wx.request({
      url: urlPath + '/healthyArticle/commentList?articleId=' + this.data.articleId, //请求地址
      method: 'GET',
      success: function(e) {
        console.log(e);
        that.setData({
          collectinfo: e.data.list,
          commentTotal: e.data.total,
        });
        if (e.data.total == 0) {
          that.setData({
            notComment: true,
          })
        }
      }
    })
  },
  /**
   * 发布评论
   */
  releaseComment: function() {
    var that = this;
    var isrightful = that.checkInput();
    console.log(isrightful)
    if (wx.getStorageSync('userId') == "") {
      wx.showToast({
        title: '您还未登陆,请先去登陆',
        icon: 'none',
      })
    }
    if (isrightful) {
      wx.request({
        url: urlPath + '/healthyArticle/insertArticleComment',
        method: 'POST',
        data: ({
          articleId: this.data.articleId,
          content: this.data.comment,
          userId: wx.getStorageSync('userId'),
        }),
        success: function(e) {
          console.log(e);
          if (e.data.code == 100) {
            wx.showToast({
              title: '评论成功', //这里成功
              icon: 'success',
              duration: 1000,
            });
            that.setData({
              inputComment: false,
            });
            that.getUserCommentInfo();
          } else {
            wx.showLoading({
              title: '发布失败',
              duration: 1500,
            })
          }
        }
      })
    }
  },
  /**检测用户输入是否规范 */
  checkInput: function() {
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


  /**
   * 点击回复评论
   */
  bindReply: function(e) {
    var that = this;
    if (wx.getStorageSync('userId') != "" && wx.getStorageSync('userId') != null) {
      wx.navigateTo({
        url: '/pages/healthArticle/replyComment?id=' + e.currentTarget.id,
      })
    } else {
      wx.showToast({
        title: '请先登录!',
        icon: 'none',
        duration: 1000,
      });
    }
  },
  /**
   * 判断用户是否已经收藏过此文章
   */
  getUserIsCollection: function() {
    var that = this;
    wx.request({
      url: urlPath + '/healthyArticle/selectCollectionAritlceById',
      method: 'GET',
      data: {
        userId: wx.getStorageSync('userId'),
        articleId: this.data.articleId,
      },
      success: function(e) {
        console.log(e);
        if (e.data.code == 100) {
          that.setData({
            collectionPhoto: '/images/healthArticle/isCo.png',
            collectionArticleId: e.data.object,
          })
        }
      }
    })
  },
  /**
   * 检测用户是否点过赞
   */
  userIsNotLike: function() {
    var that = this;
    wx.request({
      url: urlPath + '/healthyArticle/selectLikeArticleId',
      method: 'GET',
      data: {
        userId: wx.getStorageSync('userId'),
        articleId: this.data.articleId,
      },
      success: function(e) {
        if (e.data.code == 200) {
          that.setData({
            likeArticle: '/images/healthArticle/like.png',
            likeArticleId:e.data.object,
          })
        }
      }
    })
  },
  /**
   * 用户点击点赞
   */
  userClickLike:function(){
    var that=this;
    if (wx.getStorageSync('userId') == "") {
      wx.showToast({
        title: '您还未登陆,请先去登陆',
        icon: 'none',
      })
    }    
    that.userIsNotLike();
    if(this.data.likeArticleId==''){
      wx.request({
        url: urlPath + '/healthyArticle/insertLikeArticle',
        method: 'POST',
        data: {
          userId: wx.getStorageSync('userId'),
          articleId: this.data.articleId,
        },
        success: function (e) {
          console.log(e)
          if (e.data.code == 100) {
            that.setData({
              likeArticle: '/images/healthArticle/like.png',
            });
            wx.showToast({
              title: '已点赞',
              icon: 'success',
            })
          } else {
            wx.showToast({
              title: e.data.msg,
              icon:'loading',
            })
          }
        }
      })
    }else{
      wx.request({
        url: urlPath +'/healthyArticle/deleteLikeArticle',
        method:'GET',
        data:{
          likeArticleId:this.data.likeArticleId,
        },
        success:function(e){
          if(e.data.code==100){
            that.setData({
              likeArticle: '/images/healthArticle/notLike.png',
            });
            wx.showToast({
              title: '已取消点赞',
              icon:'success',
            })
          }else{
            wx.showToast({
              title: e.data.msg,
              icon:'loading',
            })
          }
        }
      })
    }
  },
})