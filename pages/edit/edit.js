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
    type : -1,
    titles: ["昵称", "个性签名", "手机", "邮箱", "性别", "生日", "地区"],
    nickWordLength : 0,
    nickname : "",
    signatureWordLength : 0,
    signature : "",
    checkBtnAble : false,
    checkNumStr: "发送验证码",
    checkNum : "",
    phone : "",
    mailBefore : "",
    mailLater : "",
    index : 1,
    array : ["火星人","男","女"],
    date : "",
    region: [],
    customItem: '全部',
    currentLocation : "",
    errmsg : "",// 显示错误信息
    locationFlag : true // 显示选择该地址
  },

  // 性别 生日 地区picker改变值时触发的函数
  bindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    var data = {}
    data[e.currentTarget.dataset.type] = e.detail.value
    console.log(data)
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

    // 加载信息
    this.loadinfo();

    // 设置字符长度
    var length1 = this.data.nickname.trim().length
    var length2 = this.data.signature.trim().length
    this.setData({
      nickWordLength: length1,
      signatureWordLength: length2
    })

    // if (type == 6){
      
    // }

    if(type == 7) {
      // 获取位置
      this.switchLocation()
    }
  },

  loadinfo : function() {
    var accessToken = wx.getStorageSync("accessToken")
    var userinfo = accessToken.userinfo
    var nickname = userinfo.nick
    if (typeof (nickname) == "undefined"){
      nickname = ""
    }
    // var id = userinfo.randomid
    var signature = userinfo.signature
    var phone = userinfo.phone
    var mail = userinfo.mail
    if (typeof (mail) == "undefined"){
      mail = ""
    }
    var mailarr = mail.split("@")
    var mailBefore = ""
    var mailLater = ""
    if (mailarr.length == 2) {
      mailBefore = mailarr[0]
      mailLater = mailarr[1]
    }
    // 按照@分割mail
    var index = userinfo.sex
    var date = userinfo.birthday// date
    if (typeof (date) == "undefined") {
      // 获取当前日期
      var datetime = util.formatTime(new Date());
      var str = datetime.split(" ")
      var date = str[0]
      date = date.replace("/", "-")
      date = date.replace("/", "-")
    }
    var province = userinfo.province
    var city = userinfo.city
    var county = userinfo.county

    // region
    if (typeof (province) == "undefined" || province == null || province == "") {
      province = "全部"
    }
    if (typeof (city) == "undefined" || city == null || city == "") {
      city = "全部"
    }
    if (typeof (county) == "undefined" || county == null || county == "") {
      county = "全部"
    }
    var region = []
    region.push(province)
    region.push(city)
    region.push(county)

    this.setData({
      nickname: nickname,
      signature: signature,
      phone: phone,
      mailBefore: mailBefore,
      mailLater : mailLater,
      index: index,
      date:date,
      region: region
    })
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


    // 数据双向绑定
    var t = e.currentTarget.dataset.t
    var obj = {}
    var value = e.detail.value.trim()
    console.log(value)
    obj[t] = value
    this.setData(obj)
  },

  // 发送验证码按钮进行刷新
  sendCheckNum : function(e) {
    var phone = this.data.phone;

    if (phone.length < 11) {
      return;
    }

    var type = this.data.type
    var mailBefore = this.data.mailBefore
    var mailLater = this.data.mailLater

    // 此处调用真正的发短信接口
    // ...
    wx.request({
      url: app.api.regist.msgcode,
      data: {
        phone: phone,
        type : type,
        mail : mailBefore + "@" +mailLater
      },
      // type : 4 邮箱 3 手机
      method: "GET",
      // 实际不回调 手机接收短信
      // success : function(data) {
      //   console.log("模拟短信验证");
      //   console.log(data)
      // }
    })

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

    // 获取本地缓存信息
    var accessToken = wx.getStorageSync("accessToken");
    var userinfo = accessToken.userinfo;

    // 将userinfo赋值给新data
    var data = JSON.parse(JSON.stringify(userinfo))// js对象赋值赋的是地址
    console.log(userinfo)
    if (type == 1) {
      userinfo["nick"] = this.data.nickname;
      data['nick'] = this.data.nickname
      // console.log(this.data.nickname + "00000000000")
    } else if (type == 2) {
      var signature = this.data.signature
      if (signature == "") {
        signature = "这个人好懒哦，居然没有个性签名！"
      }
      userinfo['signature'] = this.data.signature
      data['signature'] = this.data.signature
    } else if (type == 3) {
      // 检验手机号和验证码的长度
      var phone = this.data.phone
      var checkNum = this.data.checkNum
      if (phone.length < 11) {
        return;
      }else if (checkNum.length < 6){
        return;
      }
      userinfo['phone'] = phone

      // 这里必须传递type参数和验证码 后台判定是否在修改手机号
      // userinfo['type'] = 3
      data['phone'] = phone
      data['type'] = 3
      data['checkNum'] = checkNum
      // userinfo['checkNum'] = checkNum
    } else if (type == 4) {

      // 邮箱字符串拼接
      var mailBefore = this.data.mailBefore
      var mailLater = this.data.mailLater
      var mail = mailBefore + "@" +mailLater
      var checkNum = this.data.checkNum

      if (checkNum.length < 6) {
        return;
      }

      userinfo['mail'] = mail
      data['mail'] = mail
      data['type'] = 4
      data['checkNum'] = checkNum
    } else if (type == 5) {
      var sex = this.data.index
      data['sex'] = sex
      console.log(1)
      console.log(userinfo)
      userinfo['sex'] = sex
      // data['sex'] = sex
    } else if (type == 6) {
      userinfo["birthday"] = this.data.date
      data['birthday'] = this.data.date
    } else if (type == 7) {
      var region = this.data.region
      var province = region[0]
      var city = region[1]
      var county = region[2]
      userinfo['province'] = province
      userinfo['city'] = city
      userinfo['county'] = county
      data['province'] = province
      data['city'] = city
      data['county'] = county
    }
    
    console.log(userinfo)

    
    accessToken.userinfo = userinfo
    

    // 获取当前token
    var token = accessToken.token
    data['token'] = token;
    // console.log(data)
    // 加载loading
    wx.showLoading({
      title: '保存中',
    })

    var that = this;

    wx.request({
      url: app.api.user,
      method : "PUT",
      header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
      data : data,
      success : function(data) {

        if (data.data.status == 200) {
          console.log(data)
          
          // 将修改后的信息重新放入缓存中
          wx.setStorageSync("accessToken", accessToken);
          // 返回上一页面
          wx.navigateBack()
        }else if (data.data.status == 403) {
          that.setData({
            errmsg : data.data.msg
          })
          // console.log(data)
        } else {
          that.setData({
            errmsg : "服务器错误，请稍后再试"
          })
          // console.log(data)
        }
      },
      complete : function() {
        // 清除loading
        wx.hideLoading();
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