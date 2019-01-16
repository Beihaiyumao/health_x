// pages/user/changPassword.js
const urlPath = require('../common/config').url_microService;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldPassword:'',
    newPassword:'',
    tnewPassword:'',
    userId: '',
  },

  oldPassword: function(e){
    this.setData({
      oldPassword: e.detail.value
    })
  },
  newPassword: function(e){
    this.setData({
      newPassword: e.detail.value
    })
  },
  tnewPassword: function(e){
    this.setData({
      tnewPassword:e.detail.value
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
  changePassword: function(){
    var inputState=this.chackInput();
    if(inputState){
    
      wx.request({
        url: urlPath+'/user/updatePassword',
        method: "GET",
        data: {
          newPassword: this.data.newPassword,
          oldPassword: this.data.oldPassword,
          tnewPassword: this.data.tnewPassword,
          userId: wx.getStorageSync('userId'),

        },
        success:function(e){
          if(e.data.code==100){
            wx.showToast({
              title: '修改成功', 
              duration: 1000,

            });
          }
          else{
            wx.showToast({
              title: e.data.msg, 
              duration: 1000,

            });
          }
        }
      })
    }
  },
  chackInput: function(){
    if(this.data.oldPassword==""||this.data.oldPassword==undefined||this.data.oldPassword==null){
      this.showErrorToastUtils("请输入旧密码");
      return false;
    }else if(this.data.newPassword==""||this.data.newPassword==null||this.data.newPassword==undefined){
      this.showErrorToastUtils("请输入新密码");
      return false;
    }
    else if(this.data.tnewPassword==""||this.data.tnewPassword==null||this.data.tnewPassword==undefined){
      this.showErrorToastUtils("请再次输入新密码");
      return false;
    }
    else if(this.data.newPassword.length<6){0
      this.showErrorToastUtils("密码至少六位");
      return false;
    }
    else if(this.data.newPassword!=this.data.tnewPassword){
      this.showErrorToastUtils("两次密码不一致");
      return false;
    }
    return true;
  },
    // 错误提示
  showErrorToastUtils: function (e) {
    wx.showModal({
      title: '提示！',
      confirmText: '朕知道了',
      showCancel: false,
      content: e,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  },
})