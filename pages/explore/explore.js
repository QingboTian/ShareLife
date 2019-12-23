// pages/explore/explore.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    explore : [
    ]
  },

  // 进入专区详情页面
  tapHandler : function (e) {
    var id = e.currentTarget.dataset.id;
    // console.log(e)
    var token = wx.getStorageSync("accessToken").token;
    // 请求访问接口
    wx.request({
      url: app.api.visitExplore,
      method: "GET",
      data : {
        id: id,
        token: token
      }
    })
    wx.navigateTo({
      url: '../classify/classify?id=' + id,
    })
  },

  focus : function (e) {
    // console.log(e)
    var id = e.target.dataset.id
    // console.log(id)
    var isFocus = e.target.dataset.isfocus
    // console.log(isFocus)
    // 获取token
    var accessToken = wx.getStorageSync("accessToken")
    var token = accessToken.token
    var that = this
    wx.request({
      url: app.api.explore_focus,
      method:"PUT",
      header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
      data : {
        isFocus: !isFocus,
        eid : id,
        token : token
      },
      success : function(res) {
        if (res.data.status == 200) {
          // console.log(res)
          wx.setStorageSync("explore", res.data.data)
          that.setData({
            explore: res.data.data
          })
        }
      }
    })
    // console.log(e)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '发现',
    })

    this.loadinfo();
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
    // 从缓存读取
    // var explore = wx.getStorageSync("explore")
    // this.setData({
    //   explore : explore
    // })
    
  },

  loadinfo : function() {

    // 获取token
    var accessToken = wx.getStorageSync("accessToken")
    var token = accessToken.token;
    var that = this
    wx.request({
      url: app.api.explore,
      method : "GET",
      data : {
        token : token
      },
      success : function(res) {
        console.log(res)
        // 将查询结果添加到缓存中
        wx.setStorageSync("explore", res.data.data)
        that.setData({
          explore : res.data.data
        })
      }
    })
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