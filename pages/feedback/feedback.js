// pages/feedback/feedback.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title : "",
    content : "",
    email : "",
    phone : "",
    msg : "",
    token : null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var token = wx.getStorageSync("accessToken").token;
    this.setData({
      token : token
    })

    wx.setNavigationBarTitle({
      title: '我要反馈',
    })

    wx.hideShareMenu();
  },

  inputHandler : function(e){
    var value = e.detail.value.trim();
    var type = e.target.dataset.type;
    var data = {};
    data[type] = value;
    this.setData(data)
  },

  submit(){
    var title = this.data.title;
    var content = this.data.content;
    var email = this.data.email;
    var phone = this.data.phone;


    if (title.trim() == "" || content.trim() == "") {
      this.setData({
        msg : "标题和反馈内容为必填项"
      })
      return;
    }


    var token = this.data.token;
    var data = {
      token: token,
      titlte: title,
      content: content,
    }

    // 表单校验
    if (phone.trim() != "") {
      var flag = app.isPhoneAvailable(phone);
      if (!flag) {
        this.setData({
          msg : "手机号码格式错误"
        })
        return;
      }else {
        data['phone'] = phone
      }
    }

    if (email.trim() != "") {
      var flag = app.isMailAvailable(email);
      if (!flag) {
        this.setData({
          msg: "邮箱格式错误"
        })
        return;
      }else {
        data['email'] = email
      }
    }
    wx.showLoading({
      title: '提交中，请稍后',
    })
    wx.request({
      url: app.api.feedback,
      method : "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      data : data,
      success : function(res) {
        if (res.data.status == 200) {
          wx.hideLoading();
          wx.showToast({
            title: '提交成功',
          })
          wx.navigateBack({
          })
        }else if (res.data.status == 403) {
          wx.hideLoading();
          wx.showToast({
            title: res.data.msg,
          })
        }else {
          wx.hideLoading();
          wx.showToast({
            title: "发生了一个错误",
          })
        }
      }
    })
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