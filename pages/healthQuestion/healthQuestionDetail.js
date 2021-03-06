// pages/healthQuestion/healthQuestionDetail.js
const urlPath = require('../common/config').url_microService;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionId: '',
    title: '',
    detail: '',
    createTime: '',
    answerList: '', //医生回复列表
    commentTotal: '', //所有医生的回复
    notComment: false, //是否没有回复
    collectionPhoto: '/images/healthArticle/notCo.png', //未收藏图片
    collectionQuestionId: '', //收藏id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      questionId: options.questionId
    });
    this.getQuestionDetail();
    this.getDoctorAnswer();
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
    this.getQuestionDetail();
    this.getDoctorAnswer();
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 获取问题详情
   */
  getQuestionDetail: function() {
    var that = this;
    that.userIsOrNotCollQuestion();
    wx.request({
      url: urlPath + '/question/selectQuestionDetailById?questionId=' + this.data.questionId,
      method: 'GET',
      data: {
        questionId: this.data.questionId,
      },
      success: function(e) {
        if (e.data.code == 100) {
          wx.showToast({
              title: e.data.msg,
              icon: "success",
            }),
            that.setData({
              title: e.data.object.title,
              detail: e.data.object.detail,
            createTime: that.renderTime(e.data.object.createTime),
            })
        } else {
          wx.showToast({
            title: e.data.msg,
            icon: 'none',
          })
        };
      }
    })
  },
  /**
   * 医生回答列表
   */
  getDoctorAnswer: function() {
    var that = this;
    wx.request({
      url: urlPath + '/question/questionAnswer?questionId=' + this.data.questionId,
      method: 'GET',
      data: {
        questionId: this.data.questionId,
      },
      success: function(e) {
        that.setData({
          answerList: e.data.list,
          commentTotal: e.data.total,
        });
        if (e.data.total == 0) {
          that.setData({
            notComment: true,
          })
        };
        for (var i = 0; i < e.data.list.length; i++) {
          var createTime = "answerList[" + i + "].createTime";
          that.setData({
            [createTime]: that.renderTime(e.data.list[i].createTime),
          })
        };
      }
    })
  },
  /**
   * 用户收藏问题
   */
  collectionQuestion: function() {
    var that = this;
    if (wx.getStorageSync('userId') == null || wx.getStorageSync('userId') == "" || wx.getStorageSync('userId') == undefined) {
      wx.showToast({
        title: '请先登陆哦',
        icon: 'none',
      })
    }else{
      that.userIsOrNotCollQuestion();
      wx.request({
        url: urlPath + '/question/collectionQuestion',
        method: 'POST',
        data: {
          userId: wx.getStorageSync('userId'),
          questionId: this.data.questionId,
        },
        success: function (e) {
          if (e.data.code == 100) {
            that.setData({
              collectionPhoto: '/images/healthArticle/isCo.png'
            }),
              wx.showToast({
                title: '收藏成功!',
                icon: 'success',
              })
          } else {
            //取消收藏
            wx.request({
              url: urlPath + '/question/deleteCollectionQuestion?collectionQuestionId=' + that.data.collectionQuestionId,
              method: 'GET',
              success: function (e) {
                console.log(that.data.collectionQuestionId);
                if (e.data.code == 100) {
                  that.setData({
                    collectionPhoto: '/images/healthArticle/notCo.png',
                  }),
                    wx.showToast({
                      title: '取消收藏成功!',
                      icon: 'success',
                    })
                } else {
                  wx.showToast({
                    title: e.data.msg,
                    icon: 'none',
                  })
                }
              }
            })
          }

        }
      })
    }
   
  },
  /**
   * 判断用户是否已经收藏该问题
   */
  userIsOrNotCollQuestion: function() {
    var that = this;
    wx.request({
      url: urlPath + '/question/collectionQuestionIsTrue',
      method: 'GET',
      data: {
        userId: wx.getStorageSync('userId'),
        questionId: this.data.questionId,
      },
      success: function(e) {
        if (e.data.code == 100) {
          that.setData({
            collectionPhoto: '/images/healthArticle/isCo.png',
            collectionQuestionId: e.data.object,
          })
        }
      }
    })

  },
  //时间转换
  renderTime(date) {
    var dateee = new Date(date).toJSON();
    return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
  },
})