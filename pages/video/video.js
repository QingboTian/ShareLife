// pages/video/video.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type : 0 // 1 ：video    0 ：image 
  },

  // 放大看图
  previewImage : function (e) {
    // https://tianqb.cn/group1/M00/00/00/rBsADF0lvz6AEcuXAAFZp27uQQc209.jpg
    // var current = e.target.dataset.src
    var current = "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/4.jpg"

    console.log(current)

    var urls = []
    urls.push(current)

    wx.previewImage({
      current : current, // 此处传递的地址值必须是网络资源的链接 本地的无法显示
      urls: urls
    })
  },

  // 点击作者或者评论者的头像或名称区域进行跳转
  tapHandler : function(e) {
    wx.navigateTo({
      url: '../userinfo/userinfo',
    })
  },

  focus : function (e) {
    console.log("关注成功")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    var type = options.type
    this.setData({
      type : type
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