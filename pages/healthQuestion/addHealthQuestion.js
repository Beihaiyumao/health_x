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
    questionGenreList:[],
    
  },

  getWords(e) {
    let page = this;
    page.setData({
      question_detail: e.detail.detail.value,
    });
  },
  question_title:function(e){
    this.setData({
      question_title: e.detail.detail.value
    })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getQuestionGenre();
    console.log(this.data.questionGenreList)
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
   * 获取问题分类
   */
  getQuestionGenre: function () {
    var that = this;
    wx.request({
      url: urlPath + '/admin/selectAllHealthQuestionGenre?pageSize=' + 100+'&all='+10,
      method: "GET",
      success: function (e) {
        console.log(e);
        that.setData({
          questionGenreList: e.data.list,       
        });
      }
    })
  },
  /**点击选择问题分类 */
  handleChangeScroll({ detail }) {
    this.setData({
      questionGenre: detail.key,
      current_scroll: detail.key
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
/**
 * 新增问题
 */
  addHealthQuestion:function(){
    console.log(this.data.questionGenre)
    var that=this;
    var userInputState = that.checkUserInput();
    if(userInputState){
    wx.request({
      url: urlPath+'/question/insertQuestion',
      method:'POST',
      data:{
        title:this.data.question_title,
        detail:this.data.question_detail,
        userId: wx.getStorageSync('userId'),
        questionGenre:this.data.questionGenre,
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
  },
  /**
   * 检查用户输入内容
   */
  checkUserInput:function() {
    var that = this;
    if(this.data.question_title==""|| this.data.question_title==null || this.data.question_title==undefined){
      wx.showToast({
        title: '请输入标题',
        icon: 'none',
      })
      return false;
    }
    else if(this.data.question_detail==""|| this.data.question_detail==null || this.data.question_detail==undefined){
      wx.showToast({
        title: '请输入问题详情',
        icon: 'none',
      })
      return false;
    }
    else if(this.data.question_detail.length<30){
      wx.showToast({
        title: '问题详情不少于30个字符',
        icon: 'none',
      })
      return false;
    } else if (this.data.questionGenre==undefined){
      wx.showToast({
        title: '选择一个问题分类',
        icon: 'none',
      })
      return false;
    }
    return true;
  }
})