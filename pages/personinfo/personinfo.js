// pages/personinfo/personinfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info : {
    },
    area : "",// 需要将省市县串联成字符串
    sex : ""
  },

  // 更换头像
  replaceThepicture : function(e) {

    var that = this

    wx.chooseImage({
      count : 1, // 选择一张照片
      // sizeType: ['original', 'compressed'], // 原图 压缩图
      // sourceType: ['album', 'camera'], // 拍照 相册
      success: function(res) {
        const tempFilePaths = res.tempFilePaths
        that.setData({
          src: tempFilePaths
        })
        console.log(tempFilePaths)
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  loadInfo : function() {
    var accessToken = wx.getStorageSync("accessToken");
    var userinfo = accessToken.userinfo;
    this.setData({
      info : userinfo
    })

    var sexType = userinfo.sex
    var sex = ""
    if (sexType == 0) {
      sex = "火星人"
    }else if (sexType == 1) {
      sex = "男"
    }else if (sexType == 2) {
      sex = "女"
    }

    this.setData({
      sex : sex
    })

    // 获取省市县的信息
    var country = userinfo.country
    var province = userinfo.province
    var city = userinfo.city
    var county = userinfo.county
    var area = country;
    if (province != "" && province != null) {
      area += province
    } else if (city != "" && city != null) {
      area += "-" + city
    } else if (county != "" && county != null) {
      area += "-" + county
    }
    this.setData({
      area : area
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
    // 加载个人信息
    this.loadInfo();
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