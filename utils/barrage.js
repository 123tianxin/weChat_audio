//关于弹幕的类
class Barrage {
  constructor(isLaunch, danmuText, top, timePoint, color) {
    this.isLaunch = isLaunch
    this.danmuText = danmuText;
    this.top = top;
    this.timePoint = timePoint;
    this.color = color;
  }
}

function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; i++) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}

function getLength(array) {
  var len = 0;
  for (var i = 0; i < array.length; i++) {
    if (array.charCodeAt(i) > 127 || array.charCodeAt(i) == 94) {
      len += 2;
    } else {
      len++;
    }
  }
  return len;
}

function isLaunch(that, timePoint) {
  let { minMin, barrageList } = that.data

  for (var key in barrageList) {
    //首先时间点的判断
    //修改isLaunch
    if (barrageList[key].timePoint == minMin) {
      barrageList[key].isLaunch = true
      that.setData({
        barrageList: barrageList
      })
    }
  }
}

function initBarrageData(that) {
  let temps = []
  let barrageInfo = that.data.barrageInfo

  for (var key in barrageInfo) {
    temps.push(new Barrage(false, barrageInfo[key].danmuText, Math.ceil(Math.random() * 100), barrageInfo[key].timePoint, getRandomColor()))
  }
  that.setData({
    barrageList: temps
  })
}

module.exports = {
  getRandomColor: getRandomColor,
  getLength: getLength,
  isLaunch: isLaunch,
  initBarrageData: initBarrageData
}