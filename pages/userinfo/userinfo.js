// pages/userinfo/userinfo.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type : 0,
    userinfo : null,
    currentPage : 1,
    pageSize : 10,
    proinfo : null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var uid = options.uid;

    // console.log(options)
    var token = wx.getStorageSync("accessToken").token

    this.loaduserinfo(uid, token)

    var currentPage = this.data.currentPage
    var pageSize = this.data.pageSize

    this.loadproinfo(uid, token, currentPage, pageSize)
  },

// 加载用户信息
  loaduserinfo : function (uid, token) {

    var that = this;   
    
    wx.request({
      url: app.api.user.userinfo + "/" + uid,
      method : "GET",
      data : {
        token : token,
      },
      success : function(res) {
        if(res.data.status == 200) {
          that.setData({
            userinfo : res.data.data
          })

          wx.setNavigationBarTitle({
            title: res.data.data.userinfo.nick,
          })
        }else {
          wx.showToast({
            title: '请求失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

// 加载作品信息
  loadproinfo: function (uid, token, currentPage, pageSize) {
    var that = this;
    
    wx.request({
      url: app.api.user.proinfo + "/" + uid,
      method : "GET",
      data : {
        token : token,
        pageSize: pageSize,
        currentPage: currentPage
      },
      success : function (res) {
        if (res.data.status == 200) {
          that.setData({
            proinfo : res.data.data,
            currentPage: res.data.data.currentPage,
            pageSize: res.data.data.pageSize
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