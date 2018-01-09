//index.js
//获取应用实例
var app = getApp()
var dataBmob = require('../../utils/data_bmob.js')
var buildURL = require('../../utils/buildURL.js')
var barrage = require('../../utils/barrage.js')
var common = require('../../utils/common.js')
var playFun = require('../../utils/playFun.js')

class Barrage {
  constructor(isLaunch, danmuText, top, timePoint, color) {
    this.isLaunch = isLaunch
    this.danmuText = danmuText;
    this.top = top;
    this.timePoint = timePoint;
    this.color = color;
  }
}

Page({
  data: {
    dataInfo: null,
    oneInfo: null,
    barrageInfo: null,
    imageURL: '',
    audioURL: '',
    minMin: '00:00',
    maxMin: '00:00',
    duration: 0,
    currentPosition: 0,
    audioIndex: 0,
    sliderValue: 0,
    isDetail:false,
    pauseStatus: true,
    timer: '',
    barrageList: [],//储存弹幕对象数组
    inputDoomData: '',//评论提示框输入弹幕内容
    hiddenmodalput: true,
    doomswitch: true,
  },
  onLoad: function (options) {
    console.log("onLoad, index.js")
    //  获取本地存储存储audioIndex
    var audioIndexStorage = wx.getStorageSync('audioIndex')
    if (audioIndexStorage) {
      this.setData({ audioIndex: 0}) 
    }

    let that = this
    let { dataInfo, oneInfo, barrageInfo, duration } = app.globalData
    this.setData({
      dataInfo: dataInfo,
      oneInfo: oneInfo,
      barrageInfo: barrageInfo,
      imageURL: buildURL.getImageURL(oneInfo.date),
      audioURL: buildURL.getAudioURL(oneInfo.date),
      minMin: '00:00',
      maxMin: common.stotime(duration),
      duration: duration,
    })

    //初始化this.data.BarrageList数据
    barrage.initBarrageData(that)

    console.log("index.js-->", this.data)
  },
  onShow: function(){
    console.log("onShow, index.js")
    // console.log("index.js-->", app.globalData)
  },
  bindSliderchange: function(audio) {
    // clearInterval(this.data.timer)
    let value = audio.detail.value
    let that = this
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        console.log(res)
        let { status } = res
        let duration = that.data.duration
        console.log("当前进度：", value * duration / 100)
        if (status === 2 || status === 1 || status === 0) {
          that.setData({
            minMin: common.stotime(parseInt(value * duration / 100)),
            currentPosition: parseInt(value * duration / 100),
            sliderValue: value
          })
        }
        wx.seekBackgroundAudio({
          position: parseInt(value * duration / 100),
          success: function (res) {
            console.log("success-->", res)
          },
          fail: function (err) {
            console.log("fail-->", err)
          }
        })
      }
    })
  },
  bindTapPrev: function() {
    console.log('bindTapPrev')
    let that = this

    let length = this.data.dataInfo.length
    let audioIndexPrev = this.data.audioIndex
    let audioIndexNow = audioIndexPrev
    if (audioIndexPrev === 0) {
      audioIndexNow = length - 1
    } else {
      audioIndexNow = audioIndexPrev - 1
    }
    
    that.doPrevOrNext(audioIndexNow)
  },
  bindTapNext: function() {
    console.log('bindTapNext')
    let that = this
    
    let length = this.data.dataInfo.length
    let audioIndexPrev = this.data.audioIndex
    let audioIndexNow = audioIndexPrev
    if (audioIndexPrev === length - 1) {
      audioIndexNow = 0
    } else {
      audioIndexNow = audioIndexPrev + 1
    }
    
    that.doPrevOrNext(audioIndexNow)
  },
  bindTapPlay: function() {
    console.log('bindTapPlay')
    let that = this
    // console.log(this.data.pauseStatus)
    if (this.data.pauseStatus === true) {
      playFun.play(that)
      this.setData({pauseStatus: false})
    } else {
      clearInterval(this.data.timer)
      wx.pauseBackgroundAudio()
      this.setData({pauseStatus: true})
    }
  },
  doPrevOrNext: function (audioIndexNow){
    let that = this

    clearInterval(this.data.timer)
    that.setData({
      pauseStatus: false,
      sliderValue: 0,
      currentPosition: 0,
      duration: 0,
      minMin: "00:00",
    })

    dataBmob.getOneInfo(this.data.dataInfo[audioIndexNow], function (oneInfo) {
      that.setData({
        oneInfo: oneInfo,
        imageURL: buildURL.getImageURL(oneInfo.date),
        audioURL: buildURL.getAudioURL(oneInfo.date),
        audioIndex: audioIndexNow,
        pauseStatus: false,
        sliderValue: 0,
        currentPosition: 0,
        duration: 0,
      })
      dataBmob.getBarrageInfo(that.data.dataInfo[audioIndexNow], function (barrageInfo) {
        that.setData({
          barrageInfo: barrageInfo
        })

        //初始化this.data.BarrageList数据
        barrage.initBarrageData(that)

        setTimeout(() => {
          if (that.data.pauseStatus === false) {
            playFun.play(that)
          }
        }, 1000)

        //停止后台播放
        wx.pauseBackgroundAudio()
        wx.setStorageSync('audioIndex', audioIndexNow)
      })
    })
  },
  //弹幕评论绑定事件
  bindDoom: function (e) {
    console.log(e);
    let { dataInfo, minMin, audioIndex, inputDoomData, barrageList, hiddenmodalput} = this.data
    let barrageInfo = {
      isLaunch: false,
      danmuText: inputDoomData,
      timePoint: minMin,
    }
    //保存数据到后台
    dataBmob.saveOneBarrageInfo(dataInfo[audioIndex], barrageInfo)
    barrageList.push(new Barrage(false, inputDoomData, Math.ceil(Math.random() * 100), minMin, barrage.getRandomColor()));
    this.setData({
      barrageList: barrageList,
      inputDoomData: '',
      hiddenmodalput: !hiddenmodalput
    });
  },
  //输入评论之后离开焦点
  DoomInput: function (e) {
    console.log(e);
    if (e.detail.value && barrage.getLength(e.detail.value) <= 15) {
      this.setData({
        inputDoomData: e.detail.value
      })
    }
    else {
      this.setData({ isShowToast: true })
    }
  },
  //弹幕开关
  DoomSwitch: function (e) {
    console.log(e);
    if (this.data.doomswitch == true) {
      this.setData({
        doomswitch: false
      })
    }
    else {
      this.setData({
        doomswitch: true
      })
    }
  },
  //点击评论图片指定的hiddenmodalput弹出框  
  modalinput: function () {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //取消按钮  
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },

  onShareAppMessage: function () {
    let that = this
    return {
      title: 'light轻音乐：' + that.data.audioList[that.data.audioIndex].name,
      success: function(res) {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '分享失败',
          icon: 'cancel',
          duration: 2000
        })
      }
    }
  },
  exdetail: function () {
    console.log(this.data.isDetail)
    if (this.data.isDetail == false) {
      this.setData({ isDetail: true })
    }
    else {
      this.setData({ isDetail: false })
    }
  }
})
