// pages/edit/edit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type : 1,
    titles: ["昵称", "个性签名", "手机", "邮箱", "性别", "生日", "地区"],
    wordLength : 0,
    nickname : "bobo"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var type = options.type

    // console.log(options.type)
    this.setData({
      type: type
    })

    // 设置标题
    var title = this.data.titles[type - 1]
    wx.setNavigationBarTitle({
      title: '修改' + title,
    })

    // 设置字符长度
    var length = this.data.nickname.trim().length
    this.setData({
      wordLength: length
    })
  },

  // 判断字符长度
  wordLength : function(e) {
    // console.log(e.detail.value)
    var inputValue = e.detail.value.trim()
    var length = inputValue.length
    // console.log(length)
    
    // 这里应该进行非法字符判断
    // ...

    this.setData({
      wordLength : length
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