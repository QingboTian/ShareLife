// pages/comment/comment.js
let touchDotX = 0;//X按下时坐标
let touchDotY = 0;//y按下时坐标

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isChoose : true,
    showFlag : true,
    other2me : [
      {
        poster: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/touxiang.jpg",
        name : "用户1",
        content : "作者每次发的作品真是太好了！！！",
        src: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/2.jpg",// 作品封面图
      },
      {
        poster: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/touxiang.jpg",
        name: "用户2",
        content: "作者每次发的作品真是太好了！！！",
        src: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/2.jpg",// 作品封面图
      },
      {
        poster: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/touxiang.jpg",
        name: "用户3",
        content: "作者每次发的作品真是太好了！！！",
        src: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/2.jpg",// 作品封面图
      },
      {
        poster: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/touxiang.jpg",
        name: "用户1",
        content: "作者每次发的作品真是太好了！！！",
        src: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/2.jpg",// 作品封面图
      },
      {
        poster: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/touxiang.jpg",
        name: "用户2",
        content: "作者每次发的作品真是太好了！！！",
        src: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/2.jpg",// 作品封面图
      },
      {
        poster: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/touxiang.jpg",
        name: "用户3",
        content: "作者每次发的作品真是太好了！！！",
        src: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/2.jpg",// 作品封面图
      },
      {
        poster: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/touxiang.jpg",
        name: "用户1",
        content: "作者每次发的作品真是太好了！！！",
        src: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/2.jpg",// 作品封面图
      },
      {
        poster: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/touxiang.jpg",
        name: "用户2",
        content: "作者每次发的作品真是太好了！！！",
        src: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/2.jpg",// 作品封面图
      },
      {
        poster: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/touxiang.jpg",
        name: "用户3",
        content: "作者每次发的作品真是太好了！！！",
        src: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/2.jpg",// 作品封面图
      },
      {
        poster: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/touxiang.jpg",
        name: "用户1",
        content: "作者每次发的作品真是太好了！！！",
        src: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/2.jpg",// 作品封面图
      },
      {
        poster: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/touxiang.jpg",
        name: "用户2",
        content: "作者每次发的作品真是太好了！！！",
        src: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/2.jpg",// 作品封面图
      },
      {
        poster: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/touxiang.jpg",
        name: "用户3",
        content: "作者每次发的作品真是太好了！！！",
        src: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/2.jpg",// 作品封面图
      },
    ],
    me2other: [
      {
        poster: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/touxiang.jpg",
        name: "bobo",
        content: "作品没我的好！！！",
        src: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/3.jpg",// 作品封面图
      },
      {
        poster: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/touxiang.jpg",
        name: "bobo",
        content: "挺棒的！",
        src: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/3.jpg",// 作品封面图
      },
      {
        poster: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/touxiang.jpg",
        name: "bobo",
        content: "继续加油",
        src: "https://share-life-image-1257756319.cos.ap-chengdu.myqcloud.com/dev/3.jpg",// 作品封面图
      },
    ],
  },

  // 点击切换标签
  switchTabHandler: function (e) {
    // console.log(e)
    var id = e.currentTarget.dataset.id
    if (id == 0) { // 关注的人
      this.setData({
        showFlag: true,
        isChoose: true
      })
    } else {
      // 关注的专区
      this.setData({
        showFlag: false,
        isChoose: false
      })
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
      // 切换为专区
      this.setData({
        showFlag: false,
        isChoose: false
      })
    } else if (currentX - touchDotX > 50) {
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
      title: '评论',
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