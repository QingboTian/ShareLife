// pages/fans/fans.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fans : null,
    isShow : false
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var token = wx.getStorageSync("accessToken").token

    wx.setNavigationBarTitle({
      title: '粉丝',
    })
    this.loadFans(token);
  },

  // 点击关注按钮具体处理策略
  focusHandler : function (e) {
    console.log(e)
    var isFocus = e.currentTarget.dataset.isfocus;
    console.log(isFocus)
    var index = e.currentTarget.dataset.index;

    var fans = this.data.fans;
    fans[index].focusStatus = !fans[index].focusStatus;
    this.setData({
      fans : fans
    })

    var token = wx.getStorageSync("accessToken").token;

    wx.request({
      url: app.api.user.focus + "/" + fans[index].uid,
      method: "GET",
      data: {
        token: token,
        isFocus: !isFocus
      },
      success: function (res) {
        // console.log(res)
      }
    })
  },

  // 加载粉丝列表
  loadFans : function (token) {
    var that = this;
    wx.request({
      url: app.api.userFans,
      method : "GET",
      data : {
        token : token
      },
      success : function(res) {
        console.log(res)
        
        if (res.data.data.length == 0) {
          that.setData({
            isShow : true
          })
        }
        
        that.setData({
          fans : res.data.data
        })
      }
    })
  },

  toUserPage :function(e) {
    var uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: "../userinfo/userinfo?uid=" + uid,
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