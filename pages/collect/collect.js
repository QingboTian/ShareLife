// pages/collect/collect.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collects : [
    ],
    currentPage: 1,
    pageSize: 5,
    productions: {},
    isBottom: false,
    pageCount: 0,
    load: false,
    preplay: ""// 上一个播放视频的ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '收藏',
    })

    var currentPage = this.data.currentPage;
    var pageSize = this.data.pageSize;
    this.loadInfo(currentPage, pageSize);
  },

  goProductionPage: function (e) {
    var pid = e.currentTarget.dataset.pid;
    wx.navigateTo({
      url: '../video/video?pid=' + pid,
    })
  },

  // 点赞
  like: function (e) {
    // console.log(e)
    var pid = e.currentTarget.dataset.pid;
    var islike = e.currentTarget.dataset.islike;
    var index = e.currentTarget.dataset.index;

    // 
    var productions = this.data.productions;
    var recordList = productions.recordList;
    recordList[index].islike = !islike;
    if (islike) {
      recordList[index].likes = recordList[index].likes - 1;
    } else {
      recordList[index].likes = recordList[index].likes + 1;
    }

    this.setData({
      productions: productions
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

    var productions = this.data.productions;
    var recordList = productions.recordList;
    recordList[index].collect = !collect;

    this.setData({
      productions: productions
    })

    wx.request({
      url: app.api.collect + "/" + pid,
      method: "GET",
      data: {
        token: token,
        iscollect: !collect
      },
      // success:function(res) {
      //   console.log(res)
      // }
    })

    // console.log(e)
  },


  loadInfo: function (currentPage, pageSize) {
    // debugger
    var token = wx.getStorageSync("accessToken").token;
    var that = this;

    this.setData({
      load: true
    })

    wx.request({
      url: app.api.userCollect,
      method: "GET",
      data: {
        currentPage: currentPage,
        pageSize: pageSize,
        token: token
      },
      success: function (res) {
        if (res.data.status == 200) {
          that.setData({
            load: false
          })

          if (currentPage == 1) {
            that.setData({
              productions: res.data.data,
              // pageSize: res.data.data.pageSize,
              currentPage: res.data.data.currentPage,
              pageCount: res.data.data.pageCount,
            })
          } else {
            // 数据追加
            // 获取之前数据
            var productions = that.data.productions
            var newpro = JSON.parse(JSON.stringify(productions))
            var arrobj = newpro.recordList
            var arr = res.data.data.recordList
            for (var i = 0; i < arr.length; i++) {
              arrobj.push(arr[i])
            }
            that.setData({
              productions: newpro,
              // pageSize: res.data.data.pageSize,
              currentPage: res.data.data.currentPage,
              pageCount: res.data.data.pageCount,
            })
          }

        }
      }
    })
  },

  // 跳转到用户页面
  tapHandler: function (e) {
    var uid = e.currentTarget.dataset.uid
    wx.navigateTo({
      url: '../userinfo/userinfo?uid=' + uid,
    })
  },

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
    var pageCount = this.data.pageCount;
    var currentPage = this.data.currentPage;
    var pageSize = this.data.pageSize;
    // console.log(pageCount)
    // console.log(currentPage)
    // console.log(pageSize)

    if (pageCount == currentPage) {
      // 最后一页
      this.setData({
        isBottom: true
      })
      return;
    }
    // console.log("分页加载")
    this.loadInfo(currentPage + 1, pageSize);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})