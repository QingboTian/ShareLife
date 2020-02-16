// pages/message/message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag : true, // 从本地缓存或者数据库读取是否存在消息列表
    lists : [
      {
        poster: "../../images/message.jpeg",
        name : "官方宝宝",
        content : "欢迎加入我们！！！",
        time : "12:00",
        isRead : true// 已读
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    wx.setNavigationBarTitle({
      title: '消息',
    })

    wx.showToast({
      title: '正在开发中',
    })
  },

  // 长按删除对话列表
  longTapHandler : function (e) {
    // console.log(e.currentTarget.dataset.id)
    // console.log("长按")

    var that = this

    wx.showModal({
      title: '系统提示',
      content: '是否删除对话',
      success(res) {
        if (res.confirm) {
          var index = e.currentTarget.dataset.id
          var lists = that.data.lists
          lists.splice(index, 1)
          that.setData({
            lists: lists
          })

          // 判断数据是否删完
          if(lists.length == 0) {
            that.setData({
              flag: false
            })
          }
        }
      }
    })
  },

  // 点击事件
  tapHandler : function (e) {

    // console.log(e.currentTarget.dataset.id)
    var index = e.currentTarget.dataset.id

    // var isRead = this.data.lists[index].isRead
    var lists = this.data.lists
    var isRead = lists[index].isRead

    if (!isRead){
      // 若消息已读 则不修改状态 若消息未读 则修改状态为true
      lists[index].isRead = true

      this.setData({
        lists: lists
      })
    }

    wx.navigateTo({
      // 跳转到聊天页面
      url: '../chat/chat?id=' + index,
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