// pages/feedback/feedback.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "闪退、卡顿或界面错位",
    content : "",
    email : "",
    phone : "",
    msg : "",
    token : null,
    radioItems: [
      { name: '闪退、卡顿或界面错位', value: '0', checked: true },
      { name: '无法登录或登录失败', value: '1' },
      { name: '无法接收/发送消息', value: '2' },
      { name: '发布作品超时/失败', value: '3' },
      { name: '举报(如作品、言论等违反法律法规，请提供用户ID)', value: '4' },
      { name: '其他(如使用反馈或其他Bug等)', value: '5' }
    ],
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

  radioChange: function (e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value);
    // console.log(e);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
      if (radioItems[i].checked) {
        console.log(radioItems[i].name)
        this.setData({
          title: radioItems[i].name
        })
      }
    }

    this.setData({
      radioItems: radioItems,
      [`formData.radio`]: e.detail.value
    });
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