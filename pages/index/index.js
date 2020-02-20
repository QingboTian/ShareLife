//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    currentPage : 1,
    pageSize : 10,
    pageCount : 0,
    images: [// 准备展示的作品
      
    ],
    leftShowImages: [],// 左边已经展示的作品
    rightShowImages: [],// 右边已经展示的作品
    leftHeight: 0,
    rightHeight: 0,
    load: false,
    isBottom: false,
    index: 0,// 已经加载作品的索引
    // production : {}
  },

  onLoad(options) {
    console.log(options)
    // 若是点击分享卡片进来的则将作品参数信息保存下来
    // var shareProduction = wx.getStorageSync("shareProduction");
    if (app.globalData.scene != null && app.globalData.production == null) {
      var production = {
        type: options.type,
        pid: options.pid,
        uid: options.uid
      }
      // this.setData({
      //   production: production
      // })
      app.globalData.production = production;
      // wx.setStorageSync("shareProduction", production)
    }
    // wx.getUserInfo({
    //   success: function (res) {

    //     console.log(res);
    //     // that.data.userInfo = res.userInfo;

    //     // that.setData({
    //     //   userInfo: that.data.userInfo
    //     // })
    //   }
    // })
    // 首先在缓存中查询是否存在用户信息
    this.preLogin(this)
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    
  },

  preLogin: function (that) {
    var accesstoken = wx.getStorageSync("accessToken")
    var timestamp = Date.parse(new Date());// 获取当前时间的时间戳与expired进行比较
    var flag = true;
    if (timestamp > accesstoken.expires) {
      flag = false;// token 过期
    }

    var tempflag = accesstoken && flag;
    tempflag || this.login(that)
    
    if (tempflag) {// 从注册页面跳转过来执行的动作----（已经登录，缓存中存在用户信息）
      // console.log("regist")
      that.loginback();
    }
    
  },

  login: function (that) {
    console.log("没有缓存或缓存过期，正在登录")
    // 登录
    wx.login({
      success: res => {


        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res)
        // console.log(this.globalData.userInfo)
        wx.request({
          url: app.api.login + "/" + res.code,
          success: function (data) {
            // 检查status状态
            // 500服务器错误 403用户不存在（跳转到登陆页面进行注册及登录）
            console.log(data.data)
            var status = data.data.status;
            if (status == 500 || status == 403) {
              wx.redirectTo({
                url: '../regist/regist',
              })
              return false;
            }else {// 执行成功(登录成功之后再做的事情)
              console.log("login")
              
              var accesstoken = data.data.data;
              wx.setStorageSync("accessToken", accesstoken);
              that.loginback(that);
              // console.log(data.data.data)
              app.globalData.accesstoken = data.data.data;
              
              
              
              // that.setOpenIdStorageSync("accessToken", accesstoken)
            }
          }
        })
      }
    })
  },

  loadProductions : function(currentPage, pageSize){
    var token = wx.getStorageSync("accessToken").token;
    var that = this;
    this.setData({
      load : true
    })
    // wx.showLoading({
    //   title: '加载中',
    // })
    wx.request({
      url: app.api.index,
      method : "GET",
      data : {
        token : token,
        currentPage : currentPage,
        pageSize : pageSize
      },
      success : function(res) {
        if (res.data.status == 200) {
          that.setData({
            load : false
          })
          var data = res.data.data;
          // console.log(data)
          that.setData({
            images : data.recordList,
            pageCount: data.pageCount,
            currentPage: data.currentPage,
            index : 0// 将索引置为0
          })

          var length = that.data.images.length;

          for (var i = 0; i < length; i++) {
            that.loadImage(that);
          }
        }
      },
      // complete(){
      //   wx.hideLoading();
      // }
    })
  },

  // 登录成功后做的动作
  loginback : function(that) {
    this.setData({
      search: this.search.bind(this)
    })

    // 获取场景值
    console.log(app.globalData.scene) 
    var scene = app.globalData.scene;
    if (scene == 1007 || scene == 1008) {
      // 跳转到作品页面
      var type = app.globalData.production.type;
      var pid = app.globalData.production.pid;
      var uid = app.globalData.production.uid;
      console.log(app.globalData.production)
      wx.navigateTo({
        url: '../video/video?type=' + type + "&pid=" + pid + "&uid=" + uid,
      })
    }

    // 加载作品资源
    var currentPage = this.data.currentPage;
    var pageSize = this.data.pageSize;
    this.loadProductions(currentPage, pageSize);
    // console.log(1)

    wx.setNavigationBarTitle({
      title: '短视频',
    })

    // wx.hideShareMenu()
  },


  setOpenIdStorageSync: function (key, value) {
    wx.setStorageSync(key, value);
  },

  search: function (value) {
    if (value.trim() == "") {
      return new Promise((resolve, reject) => {
      })
    }
    console.log(value)// value是要查询的文本
    return new Promise((resolve, reject) => {
      var res = this.loadSearch(value.trim());
      resolve(res)
    })
  },
  selectResult: function (e) {
    console.log('select result', e.detail)
  },

  loadSearch(value){
    // console.log(resolve)
    var token = wx.getStorageSync("accessToken").token;
    wx.request({
      url: app.api.search,
      data : {
        token : token,
        text : value,
        currentPage : 1,
        pageSize : 10
      },
      success:(res) => {
        // console.log(res)
        // resolve(res.data.recordList)
        // console.log(resolve)
        // console.log(res)
        // return res.data.recordList;
      }
    })
  },

  // 更新版本（可根据容器中图片的实时高度（模拟）进行图片的添加）
  loadImage: function (that) {

    var leftHeight = this.data.leftHeight// 左容器高度
    var rightHeight = this.data.rightHeight// 右容器高度
    var index = this.data.index// 加载图片的索引
    var images = this.data.images// 总共要加载的图片

    // 这个值在不同的手机中是不同的，但是不影响整体的效果，因为最终的高度是按照每张图片的
    // 长宽比进行计算，虽然不是容器的实时高度，但是左右容器高度的大小关系是可以计算出来的
    var widthFix = 201;// 左（右）容器中图片的固定宽度（iPhone6P）

    var min = Math.min(leftHeight, rightHeight)// 计算左右容器高度的最小值
    // 添加要新加载的图
    if (min == leftHeight) {
      var leftShowImages = this.data.leftShowImages
      leftShowImages.push(images[index])
      that.setData({
        leftShowImages: leftShowImages
      })

      // 计算当前容器内图片的高度
      var currHeight = (widthFix * images[index].height) / images[index].width
      // 获取图片高度
      leftHeight += currHeight

      // console.log("左高度" + leftHeight)

    } else {
      var rightShowImages = this.data.rightShowImages
      rightShowImages.push(images[index])
      that.setData({
        rightShowImages: rightShowImages
      })

      // 按照长宽比计算的容器中图片应该的高
      var currHeight = (widthFix * images[index].height) / images[index].width
      // 获取图片高度
      rightHeight += currHeight

      // console.log("右高度" + rightHeight)

    }

    // 索引加1
    index++;
    that.setData({
      index: index,
      leftHeight: leftHeight,
      rightHeight: rightHeight
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    var pageCount = this.data.pageCount;
    var currentPage = this.data.currentPage;
    var pageSize = this.data.pageSize;
    if (pageCount == currentPage){
      this.setData({
        isBottom: true
      })
      return;
    }

    this.loadProductions(currentPage + 1, pageSize)

    // this.setData({
    //   index: 0
    // })

    // var length = this.data.images.length
    // for (var i = 0; i < length; i++) {
    //   this.loadImage(this)
    // }
  },

  // 下拉刷新页面
  onPullDownRefresh: function (){
    var pageSize = this.data.pageSize;
    this.setData({
      currentPage: 1,
      pageSize: 10,
      pageCount: 0,
      images: [// 准备展示的作品

      ],
      leftShowImages: [],// 左边已经展示的作品
      rightShowImages: [],// 右边已经展示的作品
      leftHeight: 0,
      rightHeight: 0,
      load: false,
      isBottom: false,
      index: 0// 已经加载作品的索引
    })
    this.loadProductions(1, pageSize);
  },

// 跳转到作品页面
  tapHandler : function (e) {

    var type = e.currentTarget.dataset.type;
    var pid = e.currentTarget.dataset.pid;
    var uid = e.currentTarget.dataset.uid;
    // console.log(e)

    wx.navigateTo({
      url: '../video/video?type=' + type + "&pid=" + pid + "&uid=" + uid,
    })
  }
})
