// pages/collect/collect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collects : [
      {
        poster: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/touxiang.jpg",
        name: "热门电影推荐",
        content: "最佳男主角花落谁家？",
        like : 10000,
        comment : 500,
        type : 1,
        src : "",
        labels : [
          {
            name : "电影"
          },
          {
            name: "经典"
          },
          {
            name: "强力推荐"
          }
        ]
      },
      {
        poster: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/touxiang.jpg",
        name: "热门电影推荐",
        content: "最佳男主角花落谁家？",
        like: 10000,
        comment: 500,
        type: 0,
        src: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/4.jpg",
        labels: [
          {
            name: "图片"
          },
          {
            name: "景色"
          },
          {
            name: "强力推荐"
          }
        ]
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '收藏',
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