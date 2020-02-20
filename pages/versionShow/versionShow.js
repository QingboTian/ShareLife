// pages/versionShow/versionShow.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id : null,
    version : null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    wx.setNavigationBarTitle({
      title: '版本详情',
    })
    var id = options.id;
    this.setData({
      id : id
    })

    this.loadVersionInfo();
  },

  loadVersionInfo(){
    var id = this.data.id;
    var that = this;
    wx.request({
      url: app.api.version + "/" + id,
      success(res) {
        that.setData({
          version : res.data.data
        })
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