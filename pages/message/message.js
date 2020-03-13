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
    try {
      wx.removeTabBarBadge({
        index: 3,
        fail(err) {
          console.log("无消息，不清除----------", err)
        }
      })
    }catch(e) {
      console.log("无消息，不清除----------", e)
    }
  },

  // 长按删除对话列表
  longTapHandler : function (e) {
    // console.log(e.currentTarget.dataset.id)
    // console.log("长按")
    var openid = e.currentTarget.dataset.openid;
    var id = e.currentTarget.dataset.id;
    console.log(openid, "openid")
    var that = this

    wx.showModal({
      title: '系统提示',
      content: '是否删除对话,删除后聊天记录也没有了哦',
      success(res) {
        if (res.confirm) {
          // var index = e.currentTarget.dataset.id
          var chatMessage = wx.getStorageSync("chatMessage");
          console.log(chatMessage, "前");
          delete chatMessage[openid];
          console.log(chatMessage, "后");

          wx.setStorageSync("chatMessage", chatMessage);

          var lists = that.data.lists
          lists.splice(id, 1)
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
    var openid = e.currentTarget.dataset.openid;

    // var isRead = this.data.lists[index].isRead
    var lists = this.data.lists
    var isread = lists[index].isread

    if (!isread){
      // 若消息已读 则不修改状态 若消息未读 则修改状态为true
      lists[index].isread = true
      this.setData({
        lists: lists
      })
      this.setMessage(openid)
    }

    wx.navigateTo({
      // 跳转到聊天页面
      url: '../chat/chat?uid=' + uid,
    })
  },

  setMessage(openid) {
    // 重新向缓存中添加消息
    // 获取当前聊天缓存
    var chatMessage = wx.getStorageSync("chatMessage");
    if (chatMessage) {
      // 若存在这个值 什么都不用管 因为他就是一个对象
    } else {
      // 需要初始化这个值
      chatMessage = {}
    }
    var message = chatMessage[openid]

    console.log(message)

    // 修改最后一条消息为已读
    var m = message[message.length - 1];
    console.log(m, "m--")
    m['isread'] = true;
    message[message.length - 1] = m;
    chatMessage[openid] = message;

    wx.setStorage({
      key: 'chatMessage',
      data: chatMessage,
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
    } else {
      this.setData({
        flag: true
      })
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
      data['openid'] = userinfo.openid;
      data['time'] = userMessage[userMessage.length - 1].date
      var isread = userMessage[userMessage.length - 1].isread;
      console.log(isread, "---isread")
      if (typeof (isread) == "undefined") {
        data['isread'] = true;
      } else {
        data['isread'] = isread;
      }
      
      dataArr.push(data)
    }
    console.log(dataArr)
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