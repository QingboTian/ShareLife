// pages/explore/explore.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areas : [
      {
        name : "美女专区",
        content: "该专区目前有500条内容"
      },
      {
        name: "美女专区",
        content: "该专区目前有500条内容"
      },
      {
        name: "美女专区",
        content: "该专区目前有500条内容"
      },
      {
        name: "美女专区",
        content: "该专区目前有500条内容"
      },
      {
        name: "美女专区",
        content: "该专区目前有500条内容"
      },
      {
        name: "美女专区",
        content: "该专区目前有500条内容"
      },
      {
        name: "美女专区",
        content: "该专区目前有500条内容"
      },
      {
        name: "美女专区",
        content: "该专区目前有500条内容"
      },
      {
        name: "美女专区",
        content: "该专区目前有500条内容"
      },
    ]
  },

  // 进入专区详情页面
  tapHandler : function (e) {
    wx.navigateTo({
      url: '../classify/classify',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '发现',
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