// pages/edit/edit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type : 3,
    titles: ["昵称", "个性签名", "手机", "邮箱", "性别", "生日", "地区"],
    nickWordLength : 0,
    nickname : "bobo",
    signatureWordLength : 0,
    signature : "心若向阳，无畏悲伤！",
    checkBtnAble : false,
    checkNumStr: "发送验证码",
    phone : "13888888888"
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
    var length1 = this.data.nickname.trim().length
    var length2 = this.data.signature.trim().length
    this.setData({
      nickWordLength: length1,
      signatureWordLength: length2
    })
  },

  // 判断字符长度
  wordLength : function(e) {
    
    // 这里应该进行非法字符判断
    // ...

    var type = e.currentTarget.dataset.type
    var data = {}
    var inputValue = e.detail.value.trim()
    var length = inputValue.length
    data[type] = length

    this.setData(data)
  },

  // 发送验证码按钮进行刷新
  sendCheckNum : function(e) {

    // 此处调用真正的发短信接口
    // ...

    // 设置不可用
    this.setData({
      checkBtnAble: true
    })
    var that = this

    var seconds = 60// 60s
    var intervalID = setInterval(function(){
      that.setData({
        checkNumStr : --seconds + 's'
      })
      // 到时按钮可用
      if (seconds == 0) {
        that.setData({
          checkBtnAble: false,
          checkNumStr:  "发送验证码"
        })
        clearInterval(intervalID)// 清除计时器
      }
    },1000)// 每隔1s进行刷新
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