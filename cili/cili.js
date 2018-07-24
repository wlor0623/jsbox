const version = 1.3; //版本号
scriptVersionUpdate()
const urls = ["http://bt.xiandan.in/api/search?source=%E7%A7%8D%E5%AD%90%E6%90%9C&page=1",
  "http://bt.xiandan.in/api/search?source=%E7%A3%81%E5%8A%9B%E5%90%A7&page=1",
  "http://bt.xiandan.in/api/search?source=BT%E5%85%94%E5%AD%90&page=1",
  "http://bt.xiandan.in/api/search?source=BTDB&page=1",
  "http://bt.xiandan.in/api/search?source=BT4G&page=1"
];
var magnetArr = [];
var pageTitle = "";
var countIndex = 0;
var isLoading = true;
inputpop();
async function inputpop() {
  countIndex = 0;
  isLoading = true;
  $input.text({
    type: $kbType.url,
    placeholder: "输入内容",
    handler: function (text) {
      pageTitle = text;
      text = encodeURI(text)
      toSearh(text);
    }
  })
}
async function toSearh(text) {
  renderView();
  $ui.loading(true);
  magnetArr.length = 0;
  await search(text)
}

async function search(text) {
  for (let i = urls.length - 1; i >= 0; i--) {
    let resp = await $http.get({
      url: `${urls[i]}&keyword=${text}`
    })
    let data = resp.data.results;
    for (let i in data) {
      if (magnetArr.indexOf(data[i].magnet) == -1) {
        let obj = {
          name: {
            text: data[i].name
          },
          count: {
            text: data[i].count
          },
          formatSize: {
            text: data[i].formatSize
          },
          copy: {
            info: data[i].magnet
          },
          copyXL: {
            info: data[i].magnet
          }
        }
        $("dataList").insert({
          indexPath: $indexPath(0, countIndex),
          value: obj
        })
        countIndex++;
        magnetArr.push(data[i].magnet);
      }
    }
  }
  $ui.toast("加载完成");
  isLoading = false;
}

function renderView() {
  $ui.render({
    props: {
      navBarHidden: true,
      bgcolor: $color("#409eff")
    },
    views: [{
      type: "label",
      props: {
        text: "搜索",
        align: $align.right,
        textColor: $color("#f5f5f5"),
        font: $font(20),
      },
      layout: function (make, view) {
        make.top.inset(20);
        make.left.equalTo(0);
        make.width.equalTo(60);
        make.height.equalTo(40);
      },
      events: {
        tapped: function (sender) {
          inputpop();
        }
      }
    }, {
      type: "label",
      props: {
        text: pageTitle,
        align: $align.center,
        font: $font("bold", 20),
        textColor: $color("#f5f5f5")
      },
      layout: function (make, view) {
        make.top.inset(20);
        make.centerX.equalTo(0);
        make.height.equalTo(40);
      },
      events: {
        tapped: function (sender) {
          $app.close(0);
        }
      }
    }, {
      type: "label",
      props: {
        text: "关闭",
        align: $align.right,
        textColor: $color("#f5f5f5"),
        font: $font(20),
      },
      layout: function (make, view) {
        make.top.inset(20);
        make.right.inset(10);
        make.width.equalTo(60);
        make.height.equalTo(40);
      },
      events: {
        tapped: function (sender) {
          $app.close(0);
        }
      }
    }, {
      type: "matrix",
      props: {
        columns: 1,
        itemHeight: 100,
        spacing: 10,
        id: "dataList",
        template: {
          props: {
            radius: 10, //圆角,
            borderWidth: 1,
            borderColor: $color("#e8e8e8"),
          },
          views: [{
            type: "label",
            props: {
              id: "name",
              borderColor: $color("#e8e8e8"),
              align: $align.left,
              lines: 0,
              font: $font(14)
            },
            layout: function (make, view) {
              make.top.equalTo(0);
              make.left.inset(20);
              make.right.inset(20)
              make.height.equalTo(30);
            }
          }, {
            type: "label",
            props: {
              id: "formatSize",
              borderColor: $color("#e8e8e8"),
              align: $align.left,
              font: $font("bold", 14)
            },
            layout: function (make, view) {
              make.top.equalTo($("name").bottom);
              make.left.inset(20);
              make.height.equalTo(30);
            }
          }, {
            type: "label",
            props: {
              id: "count",
              borderColor: $color("#e8e8e8"),
              align: $align.right,
              font: $font("bold", 14),
              textColor: $color("##668fc1")
            },
            layout: function (make, view) {
              make.top.equalTo($("name").bottom);
              make.right.inset(20);
              make.height.equalTo(30);
            }
          }, {
            type: "button",
            props: {
              id: "copyXL",
              title: "到迅雷打开",
              bgcolor: $color("#409eff")
            },
            layout: function (make, view) {
              make.top.equalTo($("formatSize").bottom);
              make.left.inset(20);
              make.width.equalTo(100);
              make.height.equalTo(30);
            },
            events: {
              tapped: function (sender) {
                $clipboard.text = sender.info;
                if ($clipboard.text) {
                  $ui.toast("复制成功", 0.5);
                } else {
                  $ui.err("复制失败", 0.5)
                }
                $app.openURL(`thunder://${sender.info}`)
              }
            }
          }, {
            type: "button",
            props: {
              id: "copy",
              title: "复制链接",
              bgcolor: $color("#f56c6c")
            },
            layout: function (make, view) {
              make.top.equalTo($("count").bottom);
              make.right.inset(20);
              make.width.equalTo(100);
              make.height.equalTo(30);
            },
            events: {
              tapped: function (sender) {
                $clipboard.text = sender.info;
                if ($clipboard.text) {
                  $ui.toast("复制成功", 0.5);
                } else {
                  $ui.err("复制失败", 0.5)
                }
              }
            }
          }],
          layout: function (make, view) {},
        },
      },
      layout: function (make, view) {
        make.top.inset(60);
        make.left.right.bottom.inset(0);
      },
      events: {
        didSelect: function (sender, indexPath, data) {
          if (!isLoading) {
            let row = indexPath.row;
            sender.delete(row);
          }
        }
      }
    }],
    layout: $layout.fill,
  })
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
                let url = `jsbox://install?url=https://raw.githubusercontent.com/wlor0623/jsbox/master/cili/cili.js&name=磁力搜索&icon=icon_023.png`;
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
