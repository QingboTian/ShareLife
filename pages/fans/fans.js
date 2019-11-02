// pages/fans/fans.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fans : [
      {
        id : "0",
        poster: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/touxiang.jpg",
        name : "user1",
        signature : "签名",
        isFocus : 1
      },
      {
        id: "1",
        poster: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/touxiang.jpg",
        name: "user2",
        signature: "签名",
        isFocus: 0
      },
      {
        id: "2",
        poster: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/touxiang.jpg",
        name: "user3",
        signature: "签名",
        isFocus: 1
      },
      {
        id: "3",
        poster: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/touxiang.jpg",
        name: "user4",
        signature: "签名",
        isFocus: 0
      }
    ]
  },

  // 点击关注按钮具体处理策略
  focusHandler : function (e) {
    var isFocus = e.currentTarget.dataset.isFocus
    var id = parseInt(e.currentTarget.dataset.id)

    var fans = this.data.fans
    fans[id].isFocus = !fans[id].isFocus
    this.setData({
      fans : fans
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '粉丝',
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