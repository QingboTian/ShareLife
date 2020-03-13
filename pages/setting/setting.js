// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    size: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu();
    wx.setNavigationBarTitle({
      title: '设置',
    })

    this.getStorageInfo()
  },

  // 获取当前缓存大小
  getStorageInfo() {
    var that = this;
    wx.getStorageInfo({
      success: function(res) {
        that.setData({
          size: res.currentSize
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  clear() {
    var that = this;
    wx.showModal({
      title: '消息提醒',
      content: '是否要清理缓存数据(包含聊天记录)',
      success: function(res) {
        if (res.confirm) {
          // 这里将专区缓存进行清除
          wx.showLoading({
            title: '清理缓存中',
          })
          wx.removeStorage({
            key: 'explore',
            success(res) {
              wx.removeStorage({
                key: 'chatMessage',
                success: function(res) {
                  wx.hideLoading();
                  wx.showToast({
                    title: '清理成功',
                  })
                  that.getStorageInfo()
                },
                fail(err) {
                  wx.hideLoading();
                  wx.showToast({
                    title: '发生错误',
                  })
                }
              })
            },
            fail(err) {
              wx.hideLoading();
              wx.showToast({
                title: '发生错误',
              })
            }
          })
        }
      }
    })
  },

  handler() {
    console.log(1)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})