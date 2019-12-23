// pages/classify/classify.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type : 0,
    explore : {},
    isFocus : false,
    currentPage : 1,
    pageSize : 10,
    productions : {},// 分区具体的作品
    visitnum : 0,
    eid : -1,// 专区ID
  },

  tapHandler : function (e) {
    wx.navigateTo({
      url: '../userinfo/userinfo',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.setData({
      eid : id
    })
    // 从缓存中取专区内容
    var explore = wx.getStorageSync("explore");
    for (var i = 0; i < explore.length; i++) {
      if (explore[i].explore.id == id){
        this.setData({
          explore: explore[i].explore,
          isFocus: explore[i].isFocus,
          visitnum: explore[i].explore.visitnum
        })
        break;
      }
    }
    // console.log(options)
    // 加载专区内容
    var currentPage = this.data.currentPage;
    var pageSize = this.data.pageSize;
    this.loadExplore(id, currentPage, pageSize);
  },

  loadExplore: function (id, currentPage, pageSize) {
    var token = wx.getStorageSync("accessToken").token;
    var that = this;
    wx.request({
      url: app.api.explore + "/" + id,
      method:"GET",
      data : {
        currentPage: currentPage,
        pageSize: pageSize,
        token : token
      },
      success : function(res){
        if (res.data.status == 200) {
          that.setData({
            productions : res.data.data
          })
        }
      }
    })
  },

  focus: function (e) {
    // console.log(e)
    var id = this.data.eid
    // console.log(id)
    var isFocus = e.target.dataset.isfocus
    // console.log(isFocus)
    // 获取token
    var accessToken = wx.getStorageSync("accessToken")
    var token = accessToken.token
    var that = this
    wx.request({
      url: app.api.explore_focus,
      method: "PUT",
      header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
      data: {
        isFocus: !isFocus,
        eid: id,
        token: token
      },
      success: function (res) {
        if (res.data.status == 200) {
          // console.log(res)
          wx.setStorageSync("explore", res.data.data)
          that.setData({
            isFocus: !isFocus
          })
        }
      }
    })
    // console.log(e)
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