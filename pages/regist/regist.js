const urlPath = require('../common/config').url_microService;
Page({
  /**
   * 页面的初始数据
   * 初始化两个输入值
   */
  data: {
    img: urlPath + "/user/getImgVerify",
    username: '',
    password: '',
    tpassword: '',
    email: '',
    identifying: '',
    hidden: true,
    btnValue: '', //按钮显示
    btnDisabled: false,
    code: '', //用户输入的验证码
    second: 60,
    phone: '', //手机号
    trueCode: '', //正确的验证码
  },
  //获取邮箱
  email: function(e) {
    this.setData({
      email: e.detail.value
    })
  },
  //获取用户名
  username: function(e) {
    this.setData({
      username: e.detail.value
    })
  },
  //获取密码
  password: function(e) {
    this.setData({
      password: e.detail.value
    })
  },

  tpassword: function(e) {
    this.setData({
      tpassword: e.detail.value
    })
  },
  //手机号输入
  bindPhoneInput(e) {
    console.log(e.detail.value);
    var val = e.detail.value;
    this.setData({
      phone: val
    })
    if (val != '') {
      this.setData({
        hidden: false,
        btnValue: '获取验证码'
      })
    } else {
      this.setData({
        hidden: true
      })
    }
  },
  //验证码输入
  bindCodeInput(e) {
    this.setData({
      code: e.detail.value
    })
  },
  //获取验证码
  getCode: function() {
    var that = this;
    if (this.data.phone.length != 11) {
      this.showErrorToastUtils("请输入正确的手机号");
    } else {
      wx.request({
        url: urlPath + '/user/smsg?phone=' + this.data.phone,
        method: 'POST',
        success: function(e) {
          that.timer();
          console.log(e);
          that.setData({
              trueCode: e.data.msg,
            })
        }
      })
    }
  },
  // 注册
  register: function() {
    var that = this;
    var registstate = that.checkUserInput();

    if (registstate) {
      console.log(this.data)
      wx.request({
        url: urlPath + '/user/regist',
        header: {
          "Content-Type": "application/json"
        },
        method: "POST",
        data: {
          email: this.data.email,
          password: this.data.password,
          username: this.data.username,
          phone: this.data.phone,
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
              title: '注册成功', //这里成功
              icon: 'success',
              duration: 1000,
              success: function() {
                wx.navigateTo({
                  url: '../login/login',
                })
              }
            });
            that.setData({
              isLogin: true,
            })
          };

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
    var pic = urlPath + "/user/getImgVerify?" + num;
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
        }
      }
    })
  },
  /**
   * 时间
   */
  timer: function() {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          var second = this.data.second - 1;
          this.setData({
            second: second,
            btnValue: second + '秒',
            btnDisabled: true
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              btnValue: '获取验证码',
              btnDisabled: false
            })
            resolve(setTimer)
          }
        }, 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },
  //检查用户输入
  checkUserInput: function() {
    var emailTrue = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/;
    if (this.data.email == "" || this.data.email == null || this.data.email == undefined || !emailTrue.test(this.data.email)) {
      this.showErrorToastUtils("请输入正确的邮箱");
      return false;
    } else if (this.data.username == "" || this.data.username == null ||
      this.data.username == undefined) {
      this.showErrorToastUtils('请输入用户名');
      return false;
    } else if (this.data.password == "" || this.data.password == null || this.data.password == undefined) {
      this.showErrorToastUtils('请输入密码');
      return false;
    } else if (this.data.password.length < 6) {
      this.showErrorToastUtils('密码至少要6位');
      return false;
    } else if (this.data.tpassword == "" || this.data.tpassword == null) {
      this.showErrorToastUtils("请再次输入密码");
      return false;
    } else if (this.data.password != this.data.tpassword) {
      this.showErrorToastUtils("两次密码输入不一致");
      return false;
    } else if (this.data.code == "" || this.data.code == null || this.data.code == undefined) {
      this.showErrorToastUtils("请输入验证码");
      return false;
    } else if (this.data.code != this.data.trueCode) {
      this.showErrorToastUtils("验证码输入有误请重试");
      return false;
    }
    return true;
  },
})