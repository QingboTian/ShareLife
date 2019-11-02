// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 操作
    ops : [
      {
        id : "0",
        icon: "../../images/pinglun.png",// 图标
        url: "../comment/comment",// 跳转的页面
        name : "评论"
      },
      {
        id: "1",
        icon: "../../images/shoucang.png",
        url: "../collect/collect",// 跳转的页面
        name: "收藏"
      },
      {
        id: "2",
        icon: "../../images/fensi.png",
        url: "../fans/fans",// 跳转的页面
        name: "粉丝"
      },
      {
        id: "3",
        icon: "../../images/guanzhu.png",
        url: "../focus/focus",// 跳转的页面
        name: "关注"
      },
      {
        id: "4",
        icon: "../../images/dianzan.png",
        url: "../like/like",// 跳转的页面
        name: "点赞"
      },
      {
        id: "5",
        icon: "../../images/shezhi.png",
        url: "../setting/setting",// 跳转的页面
        name: "设置"
      },
    ],
    // 轮播图
    swiper : [
      {
        src: "../../images/70.png",
        desc : "" // 描述
      },
      {
        src: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/2.jpg",
        desc : ""
      },
      {
        src: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/4.jpg",
        desc : ""
      }
    ]
  },

  // 展示个人信息
  showPersonInfo : function (e) {
    wx.navigateTo({
      url: '../personinfo/personinfo',
    })
  },

  opTapHandler : function(e) {
    // 访问对应页面
    var pageUrl = e.currentTarget.dataset.url
    wx.navigateTo({
      url: pageUrl,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的',
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