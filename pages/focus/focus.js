// pages/focus/focus.js


//                    注意：在container中存在监听滑动的操作  子元素的点击事件是catchtap


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
      {
        poster: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/touxiang.jpg",// 头像
        name : "啵啵",// 名称
        signature: "心若向阳，无畏悲伤",// 签名
        isFocus: 1 // 是否关注
      },
      {
        poster: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/touxiang.jpg",// 头像
        name: "啵啵",// 名称
        signature: "心若向阳，无畏悲伤",// 签名
        isFocus: 1 // 是否关注
      },
      {
        poster: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/touxiang.jpg",// 头像
        name: "啵啵",// 名称
        signature: "心若向阳，无畏悲伤",// 签名
        isFocus: 1 // 是否关注
      }
    ], // 关注的人
    focusArea:[
      {
        poster: "../../images/beauty.png",
        name : "美女专区",
        desc : "美女专区的描述",
        isFocus: 1
      },
      {
        poster: "../../images/beauty.png",
        name: "美女专区",
        desc: "美女专区的描述",
        isFocus: 1
      },
      {
        poster: "../../images/beauty.png",
        name: "美女专区",
        desc: "美女专区的描述",
        isFocus: 1
      }
    ] // 关注的专区
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
    }else {
      // 关注的专区
      this.setData({
        showFlag: false,
        isChoose: false
      })
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
    } else if (currentX - touchDotX > 50){
      // 切换为关注的人
      this.setData({
        showFlag: true,
        isChoose: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '关注',
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