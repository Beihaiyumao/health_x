// pages/user/userInfo.js
const urlPath = require('../common/config').url_microService;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headPhoto: "", //头像
    username: '', //用户名
    address: '', //地址
    email: '', //邮箱不允许修改
    phone: '', //电话
    sex: '', //性别
    fileName: '',
  },
  username: function(e) {
    this.setData({
      username: e.detail.value,
    })
  },
  sex: function(e) {
    this.setData({
      sex: e.detail.value,
    })
  },
  phone: function(e) {
    this.setData({
      phone: e.detail.value,
    })
  },
  address: function(e) {
    this.setData({
      address: e.detail.value,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getUserInfo();
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
    this.getUserInfo();
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
   * 获取用户信息
   */
  getUserInfo: function() {
    var that = this;
    console.log(wx.getStorageSync('userId'));
    wx.request({
      url: urlPath + '/user/selectUserInfo',
      method: 'GET',
      data: {
        userId: wx.getStorageSync('userId'),
      },
      success: function(e) {
        if (e.data.code == 100) {
          that.setData({
            headPhoto: urlPath + '/' + e.data.object.pic,
            username: e.data.object.username,
            address: e.data.object.address,
            email: e.data.object.email,
            sex: e.data.object.sex,
            phone: e.data.object.phone,
          })
        }
      }
    })
  },
  /**
   * 保存修改信息
   */
  saveChangeUserInfo: function() {
    console.log(this.data.fileName);
    console.log(this.data.username + "user")
    this.changeUserPhoto();
    wx.request({
      url: urlPath + '/user/updateUserInfo',
      method: 'POST',
      data: {
        userId: wx.getStorageSync('userId'),
        username: this.data.username,
        sex: this.data.sex,
        phone: this.data.phone,
        address: this.data.address,
      },
      success: function(e) {
        console.log(e);
        if (e.data.code == 100) {
          wx.showToast({
            title: e.data.msg,
            icon: 'success',
          })
        } else {
          wx.showToast({
            title: e.data.msg,
            icon: 'loading',
          })
        }
      }
    });

  },
  /**
   * 更新头像
   */
  changeUserPhoto: function() {
    var that = this;
    if (that.data.fileName != "") {
      wx.request({
        url: urlPath + '/user/updateHeadPhoto',
        method: 'GET',
        data: {
          userId: wx.getStorageSync('userId'),
          fileName: this.data.fileName,
        },
        success: function(e) {
          console.log(e);
        }
      })
    };
  },
  /**
   * 校验用户输入合法性
   */
  checkInput: function() {

  },
  /**
   * 上传头像
   *  */
  changeUserPic: function() {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: urlPath + '/uploadFiles/changUserPho',
          filePath: tempFilePaths[0],
          name: 'file',
          success: function(e) {
            var obj = JSON.parse(e.data);
            that.setData({
              headPhoto: tempFilePaths[0],
              fileName: obj.object,
            })
          }
        }, )
      }
    })
  },
})