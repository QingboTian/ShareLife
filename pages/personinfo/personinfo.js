// pages/personinfo/personinfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: "../../images/touxiang.jpg"
  },

  // 更换头像
  replaceThepicture : function(e) {

    var that = this

    wx.chooseImage({
      count : 1, // 选择一张照片
      sizeType: ['original', 'compressed'], // 原图 压缩图
      sourceType: ['album', 'camera'], // 拍照 相册
      success: function(res) {
        const tempFilePaths = res.tempFilePaths
        that.setData({
          src: tempFilePaths
        })
        console.log(tempFilePaths)
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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