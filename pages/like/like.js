// pages/like/like.js
let touchDotX = 0;//X按下时坐标
let touchDotY = 0;//y按下时坐标
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isChoose: true,
    showFlag: true,
    likeMeComment: [

    ],
    likeMeProduction: [

    ],
    avatarurl: "",
    nick: "",
    // 是否加载了点赞我的作品数据标志
    flag : false,
    token : "",
    isShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '点赞',
    })

    var token = wx.getStorageSync("accessToken").token;
    this.setData({
      token:token
    })
    this.loadLikeComment(token);
  },

  loadLikeComment : function(token) {
    var that = this;
    wx.showLoading({
      title: '数据加载中...',
    })
    wx.request({
      url: app.api.userLikeComment,
      method : "GET",
      data :{
        token:token
      },
      success : function(res) {
        if (res.data.status == 200) {
          // console.log(res)
          if (res.data.data.length == 0) {
            that.setData({
              isShow:true
            })
          }
          that.setData({
            likeMeComment:res.data.data
          })
        }
      },
      complete : function(){
        wx.hideLoading();
      }
    })
  },

  loadLikeProduction: function (token) {
    var that = this;
    wx.showLoading({
      title: '数据加载中...',
    })
    wx.request({
      url: app.api.userLikeProduction,
      method: "GET",
      data: {
        token: token
      },
      success: function (res) {
        if (res.data.status == 200) {
          that.setData({
            likeMeProduction: res.data.data,
            flag : true
          })
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },



  toProductionPage: function (e) {
    var pid = e.currentTarget.dataset.pid;
    var uid = e.currentTarget.dataset.uid;
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../video/video?pid=' + pid + "&uid=" + uid + "&type=" + type,
    })
  },

  // 点击切换标签
  switchTabHandler: function (e) {
    // console.log(e)
    var id = e.currentTarget.dataset.id
    if (id == 0) { // 点赞我的评论
      this.setData({
        showFlag: true,
        isChoose: true
      })
      if (this.data.likeMeComment.length == 0) {
        this.setData({
          isShow:true
        })
      }else{
        this.setData({
          isShow: false
        })
      }
    } else {
      // 作品
      this.setData({
        showFlag: false,
        isChoose: false
      })
      var flag = this.data.flag;
      // 如果标志位为false 说明数据没有加载
      if (!flag) {
        // console.log("加载")
        var token = this.data.token;
        this.loadLikeProduction(token);
      }
      if (this.data.likeMeProduction.length == 0) {
        this.setData({
          isShow: true
        })
      } else {
        this.setData({
          isShow: false
        })
      }
    }

  },

  // 滑动切换标签
  touchStartHandler: function (e) {
    // console.log(e)
    touchDotX = e.touches[0].pageX; // 获取触摸时的原点
    touchDotY = e.touches[0].pageY;
  },
  // 滑动结束
  touchEndHandler: function (e) {
    var currentX = e.changedTouches[0].pageX
    var currentY = e.changedTouches[0].pageY
    // console.log(currentX - touchDotX)
    // console.log(currentY - touchDotY)

    // 如果y轴变化的绝对值大于30 认为是上下滑动
    var y = Math.abs(currentY - touchDotY)
    var x = currentX - touchDotX
    if (y > 30 || x == 0) {
      return
    }

    // 检查滑动的距离 x轴大于50 则进行切换
    if (currentX - touchDotX < -50) {
      this.setData({
        showFlag: false,
        isChoose: false
      })
      // console.log("作品")
      var flag = this.data.flag;
      // 如果标志位为false 说明数据没有加载
      if (!flag) {
        // console.log("加载")
        var token = this.data.token;
        this.loadLikeProduction(token);
      }
      if (this.data.likeMeProduction.length == 0) {
        this.setData({
          isShow: true
        })
      } else {
        this.setData({
          isShow: false
        })
      }
    } else if (currentX - touchDotX > 50) {
      this.setData({
        showFlag: true,
        isChoose: true
      })
      if (this.data.likeMeComment.length == 0) {
        this.setData({
          isShow: true
        })
      } else {
        this.setData({
          isShow: false
        })
      }
    }
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