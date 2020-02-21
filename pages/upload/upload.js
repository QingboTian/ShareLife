// pages/upload/upload.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
  },

  optionHandler : function(e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    if (id == 1) {
      // 马上拍
      wx.chooseVideo({
        sourceType: ['camera'],// 拍摄
        compressed: false,// 是否压缩
        maxDuration:60,// 拍摄时长
        camera : 'back',// 默认打开后置
        success:function(res) {
          that.publish(res.tempFilePath, 1, res.duration, res.height, res.width);
        }
      })
    } else if (id == 2) {
      // wx.showLoading({
      //   title: '视频加载中...',
      // });
      wx.chooseVideo({
        sourceType: ['album'],// 拍摄
        compressed: false,// 是否压缩
        success: function (res) {
          if (res.duration > 120) {
            wx.showToast({
              title: '最长允许120s',
              image : "../../images/fail.png",
              duration : 3000
            })
          }else {
            that.publish(res.tempFilePath, 1, res.duration, res.height, res.width);
          }
        },
        // complete : function() {
        //   wx.hideLoading();
        // }
      })
    } else if (id == 3) {
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          var tempFilePath = res.tempFilePaths[0];
          wx.getImageInfo({
            src: tempFilePath,
            success : function(result) {
              console.log(result.type)
              that.publish(tempFilePath, 0, -1, result.height, result.width);
            }
          })
        }
      })
    } else if (id == 4) {
      wx.showToast({
        title: '请耐心等待',
        icon:"none",
      })
    }
  },

  publish: function (src, type, duration, height, width) {
    wx.navigateTo({
      url: '../publish/publish?src=' + src + "&duration=" + duration + "&height=" + height + "&width=" + width + "&type=" + type,
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