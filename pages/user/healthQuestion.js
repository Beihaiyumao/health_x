// pages/user/healthQuestion.js
const urlPath = require('../common/config').url_microService;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    msgList: [ ],
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏
    isFirstPage: '', //是否是第一页
    isLastPage: '', //是否是最后一页
    pages: '', //一共多少页
    total: '', //总共多少条数据
    pageNum: 1,
    search_title: '', //模糊查询
    pageSize:10,
    isLast:false,
    visible2: false,
    //小程序没有refs，所以只能用动态布尔值控制关闭
    toggle: false,
     actions2: [
      {
        name: '删除',
        color: '#ed3f14'
      }
    ],
    questionId:'',
    loading:true,
  },
  /**
   * 取消删除
   */
  handleCancel2() {
    this.setData({
      visible2: false,
      toggle: this.data.toggle ? false : true
    });
  },
  /**
   * 确定删除
   */
  handleClickItem2() {
    const action = [...this.data.actions2];
    action[0].loading = true;

    this.setData({
      actions2: action
    });

    setTimeout(() => {
      action[0].loading = false;
      this.setData({
        visible2: false,
        actions2: action,
        toggle: this.data.toggle ? false : true
      });
      this.deleteQuestion1();
    }, 2000);
   
  },
  /**
   * 隐藏删除按钮
   */
  actionsTap(e) {
    var that=this;
    that.setData({
      visible2: true,
       questionId: e.currentTarget.id
    });
  },
  /**
   * 确定删除
   */
  deleteQuestion1:function(){
    var that=this;
    console.log(this.data.questionId)
    wx.request({
      url: urlPath + '/question/deleteQuestion',
      method: 'GET',
      data: {
        questionId: this.data.questionId
      },
      success: function (e) {
        console.log(e);
        if (e.data.code == 100) {
          wx.showToast({
            title: e.data.msg,
            icon: 'success',
          });
          that.getMyHealthQuestion();
        }
      }
    })
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
    this.getMyHealthQuestion();
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
   * 获取我的问题列表
   */
  getMyHealthQuestion: function() {
    var that = this;
    wx.request({
      url: urlPath + '/user/myQuestion',
      method: 'GET',
      data: {
        userId: wx.getStorageSync('userId'),
        pageSize: this.data.pageSize,
      },
      success: function(res) {
        console.log(res);
        that.setData({
          msgList: res.data.list,
          isFirstPage: res.data.isFirstPage,
          isLastPage: res.data.isLastPage,
          pages: res.data.pages,
          total: res.data.total,
          isFromSearch: true, //第一次加载，设置true
          searchLoading: true, //把"上拉加载"的变量设为true，显示
          pageNum: res.data.pageNum,
          loading:false,
        })
        if (res.data.total == 0) {
          that.setData({
            notOne: true,
            isLastPage: false,
          })
        } else {
          that.setData({
            notOne: false,
          })
        }
      }
    })
  },
  /**
   * 模糊查询
   */
  searchMyQuestion: function() {
    var that = this;
    if (this.data.search_title != null) {
      wx.request({
        url: urlPath + '/user/selectMyQuestion',
        method: 'GET',
        data: {
          title: this.data.search_title,
          userId: wx.getStorageSync('userId'),
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
          })
        }
      })
    }
  },
  /**
   * 删除我的问题
   */
  deleteQuestion: function(e) {
    var that = this;
    console.log(e);
    wx.showModal({
      title: '  提示',
      content: '确定删除此问题吗?',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: urlPath + '/question/deleteQuestion',
            method: 'GET',
            data: {
              questionId: e.currentTarget.id
            },
            success: function(e) {
              console.log(e);
              if (e.data.code == 100) {
                wx.showToast({
                  title: e.data.msg,
                  icon: 'success',
                  success: function() {
                    setTimeout(function() {
                      //要延时执行的代码
                      that.getMyHealthQuestion();
                    }, 1500) //延迟时间
                  }
                })
              }
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    that.setData({
      pageSize: this.data.pageSize + 10,
    }),
    wx.showToast({
        title: '正在加载', //这里成功
        icon: 'loading',
        duration: 1500,
      }),
      setTimeout(function () {
          if (that.data.search_title != '') {
            that.searchMyQuestion();
          } else {
            that.getMyHealthQuestion();          }
      }, 1500)
  },
  /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      pageSize: this.data.pageSize - 10,
      isLast: false,
    })
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      if (that.data.search_title != '') {
        that.searchMyQuestion();
      } else {
        that.getMyHealthQuestion();
      }
    }, 1500);
  },
  /**
   * 问题详情
   */
  gotoQuetionDetail: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/healthQuestion/healthQuestionDetail?questionId=' + e.currentTarget.id,
    })

  },
})