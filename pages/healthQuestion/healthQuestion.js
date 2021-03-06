// pages/healthQuestion/healthQuestion.js
const urlPath = require('../common/config').url_microService;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionList: '',
    total: '',
    pageNum: '',
    isFirstPage: true,
    isLastPage: true,
    search_title: '',
    isLast: false,
    pageSize: 10,
    questionGenreList: [],
    questionGenre: '',
    current_scroll: 999999999999,
    addState: false,
    errorState: false,
    loading: true,
    notOne: false,
  },
  /**
   * 获取用户输入的题目
   */
  search_title: function(e) {
    this.setData({
      search_title: e.detail.value,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getAllHealthQuestion();
    this.getQuestionGenre();
    this.userIsTrue();
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
    this.userIsTrue();
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
   * 判断用户是否登陆
   */
  userIsTrue: function() {
    if (wx.getStorageSync('userId') != null && wx.getStorageSync('userId') != "" && wx.getStorageSync('userId') != undefined) {
      this.setData({
        addState: true,
      })
    }
  },
  /**
   * 获取问题分类列表
   */
  getQuestionGenre: function() {
    var that = this;
    wx.request({
      url: urlPath + '/admin/selectAllHealthQuestionGenre?pageSize=' + 100 + '&all=' + 100,
      method: "GET",
      success: function(e) {
        console.log(e);
        that.setData({
          questionGenreList: e.data.list,
        })
      }
    })
  },
  /**
   * 点击问题分类
   */
  handleChangeScroll({
    detail
  }) {
    this.setData({
      questionGenre: detail.key,
      current_scroll: detail.key,
      loading: true,
    });
    if (detail.key != 999999999999) {
      this.getAllHealthQuestion();
    } else {
      this.setData({
        questionGenre: '',
      });
      this.getAllHealthQuestion();
    }

    console.log(detail.key);
  },
  /**
   * 点击新增按钮
   */
  addHealthQuestion: function() {
    if (wx.getStorageSync('userId') != null && wx.getStorageSync('userId') != "" && wx.getStorageSync('userId') != undefined) {
      wx.navigateTo({
        url: '../healthQuestion/addHealthQuestion',
      })
    } else {
      this.showErrorToastUtils();
    }

  },
  // 未登录提示
  showErrorToastUtils: function(e) {
    wx.showModal({
      title: '您未登录！',
      content: '确定去登录吗?',
      success: function(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../login/login'
          });
        } else if (res.cancel) {
          wx.switchTab({
            url: '../healthQuestion/healthQuestion',
          })
        }
      }
    })
  },
  /**
   * 获取所有问题
   */
  getAllHealthQuestion: function() {
    console.log(this.data.pageSize)
    var that = this;
    wx.request({
      url: urlPath + '/question/allQuestion',
      method: 'GET',
      data: {
        pageSize: this.data.pageSize,
        genre: this.data.questionGenre,
      },
      success: function(e) {
        console.log(e);
        that.setData({
          questionList: e.data.list,
          total: e.data.total,
          pageNum: e.data.pageNum,
          isFirstPage: e.data.isFirstPage,
          isLastPage: e.data.isLastPage,
          errorState: false,
          loading: false,
        })
        if (e.data.total == 0) {
          that.setData({
            notOne: true,
            isLastPage: false,
          })
        } else {
          that.setData({
            notOne: false,
          })
        }
      },
      fail: function() {
        that.setData({
          errorState: true,
          loading: false,
        })
      }
    })
  },
  /**
   * 模糊查询问题
   */
  searchQuestion: function() {
    var that = this;
    wx.request({
      url: urlPath + '/question/selectQuestionByTitle',
      method: 'GET',
      data: {
        pageSize: this.data.pageSize,
        title: this.data.search_title,
      },
      success: function(e) {
        console.log(e);
        if (e.data.list.length == 0) {
          wx.showToast({
            title: '没有该内容哦',
            icon: "success",
            duration: 1500,
          })
        } else {
          that.setData({
            questionList: e.data.list,
            total: e.data.total,
            pageNum: e.data.pageNum,
            isFirstPage: e.data.isFirstPage,
            isLastPage: e.data.isLastPage,
          })
        }

      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let that = this;
    that.setData({
      pageSize: this.data.pageSize - 10,
      isLast: false,
    })
    if (this.data.pageSize <= 0) {
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
        that.getAllHealthQuestion();
      }

    }, 1500);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    that.setData({
        // pageNum: this.data.pageNum + 1,
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
          that.getAllHealthQuestion();
        }
      }, 1500)
  },
  /**
   * 问题详情
   */
  gotoQuetionDetail1: function(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/healthQuestion/healthQuestionDetail?questionId=' + e.currentTarget.id,
    })

  },
})