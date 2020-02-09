// pages/focus/focus.js


//                    注意：在container中存在监听滑动的操作  子元素的点击事件是catchtap
const app = getApp();

let touchDotX = 0;//X按下时坐标
let touchDotY = 0;//y按下时坐标

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showFlag: true,// 内容区是否显示
    isChoose: true,// 是否选择当前标签栏
    // 以上两栏默认显示关注的人 即true为关注的人

    focusPeople: [
      
    ], // 关注的人
    focusArea:[
      
    ], // 关注的专区
    isShow:false
  },

  // 点击切换标签
  switchTabHandler: function(e) {
    // console.log(e)
    var id = e.currentTarget.dataset.id
    if (id == 0){ // 关注的人
      this.setData({
        showFlag : true,
        isChoose: true
      })
      if (this.data.focusPeople.length == 0) {
        this.setData({
          isShow : true
        })
      }else {
        this.setData({
          isShow: false
        })
      }
    }else {
      // 关注的专区
      this.setData({
        showFlag: false,
        isChoose: false
      })

      if (this.data.focusArea.length == 0) {
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
  touchStartHandler: function(e) {
    // console.log(e)
    touchDotX = e.touches[0].pageX; // 获取触摸时的原点
    touchDotY = e.touches[0].pageY;
  },
  // 滑动结束
  touchEndHandler: function(e) {
    var currentX = e.changedTouches[0].pageX
    var currentY = e.changedTouches[0].pageY
    // console.log(currentX - touchDotX)
    // console.log(currentY - touchDotY)

    // 如果y轴变化的绝对值大于30 认为是上下滑动
    var y = Math.abs(currentY - touchDotY)
    var x = currentX - touchDotX
    if (y > 30 || x == 0){
      return
    }

    // 检查滑动的距离 x轴大于50 则进行切换
    if (currentX - touchDotX < -50) {
      // 切换为专区
      this.setData({
        showFlag: false,
        isChoose: false
      })
      if (this.data.focusArea.length == 0) {
        this.setData({
          isShow: true
        })
      } else {
        this.setData({
          isShow: false
        })
      }
    } else if (currentX - touchDotX > 50){
      // 切换为关注的人
      this.setData({
        showFlag: true,
        isChoose: true
      })
      if (this.data.focusPeople.length == 0) {
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '关注',
    })

    var token = wx.getStorageSync("accessToken").token;
    this.loadExplore(token);
    this.loadUser(token);
  },

  // 加载关注的人
  loadUser : function(token) {
    var that = this;
    wx.request({
      url: app.api.userFocusUser,
      method : "GET",
      data : {
        token ,token
      },
      success : function(res) {
        if (res.data.status == 200) {
          // console.log(res)
          var data = res.data.data;
          if (data.length == 0) {
            that.setData({
              isShow : true
            })
          }
          for (var i = 0; i < data.length; i++) {
            var temp = data[i];
            temp['isFocus'] = true;
            data[i] = temp;
          }
          console.log(data)
          that.setData({
            focusPeople : data
          })
        }
      }
    })
  },

  loadExplore : function(token) {
    var that = this;
    wx.request({
      url: app.api.userFocusExplore,
      method: "GET",
      data: {
        token, token
      },
      success: function (res) {
        if (res.data.status == 200) {
          var data = res.data.data;
          for (var i = 0; i < data.length; i++) {
            var temp = data[i];
            temp['isFocus'] = true;
            data[i] = temp;
          }
          that.setData({
            focusArea: data
          })
        }
      }
    })
  },

  goExplorePage : function(e){
    var eid = e.currentTarget.dataset.eid;
    wx.navigateTo({
      url: '../classify/classify?id=' + eid,
    })
  },

  goUserPage : function(e) {
    var uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '../userinfo/userinfo?uid=' + uid,
    })
  },

  userFocus: function (e) {
    var isfocus = e.currentTarget.dataset.isfocus
    var token = wx.getStorageSync("accessToken").token
    var uid = e.currentTarget.dataset.uid
    var index = e.currentTarget.dataset.index

    var focusPeople = this.data.focusPeople
    var temp = focusPeople[index]
    temp['isFocus'] = !isfocus
    focusPeople[index] = temp
    // console.log(userinfo)
    // focusPeople['isFocus'] = !isfocus
    this.setData({
      focusPeople: focusPeople
    })

    wx.request({
      url: app.api.user.focus + "/" + uid,
      method: "GET",
      data: {
        token: token,
        isFocus: !isfocus
      },
    })
  },

  exploreFocus: function (e) {
    // console.log(e)
    var eid = e.target.dataset.eid
    // console.log(id)
    var isFocus = e.target.dataset.isfocus
    // console.log(isFocus)
    // 获取token

    var index = e.currentTarget.dataset.index;
    var focusArea = this.data.focusArea;
    var temp = focusArea[index];
    temp['isFocus'] = !isFocus;
    focusArea[index] = temp;
    this.setData({
      focusArea: focusArea
    })

    var accessToken = wx.getStorageSync("accessToken")
    var token = accessToken.token
    var that = this
    wx.request({
      url: app.api.explore_focus,
      method: "PUT",
      header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
      data: {
        isFocus: !isFocus,
        eid: eid,
        token: token
      },
      success: function (res) {
        if (res.data.status == 200) {
          // console.log(res)
          wx.setStorageSync("explore", res.data.data)
        }
      }
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