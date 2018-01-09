function showTip(sms, icon, fun, t) {
    if (!t) {
        t = 1000;
    }
    wx.showToast({
        title: sms,
        icon: icon,
        duration: t,
        success: fun
    })
}

function showModal(c,t,fun) {
    if(!t)
        t='提示'
    wx.showModal({
        title: t,
        content: c,
        showCancel:false,
        success: fun
    })
}

function stotime(s) {
  let t = '';
  if (s > -1) {
    // let hour = Math.floor(s / 3600);
    let min = Math.floor(s / 60) % 60;
    let sec = s % 60;
    // if (hour < 10) {
    //   t = '0' + hour + ":";
    // } else {
    //   t = hour + ":";
    // }

    if (min < 10) { t += "0"; }
    t += min + ":";
    if (sec < 10) { t += "0"; }
    t += sec;
  }
  return t;
}


module.exports.showTip = showTip;
module.exports.showModal = showModal;
module.exports.stotime = stotime;
