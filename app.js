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
  },

  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 首先在缓存中查询是否存在用户信息

    var accesstoken = wx.getStorageSync("accessToken")
    var timestamp = Date.parse(new Date());// 获取当前时间的时间戳与expired进行比较
    var flag = true;
    if (timestamp > accesstoken.expires){
      flag = false;// token 过期
    }
    (accesstoken && flag) || this.login(this)

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

              this.globalData.userInfo = res.userInfo

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

  login : function(that) {
    console.log("没有缓存或缓存过期，正在登录")
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res)
        // console.log(this.globalData.userInfo)
        wx.request({
          url: that.api.login + "/" + res.code,
          success : function (data) {

            // 检查status状态
            // 500服务器错误 403用户不存在（跳转到登陆页面进行注册及登录）
            console.log(data.data)
            var status = data.data.status;
            if (status == 500 || status == 403){
              wx.redirectTo({
                url: '../login/login',
              })
              return;
            }
            
            // console.log(data.data.data)
            that.globalData.accesstoken = data.data.data;
            // console.log(that.globalData.userInfo)
            var accesstoken = that.globalData.accesstoken;
            // that.globalData.userInfo = accesstoken.data.userinfo;
            // 将用户信息添加到缓存信息中
            // 保存时长为30分钟
            that.setOpenIdStorageSync("accessToken", accesstoken)
          }
        })
      }
    })
  },

  
  setOpenIdStorageSync : function (key,value) {
    wx.setStorageSync(key, value);
  },

  globalData: {
    // userInfo: null,
    accesstoken : null,
  }
})