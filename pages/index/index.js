//index.js
//获取应用实例
const urlPath = require('../common/config').url_microService;

const app = getApp()

Page({
  data: {
    msg:'',
    noticeState:false,
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    this.getMsg();
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    this.getMsg();
  },

  getMsg:function(){
    var that=this;
    wx.request({
      url: urlPath +'/admin/selectIsYesNotice',
      success:function(e){
        console.log(e);
        if(e.data.code==100){
          that.setData({
            msg : e.data.object.msg,
            noticeState : true,
          })
        }else{
          that.setData({
            noticeState: false,
          })
        }
      }
    })
  },
  /**
   * bmi计算器跳转
   */
  turnBMI:function(){
    wx.navigateTo({
      url: '../index/bmi'
    });
  },
  /**
   * 腰臀比计算器
   */
  turnWHR: function(){
    wx.navigateTo({
      url: '../index/whr',
    })
  },
  /**
   * 每日能量需求
   */
  turnDEN: function(){
    wx.navigateTo({
      url: '../index/den',
    })
  },
  /**
   * 理想体重计算器
   */
  turnCDBW: function(){
    wx.navigateTo({
      url: '../index/cdbw',
    })
  },
  onShareAppMessage:function(){
    return {
      title: '转发',
      path: '/pages/index/index',
      success: function (res) { }
    }
  }
})
