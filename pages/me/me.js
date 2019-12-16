const app = getApp()

// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 操作
    ops : [
    ],
    // 轮播图
    swiper : [
    ],
    // 是否用户是否登录
    // isLogin: null
  },

  // 展示个人信息
  showPersonInfo : function (e) {
    wx.navigateTo({
      url: '../personinfo/personinfo',
    })
  },

  login : function (e) {
    wx.redirectTo({
      url: '../login/login',
    })
  },

  opTapHandler : function(e) {
    // 访问对应页面
    var pageUrl = e.currentTarget.dataset.url
    wx.navigateTo({
      url: pageUrl,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 判断用户是否登录
    app.preLogin(app);

    wx.setNavigationBarTitle({
      title: '我的',
    })

    // 加载功能区
    this.loadGongengqu(this);
    // 加载轮播图
    this.loadSlide(this);
  },

  loadGongengqu : function (that) {
    
    // var that = this
    wx.request({
      url: app.api.me.gongneng,
      method : "GET",
      success : function (data) {
        // console.log(data.data.data)
        that.setData({
          ops : data.data.data
        })
        // console.log(data.data.data)
      }
    })
  },

  loadSlide : function (that) {
    wx.request({
      url: app.api.me.slide,
      method: "GET",
      success: function (data) {
        // console.log(data.data.data)
        that.setData({
          swiper: data.data.data
        })
        console.log(data.data.data)
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
    // 判断用户是否登录
    // var accesstoken = app.globalData.accesstoken;
    // this.setData({
    //   isLogin: accesstoken != null
    // })
    // console.log("xianshi")
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