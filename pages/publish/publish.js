// pages/publish/publish.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src : "",
    type:1,
    explore : "",
    chooseLocal : false,
    chooseLocalSrc : "",
    chooseVideo : false,
    duration : 11,
    duration: -1,
    height: -1,
    width: -1,
    content : "",
    exploreId : null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var src = options.src;
    var type = options.type;
    var duration = options.duration;
    var height = options.height;
    var width = options.width;
    this.setData({
      src : src,
      type : type,
      duration:duration,
      height:height,
      width:width
    })

    wx.setNavigationBarTitle({
      title: '发布作品',
    })
  },
  
  contentHandler : function(e) {
    // console.log(e)
    var content = e.detail.value;
    this.setData({
      content : content
    })
  },

  chooseVideo : function() {
    // 从缓存信息中取出分区信息
    var explore = wx.getStorageSync("explore");
    var data = [];
    for (var i = 0; i < explore.length; i++) {
      data.push(explore[i].explore.name)
    }
    var that = this;
    wx.showActionSheet({
      itemList: data,
      success(res) {
        that.setData({
          chooseVideo : true,
          duration: data[res.tapIndex]
        })
      }
    })
  },

  chooseExplore : function() {
    var that = this;
    var explore = wx.getStorageSync("explore");
    var data = [];
    for (var i = 0; i < explore.length; i++) {
      data.push(explore[i].explore.name)
    }
    wx.showActionSheet({
      itemList: data,
      success(res) {
        // 获取专区ID
        // exploreIdexplore[res.tapIndex]
        that.setData({
          explore: data[res.tapIndex],
          exploreId: explore[res.tapIndex].explore.id
        })
      }
    })
  },

  chooseLocal : function() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        var posterPath = res.tempFilePaths[0];
        console.log(res)
        that.setData({
          chooseLocalSrc: posterPath,
          chooseLocal :true
        })
      }
    })
  },

  closeExplore : function() {
    this.setData({
      explore : ""
    })
  },

  closePoster : function() {
    this.setData({
      chooseLocal: false
    })
  },

  // 发布
  publish : function (e) {
    var that = this;
    // 作品路径
    var productionFile = this.data.src;
    var token = wx.getStorageSync("accessToken").token;
    var type = this.data.type;
    var content = this.data.content;
    var formData = {
      token: token,
      type: type,
      content: content,
    }
    if (this.data.explore != "") {
      formData['exploreId'] = this.data.exploreId;
    }

    if(type == 0) {
      // 图文作品
      // 设置宽高
      formData['width'] = this.data.width;
      formData['height'] = this.data.height;
    }

    

    var productionUpload = function () {
      if (that.data.chooseLocal == false) {
        formData['isPoster'] = 0;
      } else {
        formData['isPoster'] = 1;
      }
      wx.showLoading({
        title: '作品上传中...',
      })
      wx.uploadFile({
        url: app.api.productionUpload,
        filePath: productionFile,
        name: 'productionFile',
        header: {
          "Content-Type": "multipart/form-data"
        },
        formData: formData,
        success: function (res) {
          var temp = JSON.parse(res.data);
          console.log(temp)
          if (temp.status == 200) {
            wx.showToast({
              title: '作品上传成功',
              icon : 'success'
            })

            setTimeout(function(){
              wx.switchTab({
                url: '../upload/upload',
              })
            },1500)
          } else {
            wx.hideLoading();
            wx.showToast({
              title: '上传失败，请稍后再试',
            })  
          }
        },
        complete: function () {
          wx.hideLoading();
        }
      })

    }

    var productionUploadAndPoster = function () {
      wx.showLoading({
        title: '作品上传中...',
      })
      formData['isPoster'] = 1;
      console.log(formData)
      wx.uploadFile({
        url: app.api.productionUpload,
        filePath: productionFile,
        name: 'productionFile',
        header: {
          "Content-Type": "multipart/form-data"
        },
        formData: formData,
        success: function (res) {
          var temp = JSON.parse(res.data);
          console.log(temp)
          if (temp.status == 200) {
            var uploadPoster = function () {
              // 获取文件
              var file = that.data.chooseLocalSrc;
              wx.uploadFile({
                url: app.api.productionUploadPoster,
                filePath: file,
                name: 'file',
                header: {
                  "Content-Type": "multipart/form-data"
                },
                formData: {
                  token: token,
                  pid: temp.data.id
                },
                success: function (res) {
                  var t = JSON.parse(res.data);
                  if (t.status == 200) {
                    wx.showToast({
                      title: '作品上传成功',
                      icon: 'success'
                    })
                    setTimeout(function () {
                      wx.switchTab({
                        url: '../upload/upload',
                      })
                    }, 1500)
                  } else {
                    wx.showToast({
                      title: '上传失败，请稍后再试',
                    })
                  }
                },
                fail : function () {
                  wx.showToast({
                    title: '上传失败，请稍后再试',
                  })
                },
                complete: function () {
                  wx.hideLoading();
                }
              })
            }
            uploadPoster();
          }
        },
        fail : function() {
          wx.showToast({
            title: '上传失败，请稍后再试',
          })
          wx.hideLoading();
        },  
        complete : function(){
          
        }
      })
    }

    // 
    // 判断是否存在封面图
    // 若存在封面图
    var chooseLocal = this.data.chooseLocal;
    var chooseLocalSrc = this.data.chooseLocalSrc;
    if (chooseLocal) {
      var fun = function() {
        app.imgSecurity(chooseLocalSrc, productionUploadAndPoster)
      }
      app.contentSecurity(content, fun);
    } else {
      // 不存在封面图
      app.contentSecurity(content, productionUpload);
    }
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