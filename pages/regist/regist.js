var username = "";
var password = "";
var email = "";
var identifying = "";
var tpassword = "";
Page({
  /**
   * 页面的初始数据
   * 初始化两个输入值
   */
  data: {
    isLogin: true,
    img: "http://39.105.56.223/health-0.0.1-SNAPSHOT/user/getImgVerify"
  },
  email: function(e) {
    email = e.detail.value;
  },
  //获取用户输入的值a
  username: function(e) {
    username = e.detail.value;
  },
  //获取用户输入的值b
  password: function(e) {
    password = e.detail.value;
  },
  identifying: function(e) {
    identifying = e.detail.value;
  },
  tpassword: function(e) {
    tpassword = e.detail.value;
  },
  // 注册
  register: function() {
    var registstate = true;
    var emailTrue = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/;
    if (email == "" || email == null || email == undefined || !emailTrue.test(email)) {
      this.showErrorToastUtils("请输入正确的邮箱");
      registstate = false;
    } else if (username == "" || username == null ||
      username == undefined) {
      this.showErrorToastUtils('请输入用户名');
      registstate = false;
    } else if (password == "" || password == null || password == undefined) {
      this.showErrorToastUtils('请输入密码');
      registstate = false;
    } else if (password.length < 6) {
      this.showErrorToastUtils('密码至少要6位');
      registstate = false;
    } else if (tpassword == "" || tpassword == null) {
      this.showErrorToastUtils("请再次输入密码");
      registstate = false;
    } else if (password != tpassword) {
      this.showErrorToastUtils("两次密码输入不一致");
      registstate = false;
    }
    if (registstate == true) {
      var that = this;
      wx.request({
        url: 'http://39.105.56.223/health-0.0.1-SNAPSHOT/user/regist',
        header: {
          "Content-Type": "application/json"
        },
        method: "POST",
        data: {
          email: email,
          password: password,
          username: username,
          identifying: identifying
        },
        success: function(res) {
          console.log(res)
          if (res.data.code == 200) {
            wx.showToast({ //这里提示失败原因
              title: res.data.msg,
              icon: 'loading',
              duration: 1500
            })
          } else {
            wx.showToast({
              title: '注册成功', //这里成功
              icon: 'success',
              duration: 1000
            });
            that.setData({
              isLogin: true,
            })
          }
        },
        fail: function(res) {
          console.log(res)
          wx.showToast({
            title: '请求失败',
            icon: 'none',
            duration: 1500
          })
        }
      });
    }
  },
  // 登陆
  login: function() {
    wx.redirectTo({

      url: '../login/login'

    });
  },
  //点击切换验证码
  newPhoto: function(e) {
    var that = this;
    let num = Math.random();
    var pic = "http://39.105.56.223/health-0.0.1-SNAPSHOT/user/getImgVerify?" + num;
    that.setData({
      img: pic
    })
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