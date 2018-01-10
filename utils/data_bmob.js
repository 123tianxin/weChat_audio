var Bmob = require('../utils/bmob.js')
var buildURL = require('../utils/buildURL.js')

function getAllObjectID(callback) {
  var radioData = Bmob.Object.extend("radio_data");
  var query = new Bmob.Query(radioData);
  // 查询所有数据
  query.find({
    success: function (results) {
      let dataInfo = []
      // 循环处理查询到的数据
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        dataInfo.push(object.id)
      }
      callback(dataInfo)
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}

function getOneInfo(objectID, callback){
  var radioData = Bmob.Object.extend("radio_data");
  var query = new Bmob.Query(radioData);
  query.get(objectID, {
    success: function (result) {
      // The object was retrieved successfully.
      let oneInfo = {}
      oneInfo.title = result.get("title")
      oneInfo.des = result.get("des")
      oneInfo.date = result.get("date")
      callback(oneInfo)
    },
    error: function (result, error) {
      console.log("查询失败");
    }
  });
}

function getAllInfo(callback){
  var radioData = Bmob.Object.extend("radio_data");
  var query = new Bmob.Query(radioData);
  // 查询所有数据
  query.find({
    success: function (results) {
      let list_content = []
      // 循环处理查询到的数据
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        let temp_content = {}
        temp_content.objectId = object.id
        temp_content.title = object.get('title')
        temp_content.date = object.get('date')
        temp_content.list_content = object.get('des')
        temp_content.list_img = buildURL.getImageURL(temp_content.date)
        list_content.push(temp_content)
      }
      callback(list_content)
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}

function getBarrageInfo(audioID, callback){
  var barrageData = Bmob.Object.extend("barrage_data");
  var query = new Bmob.Query(barrageData);
  query.equalTo("audioID", audioID);
  // 查询所有数据
  query.find({
    success: function (results) {
      // console.log("barrage-->共查询到 " + results.length + " 条记录");
      // 循环处理查询到的数据
      let barrageInfo = []
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        barrageInfo.push(object.attributes)
        // console.log(object)
      }
      callback(barrageInfo)
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}

function saveOneBarrageInfo(audioID, barrageInfo){
  //创建类和实例
  var barrageData = Bmob.Object.extend("barrage_data");
  var barrageData = new barrageData();
  barrageData.set("danmuText", barrageInfo.danmuText);
  barrageData.set("timePoint", barrageInfo.timePoint);
  barrageData.set("audioID",audioID)
  barrageData.set("isLaunch", false)
  //添加数据，第一个入口参数是null
  barrageData.save(null, {
    success: function (result) {
      // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
      console.log("日记创建成功, objectId:" + result.id);
    },
    error: function (result, error) {
      // 添加失败
      console.log('创建日记失败');

    }
  });
}

module.exports = {
  getAllObjectID: getAllObjectID,
  getAllInfo: getAllInfo,
  getOneInfo: getOneInfo,
  getBarrageInfo: getBarrageInfo,
  saveOneBarrageInfo: saveOneBarrageInfo
}