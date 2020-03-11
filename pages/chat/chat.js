// pages/chat/chat.js
let socketOpen = false
let socketMsgQueue = []
const wss = 'wss://tianqb.cn/shortvideo/websocket/'
// const wss = 'ws://192.168.1.104:8989/shortvideo/websocket/'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openFlag: false, // 当前socket开启标志
    inputContent: "",
    receiver: null, // 聊天的对方
    sender: null, // 自己
    userinfo: null,
    messages: [
    ]
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var uid = options.uid;
    var token = wx.getStorageSync("accessToken").token
    this.loadUserinfo(uid, token);
    wx.hideShareMenu();

    this.loadSender();

    // 获取聊天缓存信息
    // this.loadMessages();

    // 连接websocket
    this.connectWebSocket(this.data.sender);
  },

  connectWebSocket(sender) {
    wx.connectSocket({
      url: wss + sender.openid,
      // url: 'ws://192.168.1.103:8989/shortvideo/websocket/' + sender.openid,
    })

    wx.onSocketOpen(function(res) {
      socketOpen = true
      console.log(res, "---------socket 连接成功")
      for (let i = 0; i < socketMsgQueue.length; i++) {
        sendSocketMessage(socketMsgQueue[i])
      }
      socketMsgQueue = []
    })


    var that = this;
    wx.onSocketMessage(function(res) {
      var messages = that.data.messages;
      var msgs = res.data.split("---:---");
      var sender = msgs[0];
      var content = msgs[1];
      var receiver = that.data.sender.openid;
      var userinfo = that.data.userinfo;
      var date = that.getDate();
      var data = {
        content: content,
        sender: sender,
        receiver: receiver,
        position: "left",
        userinfo: userinfo,
        date: date
      }

      if (sender != that.data.receiver.openid) {
        console.log("非当前用户发送消息")
        // 非当前用户发送的消息 不能展示
        // 应该添加在缓存中
        wx.getStorage({
          key: 'chatMessage',
          success: function(res) {
            var chatMessage = res.data;

            if (!chatMessage) {
              chatMessage = {}
              var tempmsg = []
              tempmsg.push(data)
              chatMessage[sender] = tempmsg
            } else {
              var tempmsg = chatMessage[sender]
              if (!tempmsg) {
                tempmsg = []
              }
              tempmsg.push(data)
              chatMessage[sender] = tempmsg
            }

            wx.setStorage({
              key: 'chatMessage',
              data: chatMessage,
            })
          },
        })
        return;
      }

      messages.push(data)
      that.setData({
        messages: messages,
        intoView: "view" + (messages.length - 1)
      })
      console.log(res)
    })
  },

  inputHandler(e) {
    this.setData({
      inputContent: e.detail.value
    })
    // console.log(e)
  },

  // 加载当前用户信息 即发送者
  loadSender() {
    var userinfo = wx.getStorageSync("accessToken").userinfo;
    this.setData({
      sender: userinfo
    })
  },

  loadMessages(openid) {
    var chatMessage = wx.getStorageSync("chatMessage");
    // var openid = this.data.receiver.openid;
    var messages = chatMessage[openid];
    // 对方的openid是聊天消息的标识符
    if (messages) {
      console.log(messages)
      console.log("-----------")
      this.setData({
        messages: messages,
        intoView: "view" + (messages.length - 1)
      })
    }
  },

  loadUserinfo(uid, token) {
    var that = this;
    wx.request({
      url: app.api.userUpdate + "/" + uid,
      data: {
        token: token
      },
      success(res) {
        var openid = res.data.data.openid;
        console.log(openid)
        that.setData({
          receiver: res.data.data,
          userinfo: res.data.data
          // userinfo: res.data.data
        })
        // 此处加载聊天信息
        that.loadMessages(openid);

        wx.setNavigationBarTitle({
          title: res.data.data.nick,
        })
      }
    })
  },

  // 发送消息
  send() {
    var inputContent = this.data.inputContent;
    if (inputContent.trim() == "") {
      console.log("内容为空，不得发送")
      return;
    }
    this.setData({
      inputContent: ""
    })
    var receiver = this.data.receiver; // 对方
    var sender = this.data.sender; // 自己
    // 封装消息格式
    var content = receiver.openid + "---:---" + inputContent;
    //var openFlag = this.data.openFlag;//
    var messages = this.data.messages;
    var userinfo = this.data.userinfo;

    var date = this.getDate();

    var data = {
      content: inputContent,
      sender: sender.openid,
      receiver: receiver.openid,
      position: "right",
      userinfo: userinfo,
      date: date
    }
    console.log(messages)
    messages.push(data)
    this.setData({
      messages: messages,
      intoView: "view" + (messages.length - 1)
    })

    if (sender.openid == receiver.openid) {
      // 给自己发消息不占用服务器资源
      // return;
    }

    var that = this
    if (socketOpen) {
      wx.sendSocketMessage({
        data: content
      })
    } else {
      socketMsgQueue.push(content)
    }
  },

  getDate() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1; 
    var date = now.getDate();
    var day = now.getDay();
    var hour = now.getHours();
    var minu = now.getMinutes();

    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (minu < 10) minu = "0" + minu;

    return month + "-" + date + " " + hour + ":" + minu;
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
    if (socketOpen) {
      wx.closeSocket()
    }
    wx.onSocketClose(function(res) {
      console.log('WebSocket 已关闭！')
    })


    // 获取当前聊天数据
    var messages = this.data.messages;

    if (messages.length == 0) {
      return;
    }

    var openid = this.data.receiver.openid;
    // 重新向缓存中添加消息
    // 获取当前聊天缓存
    var chatMessage = wx.getStorageSync("chatMessage");
    if (chatMessage) {
      // 若存在这个值 什么都不用管 因为他就是一个对象
    } else {
      // 需要初始化这个值
      chatMessage = {}
    }
    chatMessage[openid] = messages;
    wx.setStorage({
      key: 'chatMessage',
      data: chatMessage,
    })
    //wx.setStorageSync("chatMessage", chatMessage);
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