// pages/showFeedback/showFeedback.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id : null,
    token : null,
    feedback : null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var token = wx.getStorageSync("accessToken").token;
    this.setData({
      id : id,
      token : token
    })

    wx.setNavigationBarTitle({
      title: '我的反馈',
    })

    wx.hideShareMenu();
    // console.log("反馈ID", id)
    this.loadFeedback();
  },

  loadFeedback(){
    var id = this.data.id;
    var token = this.data.token;
    var that = this;
    wx.request({
      url: app.api.feedback + "/" + id,
      data : {
        token : token
      },
      success(res){
        that.setData({
          feedback : res.data.data
        })
      }
    })
  },

  button(){
    wx.navigateBack({
      
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