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
    sexCheckM: false, //男
    sexCheckW: false, //女
  },
  username: function(e) {
    this.setData({
      username: e.detail.value,
    })
  },
  radioChange: function(e) {
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
    wx.showToast({
      title: '正在加载中',
      icon: 'loading',
    })
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
          if (e.data.object.sex == '0') {
            that.setData({
              sexCheckM: true,
            })
          } else {
            that.setData({
              sexCheckW: true,
            })
          }
        }
      }
    })
  },
  /**
   * 保存修改信息
   */
  saveChangeUserInfo: function() {
    var that = this;
    var userinputTrue = that.checkInput();
    console.log(this.data.sex);
    console.log(this.data.username + "user")
    if (userinputTrue) {
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
            });
            wx.switchTab({
              url: '../user/user'
            });
          } else {
            wx.showToast({
              title: e.data.msg,
              icon: 'loading',
            })
          }
        }
      });
    }
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
    if (this.data.username.length >= 16) {
      wx.showToast({
        title: '用户名请保持在16个字符内',
        icon: 'none',
      })
      return false;
    } else if (this.data.phone.length != 11) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
      })
      return false;
    } else if (this.data.address.length >= 50) {
      wx.showToast({
        title: '住址请保持50个字符内',
        icon: 'none',
      })
      return false;
    }
    return true;
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