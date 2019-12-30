// pages/classify/classify.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type : 0,
    explore : {},
    isFocus : false,
    currentPage : 1,
    pageSize : 10,
    productions : {},// 分区具体的作品
    visitnum : 0,
    eid : -1,// 专区ID
    isBottom : false,
    pageCount : 0,
    load : false,
    preplay : ""// 上一个播放视频的ID
  }, 

  tapHandler : function (e) {
    var uid = e.currentTarget.dataset.uid
    wx.navigateTo({
      url: '../userinfo/userinfo?uid=' + uid,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.setData({
      eid : id
    })
    // 从缓存中取专区信息
    var explore = wx.getStorageSync("explore");
    for (var i = 0; i < explore.length; i++) {
      if (explore[i].explore.id == id){
        this.setData({
          explore: explore[i].explore,
          isFocus: explore[i].isFocus,
          visitnum: explore[i].explore.visitnum
        })
        break;
      }
    }
    // console.log(options)
    // 加载专区内容
    var currentPage = this.data.currentPage;
    var pageSize = this.data.pageSize;
    this.loadExplore(id, currentPage, pageSize);
  },

  loadExplore: function (id, currentPage, pageSize) {
    // debugger
    var token = wx.getStorageSync("accessToken").token;
    var that = this;

    this.setData({
      load : true
    })

    wx.request({
      url: app.api.explore + "/" + id,
      method:"GET",
      data : {
        currentPage: currentPage,
        pageSize: pageSize,
        token : token
      },
      success : function(res){
        if (res.data.status == 200) {
          that.setData({
            load : false
          })

          if (currentPage == 1) {
            that.setData({
              productions: res.data.data,
              // pageSize: res.data.data.pageSize,
              currentPage: res.data.data.currentPage,
              pageCount: res.data.data.pageCount,
            })
          }else {
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

  focus: function (e) {
    // console.log(e)
    var id = this.data.eid
    // console.log(id)
    var isFocus = e.target.dataset.isfocus
    // console.log(isFocus)
    // 获取token
    var accessToken = wx.getStorageSync("accessToken")
    var token = accessToken.token
    var that = this
    wx.request({
      url: app.api.explore_focus,
      method: "PUT",
      header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
      data: {
        isFocus: !isFocus,
        eid: id,
        token: token
      },
      success: function (res) {
        if (res.data.status == 200) {
          // console.log(res)
          wx.setStorageSync("explore", res.data.data)
          that.setData({
            isFocus: !isFocus
          })
        }
      }
    })
    // console.log(e)
  },

  // 点赞
  like : function (e) {
    // console.log(e)
    var pid = e.currentTarget.dataset.pid;
    var islike = e.currentTarget.dataset.islike;
    var index = e.currentTarget.dataset.index;

    // 
    var productions = this.data.productions;
    var recordList = productions.recordList;
    recordList[index].islike = !islike;
    if (islike){
      recordList[index].likes = recordList[index].likes - 1;
    }else {
      recordList[index].likes = recordList[index].likes + 1;
    }

    this.setData({
      productions: productions
    })

    var token = wx.getStorageSync("accessToken").token
    wx.request({
      url: app.api.like + "/" + pid,
      method : "GET",
      data : {
        token : token,
        islike: !islike
      }
    })

    // console.log(index)
  },

  // 收藏
  collect : function(e) {
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

  videoPlay : function(e) {
    var id = e.currentTarget.id
    var context = wx.createVideoContext(id)
    var preplay = this.data.preplay
    if (preplay == "") {
      // 播放第一个视频
      this.setData({
        preplay : id
      })
    }else {
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
    var eid = this.data.eid;
    this.loadExplore(eid, currentPage + 1, pageSize);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})