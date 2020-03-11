// pages/message/message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag : true, // 从本地缓存或者数据库读取是否存在消息列表
    lists : [
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

    // wx.showToast({
    //   title: '正在开发中',
    // })
    wx.removeTabBarBadge({
      index : 2
    })
  },

  // 长按删除对话列表
  longTapHandler : function (e) {
    // console.log(e.currentTarget.dataset.id)
    // console.log("长按")

    var that = this

    wx.showModal({
      title: '系统提示',
      content: '是否删除对话,删除后聊天记录也没有了哦',
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
    var uid = e.currentTarget.dataset.uid

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
      url: '../chat/chat?uid=' + uid,
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
    this.loadMessages();
  },

  loadMessages() {
    // debugger
    var chatMessages = wx.getStorageSync("chatMessage");
    console.log(chatMessages, "-------chatMessages")
    // console.log(chatMessages)
    if (!chatMessages) {
      
      this.setData({
        flag :false
      })
      return;
    }
    
    // console.log()
    var keyArr = Object.keys(chatMessages)

    var dataArr = []
    for (var i = 0; i < keyArr.length; i++) {
      var userMessage = chatMessages[keyArr[i]]// 单独用户的所有本地聊天记录
      // var userinfo = userMessage[userMessage.length - 1].userinfo
      // 获取最新消息
      // console.log(userMessage[userMessage.length - 1])
      var userinfo;
      for (var j = 0; j < userMessage.length; j++) {
        userinfo = userMessage[j].userinfo
        if (userinfo) {
          break;
        }
        if (j == userMessage.length - 1) {
          console.log("所有消息都没有用户信息")
        }
      }
      
      console.log(userinfo)
      var tempContent = userMessage[userMessage.length - 1].content;
      if (tempContent.length > 10) {
        tempContent = tempContent.substring(0, 10) + "......"
      }
      var data = {};
      data['content'] = tempContent;
      data['poster'] = userinfo.avatarurl;
      data['name'] = userinfo.nick;
      data['uid'] = userinfo.id;
      data['time'] = userMessage[userMessage.length - 1].date

      dataArr.push(data)
    }
    this.setData({
      lists: dataArr
    })
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