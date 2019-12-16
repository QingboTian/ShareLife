var app = getApp();
var util = require('../../utils/util.js');
// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone : "",
    pwd : "",
    repwd : "",
    currPhoneLength : 0,
    currPwdLength : 0,
    rePwdTips : "",
    checkBtnAble: false,
    checkNumStr: "发送验证码",
    checknum : ""
  },

  inputHandler : function (e) {
    var value = e.detail.value.trim();
    var type = e.target.dataset.type;
    // console.log(type)
    var data = {}
    data[type] = value;
    // console.log(data)
    this.setData(data)
    
    // 改变长度
    var length = value.length
    if (type == "phone") {
      this.setData({
        currPhoneLength : length
      })
    }else if (type == "pwd") {
      this.setData({
        currPwdLength: length
      })
    }else if (type == "repwd") {
        var pwd = this.data.pwd
        if (value != pwd) {
          this.setData({
            rePwdTips : "两次密码输入不一致"
          })
        }else {
          this.setData({
            rePwdTips: ""
          })
        }
    }
  },

  // 发送验证码按钮进行刷新
  sendCheckNum: function (e) {
    var phone = this.data.phone;

    if (phone.length < 11) {
      return;
    }

    // 此处调用真正的发短信接口
    // ...
    // app.api.regist.msgcode

    console.log(app.api.regist.msgcode)
    wx.request({
      url: app.api.regist.msgcode,
      data : {
        phone : phone
      },
      method:"GET",
      // 实际不回调 手机接收短信
      // success : function(data) {
      //   console.log("模拟短信验证");
      //   console.log(data)
      // }
    })

    // 设置不可用
    this.setData({
      checkBtnAble: true
    })
    var that = this

    var seconds = 60// 60s
    var intervalID = setInterval(function () {
      that.setData({
        checkNumStr: --seconds + 's'
      })
      // 到时按钮可用
      if (seconds == 0) {
        that.setData({
          checkBtnAble: false,
          checkNumStr: "发送验证码"
        })
        clearInterval(intervalID)// 清除计时器
      }
    }, 1000)// 每隔1s进行刷新
  },

  getUserInfoHandler : function(e) {
    var wxUserInfo = e.detail.rawData;
    console.log(wxUserInfo)
    var phone = this.data.phone;
    var password = this.data.pwd;
    var checkcode = this.data.checknum
    wx.login({
      success : function(res){
        var code = res.code;
        wx.request({
          url: app.api.regist.regist,
          header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
          data: {
            wxUserInfo: wxUserInfo,
            phone: phone,
            password : password,
            checkcode: checkcode,
            code : code
          },
          method: "POST",
          success : function (data) {
            console.log(data)
          }
        })
      }
    })

    // app.api.regist.msgcode
    
    
    console.log(e.detail.rawData)
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

  }
})