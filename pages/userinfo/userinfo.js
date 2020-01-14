// pages/userinfo/userinfo.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo : null,
    currentPage : 1,
    pageSize : 10,
    proinfo : null,
    preplay: "",// 上一个播放视频的ID
    pageCount: 0,
    isBottom : false,
    uid : -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var uid = options.uid;
    this.setData({
      uid : uid
    })

    // console.log(options)
    var token = wx.getStorageSync("accessToken").token

    this.loaduserinfo(uid, token)

    var currentPage = this.data.currentPage
    var pageSize = this.data.pageSize

    this.loadproinfo(uid, token, currentPage, pageSize)
  },

// 加载用户信息
  loaduserinfo : function (uid, token) {

    var that = this;   
    
    wx.request({
      url: app.api.user.userinfo + "/" + uid,
      method : "GET",
      data : {
        token : token,
      },
      success : function(res) {
        if(res.data.status == 200) {
          that.setData({
            userinfo : res.data.data
          })

          wx.setNavigationBarTitle({
            title: res.data.data.userinfo.nick,
          })
        }else {
          wx.showToast({
            title: '请求失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  goProductionPage: function (e) {
    var pid = e.currentTarget.dataset.pid;
    wx.navigateTo({
      url: '../video/video?pid=' + pid,
    })
  },

  download : function (e) {

    // 判断当前作品  视频/图片
    // 根据作品类别分别做处理

    wx.showActionSheet({
      itemList: ['下载视频'],
      success(res) {
        console.log(res.tapIndex)
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },

// 加载作品信息
  loadproinfo: function (uid, token, currentPage, pageSize) {
    var that = this;
    
    wx.request({
      url: app.api.user.proinfo + "/" + uid,
      method : "GET",
      data : {
        token : token,
        pageSize: pageSize,
        currentPage: currentPage
      },
      success : function (res) {
        if (res.data.status == 200) {
          if (currentPage == 1) {
            that.setData({
              proinfo: res.data.data,
              currentPage: res.data.data.currentPage,
              pageSize: res.data.data.pageSize,
              pageCount: res.data.data.pageCount,
            })
          } else {
            var proinfo = that.data.proinfo
            var newobj = JSON.parse(JSON.stringify(proinfo))
            var arrobj = newobj.recordList
            var arr = res.data.data.recordList
            for (var i = 0; i < arr.length; i++) {
              arrobj.push(arr[i])
            }
            that.setData({
              proinfo: newobj,
              currentPage: res.data.data.currentPage,
              // pageSize: res.data.data.pageSize,
              pageCount: res.data.data.pageCount,
            })
          }
        }
      }
    })
  },

  focus : function (e) {
    var isfocus = e.currentTarget.dataset.isfocus
    var token = wx.getStorageSync("accessToken").token
    var uid = e.currentTarget.dataset.uid

    var userinfo = this.data.userinfo
    // console.log(userinfo)
    userinfo['isFocus'] = !isfocus
    this.setData({
      userinfo : userinfo
    })

    wx.request({
      url: app.api.user.focus + "/" + uid,
      method : "GET",
      data : {
        token : token,
        isFocus : !isfocus
      },
      success : function (res) {
        // console.log(res)
      }
    })
  },

  like: function (e) {
    // console.log(e)
    var pid = e.currentTarget.dataset.pid;
    var islike = e.currentTarget.dataset.islike;
    var index = e.currentTarget.dataset.index;

    // 
    var proinfo = this.data.proinfo;
    var recordList = proinfo.recordList;
    recordList[index].islike = !islike;
    if (islike) {
      recordList[index].likes = recordList[index].likes - 1;
    } else {
      recordList[index].likes = recordList[index].likes + 1;
    }

    this.setData({
      proinfo: proinfo
    })

    var token = wx.getStorageSync("accessToken").token
    wx.request({
      url: app.api.like + "/" + pid,
      method: "GET",
      data: {
        token: token,
        islike: !islike
      }
    })

    // console.log(index)
  },

  // 收藏
  collect: function (e) {
    var pid = e.currentTarget.dataset.pid;
    var collect = e.currentTarget.dataset.iscollect;
    var index = e.currentTarget.dataset.index;
    var token = wx.getStorageSync("accessToken").token

    // console.log(collect)

    var proinfo = this.data.proinfo;
    var recordList = proinfo.recordList;
    recordList[index].collect = !collect;

    this.setData({
      proinfo: proinfo
    })

    wx.request({
      url: app.api.collect + "/" + pid,
      method: "GET",
      data: {
        token: token,
        iscollect: !collect
      },
    })
  },

// 视频播放时触发
  videoPlay: function (e) {
    var id = e.currentTarget.id
    var context = wx.createVideoContext(id)
    var preplay = this.data.preplay
    if (preplay == "" || preplay == id) {
      // 播放第一个视频
      this.setData({
        preplay: id
      })
    } else {
      // 已经存在视频播放
      // 暂停上一个视频的播放
      var pre = wx.createVideoContext(preplay)
      pre.pause();
      this.setData({
        preplay: id
      })
    }
    // console.log(context)
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
    // var currentPage = this.data.currentPage
    // var pageCount = this.data.pageCount
    // var pageSize = this.data.pageSize
    // if (currentPage == pageCount) {
    //   this.setData({
    //     isBottom: true
    //   })
    //   return;
    // }

    // var uid = this.data.uid
    // var token = wx.getStorageSync("accessToken").token

    // this.loadproinfo(uid, token, currentPage + 1, pageSize)
  },

  bindscrolltolower : function(e) {
    var currentPage = this.data.currentPage
    var pageCount = this.data.pageCount
    var pageSize = this.data.pageSize
    if (currentPage == pageCount) {
      this.setData({
        isBottom: true
      })
      return;
    }

    var uid = this.data.uid
    var token = wx.getStorageSync("accessToken").token

    this.loadproinfo(uid, token, currentPage + 1, pageSize)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})