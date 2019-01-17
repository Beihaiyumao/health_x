// pages/healthQuestion/addHealthQuestion.js
const urlPath = require('../common/config').url_microService;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 最大字符数
    maxTextLen: 200,
    // 默认长度
    textLen: 0,
    question_title:'',
    question_detail:'',
    userId:'',
  },
  getWords(e) {
    let page = this;
    // 设置最大字符串长度(为-1时,则不限制)
    let maxTextLen = page.data.maxTextLen;
    // 文本长度
    let textLen = e.detail.value.length;

    page.setData({
      maxTextLen: maxTextLen,
      textLen: textLen,
      question_detail:e.detail.value,
    });
  },
  question_title:function(e){
    this.setData({
      question_title:e.detail.value,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  addHealthQuestion:function(){
    wx.request({
      url: urlPath+'/question/insertQuestion',
      method:'POST',
      data:{
        title:this.data.question_title,
        detail:this.data.question_detail,
        userId: wx.getStorageSync('userId'),
      },
      success:function(e){
        console.log(e);
        if(e.data.code==100){
          wx.showToast({ 
            title: e.data.msg,
            icon: 'success',
            duration: 2000,
            success:function(){
              setTimeout(function () {
                //要延时执行的代码
                wx.switchTab({
                  url: '../healthQuestion/healthQuestion',
                })
              }, 2000) //延迟时间
            }
          })
        }else{
          wx.showToast({ //这里提示失败原因
            title: e.data.msg,
            icon: 'loading',
            duration: 2000
          })
        }
      }
    });
  }

})