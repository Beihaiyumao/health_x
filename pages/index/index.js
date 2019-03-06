//index.js
//获取应用实例
const urlPath = require('../common/config').url_microService;

const app = getApp()

Page({
  data: {
    
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
