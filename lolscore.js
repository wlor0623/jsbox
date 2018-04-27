// 原作者：wlor0623，  https://github.com/wlor0623/jsbox/edit/master/lolscore.js
// 由 QvQ修改： https://github.com/FrankHan/jsbox/blob/master/LOL%20All.js  

// 获取比赛数据
$app.tips("点击即可查看比赛视频");
var resp = []
$http.post({
  url: "http://www.wanplus.com/ajax/schedule/list",
  header: {
    "X-Requested-With": "XMLHttpRequest",
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Connection": "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Cookie": "wanplus_token=748eb4703f9afac18fb4c1330f8556a7; wanplus_storage=lf4m67eka3o; wanplus_sid=df20830483a4ac7ac2ff3712997655e9; wanplus_csrf=_csrf_tk_184373722; wp_pvid=427144384; wp_info=ssid=s1067845980; isShown=1; gameType=2",
    "Host": "www.wanplus.com",
    "Origin": "http://www.wanplus.com",
    "Referer": "http://www.wanplus.com/lol/schedule",
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1",
    "X-CSRF-Token": "184373722"
  },
  body: {
    _gtk: 184373722,
    game: 2,
    eids: ""
  },
  handler: function (resp) {
    resp = resp;
    var data = resp.data

    console.log(data)

    var scheduleList = data.data.scheduleList;
    for (var k in scheduleList) {
      if (scheduleList[k].week == "今天") {
        var todayDateStore = k
      }
    }
    console.log(todayDateStore)
    var timeArr = [] //取时间值
    var timeDataArr = []; //数据值
    for (var key in scheduleList) {
      timeArr.push(key);
      timeDataArr.push(scheduleList[key]);
    }
    // ---无比赛过滤器
    var timeTArr = [];
    var timeTDataArr = [];// 原作者：wlor0623，  https://github.com/wlor0623/jsbox/edit/master/lolscore.js
// 由 QvQ修改： https://github.com/FrankHan/jsbox/blob/master/LOL%20All.js  

// 获取比赛数据
$app.tips("点击即可查看比赛视频");
let resp = []
$http.post({
  url: "http://www.wanplus.com/ajax/schedule/list",
  header: {
    "X-Requested-With": "XMLHttpRequest",
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Connection": "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Cookie": "wanplus_token=748eb4703f9afac18fb4c1330f8556a7; wanplus_storage=lf4m67eka3o; wanplus_sid=df20830483a4ac7ac2ff3712997655e9; wanplus_csrf=_csrf_tk_184373722; wp_pvid=427144384; wp_info=ssid=s1067845980; isShown=1; gameType=2",
    "Host": "www.wanplus.com",
    "Origin": "http://www.wanplus.com",
    "Referer": "http://www.wanplus.com/lol/schedule",
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1",
    "X-CSRF-Token": "184373722"
  },
  body: {
    _gtk: 184373722,
    game: 2,
    eids: ""
  },
  handler: function (resp) {
    resp = resp;
    let data = resp.data

    console.log(data)

    let scheduleList = data.data.scheduleList;
    for (var k in scheduleList) {
      if (scheduleList[k].week == "今天") {
        var todayDateStore = k
      }
    }
    let timeArr = [] //取时间值
    let timeDataArr = []; //数据值
    for (let key in scheduleList) {
      timeArr.push(key);
      timeDataArr.push(scheduleList[key]);
    }
    // ---无比赛过滤器
    let timeTArr = [];
    let timeTDataArr = [];
    let timeForHeaderT = [];
    for (let i = 0; i < timeDataArr.length; i++) {
      if (timeDataArr[i].list != false) {
        timeTArr.push(timeArr[i]);
        // timeForHeaderT.push(timeForHeader[i]);
        // timeTDataArr.push(timeDataArr[i]);
      }
    }
    // ---过滤器end
    console.log(timeTArr)
    for (let i = 0; i < timeTArr.length; i++) {
      if (timeTArr[i] >= todayDateStore) {
        console.log(i); //定位到最近一天
        render(resp, i);
        break;
      }
    }
    //render(resp, 0);
  }
})
// 渲染
function render(resp, dateIndex) {
  let data = resp.data
  //  console.log(data)
  let prevdate = data.data.prevdate; //上周时间
  let nextdate = data.data.nextdate; //下周时间
  let prevtime = data.data.prevtime; //上周时间戳
  let nexttime = data.data.nexttime; //下周时间戳
  let timeArr = [] //取时间值
  let timeForHeader = []; // 显示在menu
  let timeDataArr = []; //数据值
  let rowsData = []; //列表信息
  let scheduleList = data.data.scheduleList;
  for (let key in scheduleList) {
    timeArr.push(key);
    timeForHeader.push(scheduleList[key].week); // lDate,date,week,filterdate
    //console.log(key)  //打印日期
    timeDataArr.push(scheduleList[key]);
  }

  // ---无比赛过滤器
  let timeTArr = [];
  let timeTDataArr = [];
  let timeForHeaderT = [];
  for (let i = 0; i < timeDataArr.length; i++) {
    if (timeDataArr[i].list != false) {
      timeTArr.push(timeArr[i]);
      timeForHeaderT.push(timeForHeader[i]);
      timeTDataArr.push(timeDataArr[i]);
    }
  }
  // ---过滤器end

  let toDayData = timeTDataArr[dateIndex]; //当天数据 
  let headerDateTip = toDayData.lDate; //头部日期提示

  let toDayList = toDayData.list; //当天比赛数据
  let rowToDayList = []; //每行比赛数据
  // 循环添加信息
  for (let i = 0; i < toDayList.length; i++) {
    let obj = {};
    obj.title = {}; //参赛队伍
    obj.content = {}; //比赛介绍
    obj.gamename = {}; //比赛名称
    obj.onewinscore = {}; //一队比分
    obj.towwinscore = {}; //二队比分
    obj.scheduleid = {}; //比赛id
    obj.oneicon = {}; //一队图标
    obj.twoicon = {}; //二队图标
    obj.oneicon.src = toDayList[i].oneicon;
    obj.twoicon.src = toDayList[i].twoicon;
    obj.title.text = toDayList[i].oneseedname + " : " + toDayList[i].twoseedname;
    obj.content.text = toDayList[i].ename + toDayList[i].groupname + " " + toDayList[i].starttime;
    obj.onewinscore.text = toDayList[i].onewin;
    obj.towwinscore.text = toDayList[i].twowin;
    obj.scheduleid.text = toDayList[i].scheduleid;
    rowToDayList.push(obj);
  }
  // 渲染列表
  $ui.render({
    views: [{
        type: "menu",
        props: {
          //items: timeTArr,
          items: timeForHeaderT,
          index: dateIndex
        },
        layout: function (make) {
          make.left.top.right.equalTo(0)
          make.height.equalTo(44)
        },
        events: {
          changed: function (sender) {
            let items = sender.items
            let index = sender.index;
            render(resp, index);
            // $ui.toast(index + ": "  + items[index]);
          }
        }
      }, {
        type: "list",
        props: {
          grouped: true,
          rowHeight: 68, // 行高
          header: {
            type: "label",
            props: {
              height: 20,
              text: headerDateTip,
              textColor: $color("#AAAAAA"),
              align: $align.center,
              font: $font(14)
            }
          },
          template: [{
              type: "label",
              props: {
                id: "title", // 队伍
                font: $font(20)
              },
              layout: function (make, view) {
                make.centerX.equalTo(0)
                make.top.offset(16)
                // make.left.equalTo(160)
                // make.top.right.inset(8)
                make.height.equalTo(24)
              }
            },
            {
              type: "label",
              props: {
                id: "content",
                textColor: $color("#888888"),
                font: $font(15)
              }, // 比赛时间 id content
              layout: function (make, view) {
                make.top.equalTo(48)
                make.centerX.equalTo(0) // 居中
                make.bottom.equalTo(-2);
              }
            },
            {
              type: "label",
              props: {
                id: "onewinscore", //一队比分
                textColor: $color("#888888"),
                font: $font(25)
              },
              layout: function (make) {
                //make.left.equalTo(40)
                make.left.inset(48)
                make.top.inset(10)
                make.height.equalTo(40)
              }
            },
            {
              type: "image",
              props: {
                id: "oneicon", //一队图标
                radius: 20
              },
              layout: function (make, view) {
                make.left.equalTo(100);
                make.top.equalTo(8);
                make.size.equalTo(40)
              }
            },
            {
              type: "image",
              props: {
                id: "twoicon", //二队图标
                radius: 20
              },
              layout: function (make, view) {
                make.right.inset(100);
                make.top.equalTo(8);
                make.size.equalTo(40)
              }
            },
            {
              type: "label",
              props: {
                id: "towwinscore", //二队比分
                textColor: $color("#888888"),
                font: $font(25)
              }, // 右边比分
              layout: function (make) {
                //make.right.equalTo(40)
                make.right.inset(48)
                make.top.inset(10)
                make.height.equalTo(40)
              }
            }
          ],
          data: [{
            rows: rowToDayList
          }]
        },
        layout: function (make, view) {
          make.left.right.equalTo(0);
          make.top.equalTo(45);
          make.height.equalTo(view.super);
        },
        events: {
          didSelect: function (tableView, indexPath) {
            let row = indexPath.row;
            let scheduleid = rowToDayList[row].scheduleid.text;
            console.log(scheduleid)
            $app.openBrowser({
              type: 10000,
              url: "http://www.wanplus.com/schedule/" + scheduleid + ".html"
            })
          }
        }
      },
      {
        type: "button",
        props: {
          title: prevdate,
          info: {
            prevtime: prevtime
          }
        },
        layout: function (make, view) {
          make.left.equalTo(30);
          make.bottom.equalTo(-20);
          make.height.equalTo(40);
        },
        events: {
          tapped: function (sender) {
            let prevtime=sender.info.prevtime; //上周时间戳
            console.log(prevtime);
            $ui.toast(prevtime + " 功能待添加");
          }
        }
      },
      {
        type: "button",
        props: {
          title: nextdate,
          info: {
            nexttime: nexttime
          }
        },
        layout: function (make, view) {
          make.right.equalTo(-30);
          make.bottom.equalTo(-20);
          make.height.equalTo(40);
        },
        events: {
          tapped: function (sender) {
            console.log(sender.info.nexttime); //下周时间戳
            $ui.toast(sender.info.nexttime + " 功能待添加")
          }
        }
      }
    ]
  })
  if (toDayData.list == false) {
    return $ui.toast("无数据");
  }
}

    var timeForHeaderT = [];
    for (var i = 0; i < timeDataArr.length; i++) {
      if (timeDataArr[i].list != false) {
        timeTArr.push(timeArr[i]);
        // timeForHeaderT.push(timeForHeader[i]);
        // timeTDataArr.push(timeDataArr[i]);
      }
    }
    // ---过滤器end
    console.log(timeTArr)
    for (var i = 0; i < timeTArr.length; i++) {
      if (timeTArr[i] >= todayDateStore) {
        console.log(i); //定位到最近一天
        render(resp, i);
        break;
      }
    }
    //render(resp, 0);
  }
})
// 渲染
function render(resp, dateIndex) {
  var data = resp.data
  //  console.log(data)
  var prevdate = data.data.prevdate; //上周时间
  var nextdate = data.data.nextdate; //下周时间
  var prevtime = data.data.prevtime; //上周时间戳
  var nexttime = data.data.nexttime; //下周时间戳
  var timeArr = [] //取时间值
  var timeForHeader = []; // 显示在menu
  var timeDataArr = []; //数据值
  var rowsData = []; //列表信息
  var scheduleList = data.data.scheduleList;
  for (var key in scheduleList) {
    timeArr.push(key);
    timeForHeader.push(scheduleList[key].week); // lDate,date,week,filterdate
    //console.log(key)  //打印日期
    timeDataArr.push(scheduleList[key]);
  }

  // ---无比赛过滤器
  var timeTArr = [];
  var timeTDataArr = [];
  var timeForHeaderT = [];
  for (var i = 0; i < timeDataArr.length; i++) {
    if (timeDataArr[i].list != false) {
      timeTArr.push(timeArr[i]);
      timeForHeaderT.push(timeForHeader[i]);
      timeTDataArr.push(timeDataArr[i]);
    }
  }
  // ---过滤器end

  var toDayData = timeTDataArr[dateIndex]; //当天数据 
  var headerDateTip = toDayData.lDate; //头部日期提示

  var toDayList = toDayData.list; //当天比赛数据
  var rowToDayList = []; //每行比赛数据
  // 循环添加信息
  for (var i = 0; i < toDayList.length; i++) {
    var obj = {};
    obj.title = {}; //参赛队伍
    obj.content = {}; //比赛介绍
    obj.gamename = {}; //比赛名称
    obj.onewinscore = {}; //一队比分
    obj.towwinscore = {}; //二队比分
    obj.scheduleid = {}; //比赛id
    obj.oneicon = {}; //一队图标
    obj.twoicon = {}; //二队图标
    obj.oneicon.src = toDayList[i].oneicon;
    obj.twoicon.src = toDayList[i].twoicon;
    obj.title.text = toDayList[i].oneseedname + " : " + toDayList[i].twoseedname;
    obj.content.text = toDayList[i].ename + toDayList[i].groupname + " " + toDayList[i].starttime;
    obj.onewinscore.text = toDayList[i].onewin;
    obj.towwinscore.text = toDayList[i].twowin;
    obj.scheduleid.text = toDayList[i].scheduleid;
    rowToDayList.push(obj);
  }
  // 渲染列表
  $ui.render({
    views: [{
        type: "menu",
        props: {
          //items: timeTArr,
          items: timeForHeaderT,
          index: dateIndex
        },
        layout: function (make) {
          make.left.top.right.equalTo(0)
          make.height.equalTo(44)
        },
        events: {
          changed: function (sender) {
            var items = sender.items
            var index = sender.index;
            render(resp, index);
            // $ui.toast(index + ": "  + items[index]);
          }
        }
      }, {
        type: "list",
        props: {
          grouped: true,
          rowHeight: 68, // 行高
          header: {
            type: "label",
            props: {
              height: 20,
              text: headerDateTip,
              textColor: $color("#AAAAAA"),
              align: $align.center,
              font: $font(14)
            }
          },
          template: [{
              type: "label",
              props: {
                id: "title", // 队伍
                font: $font(20)
              },
              layout: function (make, view) {
                make.centerX.equalTo(0)
                make.top.offset(16)
                // make.left.equalTo(160)
                // make.top.right.inset(8)
                make.height.equalTo(24)
              }
            },
            {
              type: "label",
              props: {
                id: "content",
                textColor: $color("#888888"),
                font: $font(15)
              }, // 比赛时间 id content
              layout: function (make, view) {
                make.top.equalTo(48)
                make.centerX.equalTo(0) // 居中
                make.bottom.equalTo(-2);
              }
            },
            {
              type: "label",
              props: {
                id: "onewinscore", //一队比分
                textColor: $color("#888888"),
                font: $font(25)
              },
              layout: function (make) {
                //make.left.equalTo(40)
                make.left.inset(48)
                make.top.inset(10)
                make.height.equalTo(40)
              }
            },
            {
              type: "image",
              props: {
                id: "oneicon", //一队图标
                radius: 20
              },
              layout: function (make, view) {
                make.left.equalTo(100);
                make.top.equalTo(8);
                make.size.equalTo(40)
              }
            },
            {
              type: "image",
              props: {
                id: "twoicon", //二队图标
                radius: 20
              },
              layout: function (make, view) {
                make.right.inset(100);
                make.top.equalTo(8);
                make.size.equalTo(40)
              }
            },
            {
              type: "label",
              props: {
                id: "towwinscore", //二队比分
                textColor: $color("#888888"),
                font: $font(25)
              }, // 右边比分
              layout: function (make) {
                //make.right.equalTo(40)
                make.right.inset(48)
                make.top.inset(10)
                make.height.equalTo(40)
              }
            }
          ],
          data: [{
            rows: rowToDayList
          }]
        },
        layout: function (make, view) {
          make.left.right.equalTo(0);
          make.top.equalTo(45);
          make.height.equalTo(view.super);
        },
        events: {
          didSelect: function (tableView, indexPath) {
            var row = indexPath.row;
            var scheduleid = rowToDayList[row].scheduleid.text;
            console.log(scheduleid)
            $app.openBrowser({
              type: 10000,
              url: "http://www.wanplus.com/schedule/" + scheduleid + ".html"
            })
          }
        }
      },
      {
        type: "button",
        props: {
          title: prevdate,
          info: {
            prevtime: prevtime
          }
        },
        layout: function (make, view) {
          make.left.equalTo(30);
          make.bottom.equalTo(-20);
          make.height.equalTo(40);
        },
        events: {
          tapped: function (sender) {
            var prevtime=sender.info.prevtime; //上周时间戳
            console.log(prevtime);
            $ui.toast(prevtime + " 功能待添加");
          }
        }
      },
      {
        type: "button",
        props: {
          title: nextdate,
          info: {
            nexttime: nexttime
          }
        },
        layout: function (make, view) {
          make.right.equalTo(-30);
          make.bottom.equalTo(-20);
          make.height.equalTo(40);
        },
        events: {
          tapped: function (sender) {
            console.log(sender.info.nexttime); //下周时间戳
            $ui.toast(sender.info.nexttime + " 功能待添加")
          }
        }
      }
    ]
  })
  if (toDayData.list == false) {
    return $ui.toast("无数据");
  }
}
