var inputName = "";
var inputPassword = "";
Page({
  /**
   * 页面的初始数据
   * 初始化两个输入值
   */
  data: {
    isLogin: true
  },
  //获取用户输入的值a
  inputName: function (e) {
    inputName = e.detail.value;
  },
  //获取用户输入的值b
  inputPassword: function (e) {
    inputPassword = e.detail.value;
    console.log("输入的密码：" + inputPassword);
  },
  // 注册
  register: function () {
    wx.redirectTo({

      url: '../regist/regist'

    });
  },
  // 登陆
  login: function () {
    var that = this;
    var isrightful = that.checkInput();
    if (isrightful) {
      wx.request({
        url: 'http://39.105.56.223/health-0.0.1-SNAPSHOT/user/login',
        header: {
          "Content-Type": "application/json"
        },
        method: "POST",
        data: {
          email: inputName,
          password: inputPassword
        },
        success: function (res) {
          console.log(res)
          if (res.data.code == 200) {
            wx.showToast({ //这里提示失败原因
              title: res.data.msg,
              icon: 'loading',
              duration: 1500
            })
          } else {
            wx.showToast({
              title: '登陆成功', //这里成功
              icon: 'success',
              duration: 1000
            });

            wx.redirectTo({

              url: '../index/index'

            });
            that.setData({
              isLogin: true,
            }
            )
          }
        }
      });
    }
  },
  //检测输入值
  checkInput: function () {
    if (inputName == "" || inputName == null ||
      inputName == undefined) {
      this.showErrorToastUtils('请输入用户名');
    } else if (inputPassword == "" || inputPassword == null || inputPassword == undefined) {
      this.showErrorToastUtils('请输入密码');
    } else if (inputPassword.length < 6) {
      this.showErrorToastUtils('密码至少要6位');
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
