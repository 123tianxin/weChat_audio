//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '欢迎收听',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    console.log("onLoad, welcome.js")
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow: function(){
    console.log("onShow, welcome.js")
    // console.log("welcome.js-->", app.globalData)
  },
  onHide: function(){
    console.log("onHide, welcome.js")
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  welcomeBtn:function(){
    wx.switchTab({
      url:"/pages/index/index"
    })
  },
  markertap:function(){
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude=res.latitude
        var longitude=res.longitude
      },
    })
  }
})
