var barrage = require('barrage.js')
var common = require('common.js')

function setDuration(that) {
  wx.getBackgroundAudioPlayerState({
    success: function (res) {
      // console.log("setDuration-->", res)
      let { status, duration, currentPosition } = res
      if (status === 1 || status === 0) {
        //修改弹幕是否发射的值
        barrage.isLaunch(that, common.stotime(currentPosition))
        that.setData({
          minMin: common.stotime(currentPosition),
          maxMin: common.stotime(duration),
          sliderValue: Math.floor(currentPosition * 100 / duration),
          duration: duration
        })
      }
    }
  })
}

function play(that) {
  let { oneInfo, audioIndex, sliderValue, duration, currentPosition } = that.data
  // console.log("play-->", this.data)
  wx.playBackgroundAudio({
    dataUrl: that.data.audioURL,
    title: oneInfo.title,
    coverImgUrl: that.data.imageURL,
    seccess: function () {
      wx.seekBackgroundAudio({
        position: currentPosition,
      })
    }
  })
  let timer = setInterval(function () {
    setDuration(that)
  }, 1000)
  that.setData({ timer: timer })
}

module.exports.setDuration = setDuration
module.exports.play = play