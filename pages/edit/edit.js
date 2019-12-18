// 引入util(获取系统时间))
var util = require('../../utils/util.js');
// 经纬度逆解析
var bmap = require('../../libs/bmap-wx.min.js');
const app = getApp();
var wxMarkerData = []; 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type : 7,
    titles: ["昵称", "个性签名", "手机", "邮箱", "性别", "生日", "地区"],
    nickWordLength : 0,
    nickname : "bobo",
    signatureWordLength : 0,
    signature : "心若向阳，无畏悲伤！",
    checkBtnAble : false,
    checkNumStr: "发送验证码",
    phone : "13888888888",
    mailBefore : "",
    mailLater : "",
    index : 1,
    array : ["火星人","男","女"],
    date : "",
    region: ["陕西省","榆林市","定边县"],
    customItem: '全部',
    currentLocation : "",
    locationFlag : true // 显示选择该地址
  },

  // 性别 生日 地区picker改变值时触发的函数
  bindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    var data = {}
    data[e.currentTarget.dataset.type] = e.detail.value
    this.setData(data)
  },

  // 定位当前位置
  switchLocation : function (e) {
    var that = this

    var BMap = new bmap.BMapWX({
      ak: '7BHF4lj5zmEioDs9pSgTpoa0G7I6Bjoy' // 百度API AK
    })

    var fail = function (res) {
      that.setData({
        currentLocation: "遇到了一个错误,请检查网络是否连接",
        locationFlag : false
      })
    }

    BMap.regeocoding({
      fail: fail,
      success: function (res) {
        // console.log(res.originalData.result.addressComponent)
        var province = res.originalData.result.addressComponent.province
        var city = res.originalData.result.addressComponent.city
        var district = res.originalData.result.addressComponent.district // 区

        // 检查当前的region是否有值
        var region = that.data.region
        if (region.length > 0) {
          // region存在值
        }else {
          // 不存在值
          region.push(province)
          region.push(city)
          region.push(district)
        }

        that.setData({
          currentLocation: province + "-" + city + "-" + district,
          region: region // 这里应该获取的是用户的地区信息 若没有地区信息，应该设置为当前位置
        })
      }
    });

    // var that = this
    // wx.getLocation({
    //   success: function(res) {
    //     console.log(res)
    //     that.parse()
    //   },
    // })
  },

  // 选择该地址
  chooseLocation: function (e) {
    // console.log(this.data.currentLocation)
    var currentLocation = this.data.currentLocation
    var locations = currentLocation.split("-")
    // 将当前位置信息设置为地区信息
    // console.log(locations)
    this.setData({
      region : locations
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var type = options.type

    // console.log(options.type)
    this.setData({
      type: type
    })

    // 设置标题
    var title = this.data.titles[type - 1]
    wx.setNavigationBarTitle({
      title: '修改' + title,
    })

    // 设置字符长度
    var length1 = this.data.nickname.trim().length
    var length2 = this.data.signature.trim().length
    this.setData({
      nickWordLength: length1,
      signatureWordLength: length2
    })

    if (type == 6){
      // 获取当前日期
      var datetime = util.formatTime(new Date());
      var str = datetime.split(" ")
      var date = str[0]
      date = date.replace("/", "-")
      date = date.replace("/", "-")
      this.setData({
        date: date
      })
    }

    if(type == 7) {
      // 获取位置
      this.switchLocation()
    }
  },

  // 判断字符长度
  wordLength : function(e) {
    
    // 这里应该进行非法字符判断
    // ...

    var type = e.currentTarget.dataset.type
    var data = {}
    var inputValue = e.detail.value.trim()
    var length = inputValue.length
    data[type] = length

    this.setData(data)
  },

  // 发送验证码按钮进行刷新
  sendCheckNum : function(e) {

    // 此处调用真正的发短信接口
    // ...

    // 设置不可用
    this.setData({
      checkBtnAble: true
    })
    var that = this

    var seconds = 60// 60s
    var intervalID = setInterval(function(){
      that.setData({
        checkNumStr : --seconds + 's'
      })
      // 到时按钮可用
      if (seconds == 0) {
        that.setData({
          checkBtnAble: false,
          checkNumStr:  "发送验证码"
        })
        clearInterval(intervalID)// 清除计时器
      }
    },1000)// 每隔1s进行刷新
  },

  // 点击保存按钮
  save : function (e) {
    // 具体的数据处理策略 这里进行
    // ...
    // 判断当前要修改的是什么数据
    // // 1 昵称 2 个性签名 3 手机 4 邮箱 5 性别 6 生日 7 地区
    var type = this.data.type
    var value = ""

    // 更新本地缓存信息
    var accessToken = wx.getStorageSync("accessToken");
    var userinfo = accessToken.userinfo;
    console.log(userinfo)
    if (type == 1) {
      userinfo["nick"] = this.data.nickname;
      console.log(this.data.nickname)
    }
    
    console.log(userinfo)

    // 将修改后的信息重新放入缓存中
    accessToken.userinfo = userinfo
    wx.setStorageSync("accessToken", accessToken);

    // 获取当前token
    var token = accessToken.token
    console.log(token)
    console.log(userinfo)

    wx.request({
      url: app.api.user,
      method : "PUT",
      header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
      data : {
        userInfo: userinfo,
        token : token
      },
      success : function(data) {
        console.log(data)
      }
    })
    // 返回上一页面
    // wx.navigateBack()
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