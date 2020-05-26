// pages/video/video.js
// 引入util(获取系统时间))
var util = require('../../utils/util.js');
const filePath = `${wx.env.USER_DATA_PATH}/cn/tianqb/download/`
const app = getApp();
const fs = wx.getFileSystemManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0, // 1 ：video    0 ：image 
    pid: -1,
    uid: -1,
    production: null,
    showTextArea: false,
    currentPage: 1,
    pageSize: 20,
    pageCount: 1,
    comments: [],
    commentValue: "",
    isFocus: null,
    isBottom: false,
    // intoView: "view0"
  },

  onShareAppMessage(res) {
    var title = this.data.production.production.content;
    var type = this.data.type;
    var pid = this.data.pid;
    var uid = this.data.uid;
    var imageUrl = this.data.production.production.poster;

    title = title ? title : 'ta的作品太好看了，快去瞧瞧吧...'

    // console.log(res)
    return {
      title: title,
      path: '/pages/index/index?type=' + type + '&pid= ' + pid + '&uid=' + uid,
    }
  },

  // 放大看图
  previewImage: function(e) {
    // https://tianqb.cn/group1/M00/00/00/rBsADF0lvz6AEcuXAAFZp27uQQc209.jpg
    // var current = e.target.dataset.src
    var current = e.currentTarget.dataset.src;

    // console.log(current)

    var urls = []
    urls.push(current)

    wx.previewImage({
      current: current, // 此处传递的地址值必须是网络资源的链接 本地的无法显示
      urls: urls
    })
  },

  // 点击作者或者评论者的头像或名称区域进行跳转
  goUserPage: function(e) {
    var uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '../userinfo/userinfo?uid=' + uid,
    })
  },

  focus: function(e) {
    var isFocus = this.data.isFocus;
    var token = wx.getStorageSync("accessToken").token;
    var uid = this.data.uid;

    this.setData({
      isFocus: !isFocus
    })

    wx.request({
      url: app.api.user.focus + "/" + uid,
      method: "GET",
      data: {
        token: token,
        isFocus: !isFocus
      },
      success: function(res) {
        // console.log(res)
      }
    })
    // console.log("关注成功")
  },

  longfunction: function(e) {
    var src = e.currentTarget.dataset.src;
    var that = this;
    wx.showActionSheet({
      itemList: ['保存本地', '举报'],
      success(res) {
        if (res.tapIndex == 0) {
          wx.showLoading({
            title: '保存中...',
          })
          wx.downloadFile({
            url: src,
            success(res) {
              var tempFilePath = res.tempFilePath
              var type = that.data.type;
              if (type == 0) {
                // 图片
                wx.saveImageToPhotosAlbum({
                  filePath: tempFilePath,
                  success(res) {
                    wx.hideLoading()
                    wx.showToast({
                      title: '保存成功',
                      icon: "none"
                    })
                  },
                  fail(err) {
                    wx.hideLoading()
                    wx.showModal({
                      title: '消息提醒',
                      content: '保存失败，请点击右上角按钮查看相册权限是否开放！',
                    })
                    // wx.showToast({
                    //   title: '保存失败',
                    //   icon: "none"
                    // })
                  }
                })
              } else if (type == 1) {
                // 视频
                wx.saveVideoToPhotosAlbum({
                  filePath: tempFilePath,
                  success(res) {
                    wx.hideLoading()
                    wx.showToast({
                      title: '保存成功',
                      icon: "none"
                    })
                  },
                  fail(err) {
                    wx.hideLoading()
                    wx.showToast({
                      title: '保存失败',
                      icon: "none"
                    })
                  }
                })
              }

            },
            fail(err) {
              wx.hideLoading()
              wx.showToast({
                title: '下载失败',
                icon: "none"
              })
            }
          })
          // wx.showModal({
          //   title: '提示',
          //   content: '点击复制地址按钮打开浏览器进行查看',
          //   confirmText: '复制地址',
          //   success(res) {
          //     if (res.confirm) {
          //       wx.setClipboardData({
          //         data: src,
          //         success(res) {
          //           wx.showToast({
          //             title: '复制成功',
          //           })
          //         }
          //       })
          //     }
          //   }
          // })

        } else if (res.tapIndex == 1) {
          // 举报
          wx.showToast({
            title: '开发ing',
          })
        } else {
          // 取消 不做处理
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    var type = options.type;
    var pid = options.pid;
    var uid = options.uid;
    this.setData({
      type: type,
      pid: pid,
      uid: uid
    })

    var token = wx.getStorageSync("accessToken").token;
    var currentPage = this.data.currentPage;
    var pageSize = this.data.pageSize;
    var token = wx.getStorageSync("accessToken").token;
    this.loadInfo(pid, uid, token);
    this.loadComment(token, pid, currentPage, pageSize);
    this.loadIsFocus(token, uid);
  },

  loadIsFocus: function(token, uid) {
    var that = this;
    wx.request({
      url: app.api.isFocus,
      method: "GET",
      data: {
        token: token,
        uid: uid
      },
      success: function(res) {
        console.log(res)
        that.setData({
          isFocus: res.data.data
        })
      }
    })
  },

  loadInfo: function(pid, uid, token) {
    var that = this;
    wx.request({
      url: app.api.index + "/" + pid,
      method: "GET",
      data: {
        token: token,
        uid: uid
      },
      success: function(res) {
        that.setData({
          production: res.data.data
        })
      }
    })
  },

  // 加载评论信息
  loadComment: function(token, pid, currentPage, pageSize) {
    // var pid = this.data.pid;
    var that = this;
    // 获取当前时间戳
    var timestamp = Date.parse(new Date());
    wx.request({
      url: app.api.commentShow + "/" + pid,
      method: "GET",
      data: {
        token: token,
        currentPage: currentPage,
        pageSize: pageSize
      },
      success: function(res) {
        if (res.data.status = 200) {
          var data = res.data.data;
          // console.log(data)
          var comments = that.data.comments;
          var temp = data.recordList;
          console.log(temp)
          // 获取评论创建时间
          for (var i = 0; i < temp.length; i++) {
            var time = temp[i].createTime;

            // console.log(time)
            var createTimeDate = that.formatDate(time);
            var createTimestamp = Date.parse(createTimeDate);
            // console.log(createTimestamp)
            // console.log(timestamp)
            var mins = that.timestampToMin(createTimestamp, timestamp);
            // console.log(mins)
            var tem = temp[i];
            // 获取自定义的时间显示内容
            var string = that.timeToDefineStr(mins, time);
            tem['timestr'] = string;
            comments.push(temp[i]);
          }

          // console.log(data)
          that.setData({
            comments: comments,
            pageCount: data.pageCount,
            currentPage: data.currentPage
          })
        } else {
          wx.showToast({
            title: '发生了一个错误',
            icon: 'none'
          })
        }
      }
    })
  },

  // 展示子评论
  showSubComments(e) {
    var pid = this.data.pid;
    var cid = e.currentTarget.dataset.cid;
    var token = wx.getStorageSync("accessToken").token;

  },

  // 格式化时间 str-date
  formatDate(strDate) {
    strDate.replace(/-/g, "/");
    var date = new Date(strDate);
    return date;
  },

  // 按照时间差显示不同的内容 如1小时前等等
  timeToDefineStr(mins, createtime) {
    var string = "";
    if (mins <= 1) {
      string = "刚刚"
    } else if (mins <= 60) {
      string = mins + "分钟前"
    } else if (mins <= 60 * 24) {
      var m = parseInt(mins);
      var hour = m / 60;
      string = Math.floor(hour) + "小时前";
    } else if (mins <= 60 * 24 * 5) {
      var m = parseInt(mins);
      var day = m / 60 / 24;
      string = Math.floor(day) + "天前";
    } else {
      var str = createtime.split(" ");
      var date = str[0];
      var datearr = date.split("-");
      var year = datearr[0];
      var month = datearr[1];
      var day = datearr[2];
      string = year + "-" + month + "-" + day
    }
    return string;
  },

  // 将时间转为分钟数
  timestampToMin(time, currentTime) {
    var t = currentTime - time;
    return Math.floor(t / 1000 / 60);
  },

  // 评论滑动到底部
  commentBottom: function() {
    var currentPage = this.data.currentPage;
    var pageCount = this.data.pageCount;
    var pageSize = this.data.pageSize;
    // console.log(currentPage)
    // console.log(pageCount)
    if (currentPage == pageCount) {
      wx.showToast({
        title: '评论已经到底了，别再滑了!',
        icon: "none"
      })
      return;
    }

    var token = wx.getStorageSync("accessToken").token;
    var pid = this.data.pid;
    this.loadComment(token, pid, currentPage + 1, pageSize);
  },

  comment: function(e) {
    var flag = this.data.showTextArea;
    if (flag) {
      this.setData({
        showTextArea: false,
      })
    } else {
      this.setData({
        showTextArea: true,
        commentValue: ""
      })
    }
  },

  inputHandler: function(e) {
    // console.log(e)
    this.setData({
      commentValue: e.detail.value
    })
  },

  send: function(e) {

    var content = this.data.commentValue;

    if (content.trim() == "") {
      return;
    }

    this.setData({
      showTextArea: false
    })


    var pid = this.data.pid;
    var uid = this.data.uid;
    var that = this;

    var token = wx.getStorageSync("accessToken").token;

    wx.request({
      url: app.api.comment,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      data: {
        content: content,
        token: token,
        productionId: pid,
      },
      success: function(res) {
        var id = res.data.data;
        var temp = [];
        var userinfo = wx.getStorageSync("accessToken").userinfo;
        var data = {
          id: id,
          productionId: pid,
          userId: uid,
          isDelete: false,
          isComments: true,
          content: content,
          isLikes: false,
          likes: 0,
          nick: userinfo.nick,
          avatarUrl: userinfo.avatarurl,
          timestr: "刚刚"
        };
        temp.push(data);
        var comments = that.data.comments;
        for (var i = 0; i < comments.length; i++) {
          temp.push(comments[i]);
        }

        var production = that.data.production;
        production.comment = production.comment + 1;
        that.setData({
          comments: temp,
          production: production
        })
        that.setData({
          intoView: "view" + id
        })
      }
    })
    // console.log(e)
    // wx.pageScrollTo({
    //   scrollTop: 0,
    //   duration: 300
    // })
  },

  commentLikeHandler: function(e) {
    var pid = this.data.pid;
    var isLike = e.currentTarget.dataset.islike;
    var cid = e.currentTarget.dataset.cid;
    var index = e.currentTarget.dataset.index;
    var token = wx.getStorageSync("accessToken").token;
    // console.log(index)

    var comments = this.data.comments;
    // console.log(isLike)
    comments[index].isLikes = !isLike;

    if (isLike) {
      // 取消点赞
      comments[index].likes = comments[index].likes - 1;
    } else {
      // 正常点赞
      comments[index].likes = comments[index].likes + 1;
    }

    this.setData({
      comments: comments
    })

    wx.request({
      url: app.api.commentLike,
      method: "PUT",
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      data: {
        token: token,
        cid: cid,
        isLike: !isLike,
        pid: pid
      },
      success: function(res) {

      }
    })
  },

  // 点赞
  like: function(e) {
    // console.log(e)
    var pid = e.currentTarget.dataset.pid;
    var islike = e.currentTarget.dataset.islike;

    // 
    var production = this.data.production;
    production.islike = !islike;
    if (islike) {
      production.likes = production.likes - 1
    } else {
      production.likes = production.likes + 1
    }


    this.setData({
      production: production
    })

    var token = wx.getStorageSync("accessToken").token
    wx.request({
      url: app.api.like + "/" + pid,
      method: "GET",
      data: {
        token: token,
        islike: !islike
      }
    })

    // console.log(index)
  },

  // 收藏
  collect: function(e) {
    var pid = e.currentTarget.dataset.pid;
    var collect = e.currentTarget.dataset.iscollect;
    var token = wx.getStorageSync("accessToken").token

    // console.log(collect)

    var production = this.data.production;
    production.collect = !collect;

    this.setData({
      production: production
    })

    wx.request({
      url: app.api.collect + "/" + pid,
      method: "GET",
      data: {
        token: token,
        iscollect: !collect
      },
      // success:function(res) {
      //   console.log(res)
      // }
    })

    // console.log(e)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var currentPage = this.data.currentPage;
    var pageCount = this.data.pageCount;
    var pageSize = this.data.pageSize;
    // console.log(currentPage)
    // console.log(pageCount)
    if (currentPage == pageCount) {
      this.setData({
        isBottom: true
      })
      return;
    }

    var token = wx.getStorageSync("accessToken").token;
    var pid = this.data.pid;
    this.loadComment(token, pid, currentPage + 1, pageSize);
  },
})