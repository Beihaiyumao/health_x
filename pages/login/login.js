const urlPath = require('../common/config').url_microService;
Page({
  /**
   * 页面的初始数据
   * 初始化两个输入值
   */
  data: {
    isLogin: true,
    inputName:'',
    inputPassword:'',
  },
  //获取用户输入的值a
  inputName: function(e) {
    this.setData({
      inputName : e.detail.value
    })
    
  },
  //获取用户输入的值b
  inputPassword: function(e) {
   this.setData({
     inputPassword : e.detail.value
   })
    console.log("输入的密码：" + this.data.inputPassword);
  },

  // 注册
  registerUser: function() {
    wx.navigateTo({
      url: '../regist/regist'
    });
  },
  // 登陆
  login: function() {
    var that = this;
    var isrightful = that.checkInput();
    if (isrightful) {
      wx.request({
        url: urlPath+'/user/login',
        header: {
          "Content-Type": "application/json"
        },
        method: "POST",
        data: {
          email: this.data.inputName,
          password: this.data.inputPassword
        },
        success: function(res) {
          console.log(res)
          if (res.data.code == 200) {
            wx.showModal({ //这里提示失败原因
              title: '提示！',
              confirmText: '朕知道了',
              showCancel: false,
              content: res.data.msg,
            })
          } else {
            wx.showToast({
              title: '登陆成功', //这里成功
              icon: 'success',
              duration: 1000,
              
            });
            //保存用户登录状态
            wx.setStorageSync("userId", res.data.object.userId);
            wx.switchTab({
              url: '../user/user'
            });
            that.setData({
              isLogin: true,
            })
          }
        }
      });
    }
  },
  //检测输入值
  checkInput: function() {
    var that = this;
    var emailTrue = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/;
    if (this.data.inputName == "" || this.data.inputName == null ||
      this.data.inputName == undefined || !emailTrue.test(this.data.inputName)) {
        
      this.showErrorToastUtils('请输入正确的邮箱');
      return false;
    } else if (this.data.inputPassword == "" || this.data.inputPassword == null || this.data.inputPassword == undefined) {
      this.showErrorToastUtils('请输入密码');
      return false;

    } else if (this.data.inputPassword.length < 6) {
      this.showErrorToastUtils('密码至少要6位');
      return false;

    }
    return true;
  },

  // 错误提示
  showErrorToastUtils: function(e) {
    wx.showModal({
      title: '提示！',
      confirmText: '朕知道了',
      showCancel: false,
      content: e,
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  },
})