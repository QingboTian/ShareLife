// pages/aboutAuthor/aboutAuthor.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '关于作者',
    })

    wx.hideShareMenu();
  },

  handler(e){
    // console.log(e)
    var text = e.currentTarget.dataset.text;
    wx.showModal({
      title: '提示',
      content: '点击复制地址按钮打开浏览器进行查看',
      confirmText: '复制地址',
      success(res) {
        if (res.confirm) {
          wx.setClipboardData({
            data: text,
            success(res) {
              wx.showToast({
                title: '复制成功',
              })
            }
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