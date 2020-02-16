const server = "http://127.0.0.1:8080"

//app.js
App({

  api: {
    me: {
      // 我的栏 功能区
      gongneng: server + "/api/shortvideo/me/op",
      slide: server + "/api/shortvideo/me/slide"
    },
    login: server + "/api/shortvideo/login/auto",
    regist : {
      // 获取短信验证码
      msgcode: server + "/api/shortvideo/regist/messagecode",
      // 用户注册
      regist: server + "/api/shortvideo/regist"
    },
    userUpdate: server + "/api/shortvideo/user",
    userFans: server + "/api/shortvideo/user/fans",
    userComment: server + "/api/shortvideo/user/comment",
    userCollect: server + "/api/shortvideo/user/collect",
    userFocusUser: server + "/api/shortvideo/user/focus/user",
    isFocus: server + "/api/shortvideo/user/isFocus",// 判断当前用户是否关注
    userFocusExplore: server + "/api/shortvideo/user/focus/explore",
    userLikeComment: server + "/api/shortvideo/user/like/comment",
    userLikeProduction: server + "/api/shortvideo/user/like/production",
    // 用户头像上传更新
    userupload: server + "/api/shortvideo/user/upload",
    explore: server + "/api/shortvideo/explore",
    explore_focus: server + "/api/shortvideo/explore/focus",
    visitExplore: server + "/api/shortvideo/explore/visit",
    like: server + "/api/shortvideo/production/like",
    collect: server + "/api/shortvideo/production/collect",
    commentShow: server + "/api/shortvideo/production/commentShow",
    comment: server + "/api/shortvideo/production/comment",
    commentLike: server + "/api/shortvideo/production/comment/like",
    // 用户主页
    user : {
      userinfo: server + "/api/shortvideo/production/user",
      // 作品信息
      proinfo: server + "/api/shortvideo/production/userinfo",
      focus: server + "/api/shortvideo/production/focus",
    },
    index: server + "/api/shortvideo/production",
    // 敏感词检测
    contentSecurity: server + "/api/shortvideo/contentSecurity/text",
    imgSecurity: server + "/api/shortvideo/contentSecurity/img",
    productionUpload: server + "/api/shortvideo/production/wx/upload",
    productionUploadPoster: server + "/api/shortvideo/production/wx/upload/poster",
  },

  onLaunch: function (options) {
    // console.log(options.scene)

    // 这里获取进入小程序的场景值
    // 若点击分享卡片 先获取场景值
    // 如果是已经注册了的用户 在自动登录方法执行成功之后跳转到作品详细页面
    // this.setData({
    //   scene: options.scene 
    // })
    this.globalData.scene = options.scene
    console.log(this.globalData.scene)
    this.update();

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

  // 敏感词检测
  // 第二个参数为若检测成功后应该做的事件
  contentSecurity: function (content, handler) {
    wx.showLoading({
      title: '内容安全检测中...',
    })
    wx.request({
      url: this.api.contentSecurity,
      method : "GET",
      data : {
        content : content
      },
      success : function(res) {
        // wx.hideLoading();
        if (res.data.status == 87014){
          wx.showToast({
            title: '内容存在敏感词汇',
            icon : "none"
          })
        } else if (res.data.status == 0){
          handler();
        } else {
          wx.showToast({
            title: '服务器错误',
            icon: "none"
          })
        }
      }, 
      // complete : function() {
      //   wx.hideLoading();
      // }

    })
  },

  // 小程序更新
  update(){
    console.log("判断版本进行更新");
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        console.log('onCheckForUpdate====', res)
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          console.log('res.hasUpdate====')
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                console.log('success====', res)
                // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '溫馨提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

  // 图像安全检测
  // 应该在服务端调用
  imgSecurity:function(file, handler) {
    wx.showLoading({
      title: '内容安全检测中...',
    })
    wx.uploadFile({
      url: this.api.imgSecurity,
      filePath: file,
      name: "file",
      header: {
        "Content-Type": "multipart/form-data"
      },
      success: function (res) {
        // console.log(res)
        var temp = JSON.parse(res.data);
        if (temp.errcode == 0) {
          handler();
          // wx.showToast({
          //   title: '正常',
          //   icon: "none"
          // })
        } else if (temp.errcode == 87014) {
          wx.showToast({
            title: '图片含有违规内容',
            icon: "none"
          })
        } else {
          wx.showToast({
            title: '服务器错误',
            icon: "none"
          })
        }
      }})
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
    scene : null,
    production : null
  }
})