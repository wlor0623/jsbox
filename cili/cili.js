const version = 1.01; //版本号
scriptVersionUpdate()
const urls = [{
    name: "磁力猫",
    pattern: "http://www.cilimao.me/api/search?size=10&sortDirections=desc&page=0&word="
  },
  {
    name: "种子搜",
    pattern: "http://bt.xiandan.in/api/search?source=%E7%A7%8D%E5%AD%90%E6%90%9C&page=1&keyword="
  },
  {
    name: "磁力吧",
    pattern: "http://bt.xiandan.in/api/search?source=%E7%A3%81%E5%8A%9B%E5%90%A7&page=1&keyword="
  },
  {
    name: "BT兔子",
    pattern: "http://bt.xiandan.in/api/search?source=BT%E5%85%94%E5%AD%90&page=1&keyword="
  }
];
let nameList = [];
let dIndex = 0;
let texts = "";
let query = $context.query;
let pageNum=0;
for (let i = 0; i < urls.length; i++) {
  nameList[i] = urls[i].name;
}
if (query.fhcode) {
  search(dIndex, query.fhcode);
} else {
  clipboardDetect();
}

// 弹出
function inputpop() {
  $input.text({
    handler: function (text) {
      texts = encodeURI(text);
      //如果直接按完成 则获取剪贴板内容搜索
      if (texts == "") {
        let texts = $clipboard.text;
        return search(dIndex, texts);
      } else {
        //如果输入了内容
        search(dIndex, texts);
      }
    }
  });
}
// 搜索
function search(dIndex, word) {
  let rowsData = [];
  //加载提示
  $ui.loading("加载中...");
  $http.get({
    url: `${urls[dIndex].pattern}${word}`
  }).then(function (resp) {
    var data = resp.data;
    $ui.loading(false);
    if (dIndex == 0) {
      let item = data.data.result.content;
      for (let i = 0; i < item.length; i++) {
        let obj = {};
        obj.title = {};
        obj.content = {};
        obj.magnet = {};
        obj.date = {};
        obj.title.text = item[i].title;
        let size = "";
        if ((item[i].content_size / 1048576).toFixed(2) < 1) {
          size = "百度网盘";
        } else {
          size = (item[i].content_size / 1048576).toFixed(2) + "MB";
        }
        obj.content.text = size;
        let magnet = "";
        if ((item[i].content_size / 1048576).toFixed(2) < 1) {
          magnet = "https://pan.baidu.com/s/" + item[i].shorturl;
        } else {
          magnet = "magnet:?xt=urn:btih:" + item[i].infohash;
        }
        (obj.date.text = item[i].created_time), (obj.magnet.text = magnet);
        rowsData.push(obj);
      }
    } else {
      let item = data.results;
      for (let i = 0; i < item.length; i++) {
        let obj = {};
        obj.title = {};
        obj.content = {};
        obj.magnet = {};
        obj.date = {};
        obj.title.text = item[i].name;
        obj.content.text = item[i].formatSize;
        obj.magnet.text = item[i].magnet;
        obj.date.text = item[i].count;
        rowsData.push(obj);
      }
    }
    $ui.render({
      views: [{
          type: "menu",
          props: {
            items: nameList,
            index: dIndex
          },
          layout: function (make) {
            make.left.top.right.equalTo(0);
            make.height.equalTo(44);
          },
          events: {
            changed: function (sender) {
              let items = sender.items;
              let index = sender.index;
              search(index, word);
            }
          }
        },
        {
          type: "list",
          props: {
            grouped: true,
            rowHeight: 64,
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
                layout: function (make) {
                  make.left.equalTo(10);
                  make.top.right.inset(8);
                  make.height.equalTo(24);
                }
              },
              {
                type: "label",
                props: {
                  id: "content",
                  textColor: $color("#888888"),
                  font: $font(15)
                },
                layout: function (make) {
                  make.left.right.equalTo($("title"));
                  make.top.equalTo($("title").bottom);
                  make.bottom.equalTo(0);
                }
              },
              {
                type: "label",
                props: {
                  id: "date",
                  textColor: $color("#888888"),
                  font: $font(15)
                },
                layout: function (make) {
                  make.right.equalTo($("content"));
                  make.top.equalTo($("title").bottom);
                  make.bottom.equalTo(0);
                }
              }
            ],
            data: [{
              rows: rowsData
            }]
          },
          layout: function (make, view) {
            make.left.right.equalTo(0);
            make.top.equalTo(45);
            // make.height.equalTo(view.super);
            make.bottom.equalTo(0);
          },
          events: {
            didSelect: function (tableView, indexPath, data) {
              let row = indexPath.row;
              if (rowsData[row].magnet.text) {
                $clipboard.text = rowsData[row].magnet.text;
                tableView.delete(row);
                $ui.toast("复制成功!", 0.5);
              } else {
                return $ui.error("无数据!");
              }
            },
          },
          
        }
      ]
    });
  });
}

//剪贴板检测
function clipboardDetect() {
  var str = $clipboard.text;
  if (!str) {
    inputpop();
  }
  var reg1 = /[sS][nN][iI][sS][\s\-]?\d{3}|[aA][bB][pP][\s\-]?\d{3}|[iI][pP][zZ][\s\-]?\d{3}|[sS][wW][\s\-]?\d{3}|[jJ][uU][xX][\s\-]?\d{3}|[mM][iI][aA][dD][\s\-]?\d{3}|[mM][iI][dD][eE][\s\-]?\d{3}|[mM][iI][dD][dD][\s\-]?\d{3}|[pP][gG][dD][\s\-]?\d{3}|[sS][tT][aA][rR][\s\-]?\d{3}|[eE][bB][oO][dD][\s\-]?\d{3}|[iI][pP][tT][dD][\s\-]?\d{3}/g;
  var reg2 = /[a-zA-Z]{3,5}[\s\-]?\d{3,4}/g;
  var match = str.match(reg1);
  if (match) {
    clipboardTips(str);
  } else {
    var match = str.match(reg2);
    if (match) {
      clipboardTips(str);
    } else {
      inputpop();
    }
  }
}
// 提示
function clipboardTips(str) {
  $ui.alert({
    title: "提示",
    message: "是否使用剪贴板内容?",
    actions: [{
        title: "手动输入",
        handler: function () {
          inputpop();
        }
      },
      {
        title: "使用剪贴板内容",
        handler: function () {
          search(dIndex, str);
        }
      }
    ]
  });
}

//检测扩展更新
function scriptVersionUpdate() {
  $http.get({
    url: "https://raw.githubusercontent.com/wlor0623/jsbox/master/cili/updateInfo.js",
    handler: function (resp) {
      let afterVersion = resp.data.version;
      let msg = resp.data.msg;
      if (afterVersion > version) {
        $ui.alert({
          title: `检测到新的版本！V ${afterVersion}`,
          message: `是否更新?\n更新完成后请退出至扩展列表重新启动新版本。\n  ${msg}`,
          actions: [{
              title: "更新",
              handler: function () {
                let url = `jsbox://install?url=https://raw.githubusercontent.com/wlor0623/jsbox/master/cili/cili.js&name=cili ${afterVersion}&icon=icon_001.png`;
                $app.openURL(encodeURI(url));
                $app.close();
              }
            },
            {
              title: "取消"
            }
          ]
        });
      }
    }
  });
}
