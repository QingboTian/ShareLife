const server = "http://127.0.0.1:8080"

//app.js
App({

  api: {
    me: {
      // 我的栏 功能区
      gongneng: server + "/api/short_video/me/op",
      slide: server + "/api/short_video/me/slide"
    },
    login: server + "/api/short_video/login/auto",
    regist : {
      // 获取短信验证码
      msgcode: server + "/api/short_video/regist/messagecode",
      // 用户注册
      regist: server + "/api/short_video/regist"
    },
    user: server + "/api/short_video/user"
  },

  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 测试
    // wx.login({
    //   success: res => {
    //     console.log(res)
    //   }
    // }),
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId

              // console.log(res)
              // console.log(this.globalData.userInfo)

              // this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }

        // if (res.authSetting['scope.userLocation']) {
        //   console.log(res)
        // }
      }

      
    })
  },

  gettoken : function () {
    if (this.globalData.accesstoken != null) {// 首先从全局变量取数据
      return this.globalData.accesstoken.token
    }else {// 全局没有从缓存中取
      var accesstoken = wx.getStorageInfoSync("accesstoken");
      return accesstoken.token
    }
  },

  globalData: {
    // userInfo: null,
    accesstoken : null,
  }
})