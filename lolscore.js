//https://github.com/wlor0623/jsbox/edit/master/lolscore.js
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
    render(resp, 0);
  }
})

function render(resp, dateIndex) {
  var data = resp.data
  console.log(data)
  var prevdate = data.data.prevdate; //上周时间
  var nextdate = data.data.nextdate; //下周时间
  var timeArr = [] //取时间值
  var timeDataArr = []; //数据值
  var rowsData = []; //列表信息
  var scheduleList = data.data.scheduleList;
  for (var key in scheduleList) {
    timeArr.push(key);
    timeDataArr.push(scheduleList[key]);
  }
  // ---无比赛过滤器
  var timeTArr=[];
  var timeTDataArr=[];
  for (var i = 0; i < timeDataArr.length; i++) {
    if (timeDataArr[i].list != false){
      timeTArr.push(timeArr[i]);
      timeTDataArr.push(timeDataArr[i]);
    }
  }
  // ---过滤器end
  var toDayData = timeTDataArr[dateIndex]; //当天数据
  var headerDateTip = toDayData.lDate; //头部日期提示
  var toDayList = toDayData.list; //当天比赛数据
  var rowToDayList = []; //每行比赛数据
  for (var i = 0; i < toDayList.length; i++) {
    var obj = {};
    obj.title = {};
    obj.content = {};
    obj.onewinscore = {};
    obj.towwinscore = {};
    obj.scheduleid = {},
    obj.title.text = toDayList[i].oneseedname + "-vs-" + toDayList[i].twoseedname
    obj.content.text = toDayList[i].starttime
    obj.onewinscore.text = toDayList[i].onewin + "  [ " + toDayList[i].oneScore + " ]";
    obj.towwinscore.text = toDayList[i].twowin + "  [ " + toDayList[i].twoScore + " ]";
    obj.scheduleid.text = toDayList[i].scheduleid
    rowToDayList.push(obj);
  }
  $ui.render({
    views: [{
        type: "menu",
        props: {
          items: timeTArr,
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
          rowHeight: 64,
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
          footer: {
            type: "label",
            props: {
              height: 20,
              text: "-我是有底线的-",
              textColor: $color("#AAAAAA"),
              align: $align.center,
              font: $font(12)
            }
          },
          template: [{
              type: "label",
              props: {
                id: "title",
                font: $font(20)
              },
              layout: function (make, view) {
                make.center.equalTo(view.super)
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
              },
              layout: function (make, view) {
                make.left.right.equalTo(180);
                make.bottom.equalTo(0);
              }
            },
            {
              type: "label",
              props: {
                id: "onewinscore",
                textColor: $color("#888888"),
                font: $font(15)
              },
              layout: function (make) {
                make.left.equalTo(10)
                make.top.right.inset(8)
                make.height.equalTo(40)
              }
            },
            {
              type: "label",
              props: {
                id: "towwinscore",
                textColor: $color("#888888"),
                font: $font(15)
              },
              layout: function (make) {
                make.right.equalTo(10)
                make.top.right.inset(8)
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
          make.bottom.equalTo(100);
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
          title: prevdate
        },
        layout: function (make, view) {
          make.left.equalTo(30);
          make.bottom.equalTo(-20);
          make.height.equalTo(40);
        },
        events: {
          tapped: function (sender) {
            $ui.toast("Tapped")
          }
        }
      },
      {
        type: "button",
        props: {
          title: nextdate
        },
        layout: function (make, view) {
          make.right.equalTo(-30);
          make.bottom.equalTo(-20);
          make.height.equalTo(40);
        },
        events: {
          tapped: function (sender) {
            $ui.toast("Tapped")
          }
        }
      }
    ]
  })
  if (toDayData.list == false) {
    return $ui.toast("无数据");
  }
}
