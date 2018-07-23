const version = 1.2; //版本号
scriptVersionUpdate()
const urls = ["http://bt.xiandan.in/api/search?source=%E7%A7%8D%E5%AD%90%E6%90%9C&page=1",
  "http://bt.xiandan.in/api/search?source=%E7%A3%81%E5%8A%9B%E5%90%A7&page=1",
  "http://bt.xiandan.in/api/search?source=BT%E5%85%94%E5%AD%90&page=1",
  "http://bt.xiandan.in/api/search?source=BTDB&page=1",
  "http://bt.xiandan.in/api/search?source=BT4G&page=1"
];
var allArr = [];
var magnetArr = [];
var pageTitle="";
inputpop();
async function inputpop() {
  $input.text({
    type: $kbType.url,
    placeholder: "输入内容",
    handler: function (text) {
      pageTitle=text;
      text = encodeURI(text)
      toSearh(text);
    }
  })
}

async function toSearh(text) {
  $ui.loading(true)
  await search(text)
}

async function search(text) {
  for (var i = 0; i < urls.length; i++) {
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
          magnet: {
            text: data[i].magnet
          },
          count: {
            text: data[i].count
          },
          formatSize: {
            text: data[i].formatSize
          }
        }
        allArr.push(obj);
        magnetArr.push(data[i].magnet);
      }
    }
  }
  render();
  $('dataList').data = allArr;
}


function render() {
  $ui.render({
    props: {
      navBarHidden: true,
      bgcolor: $color("#2d9ae9")
    },
    views: [{
      type: "label",
      props: {
        text:pageTitle,
        align: $align.center,
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
        textColor: $color("#f5f5f5")
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
        itemHeight: 60,
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
              font: $font(16)
            },
            layout: function (make, view) {
              make.top.equalTo(0);
              make.left.inset(20);
              make.right.inset(100)
              make.height.equalTo(60);
            }
          }, {
            type: "label",
            props: {
              id: "formatSize",
              borderColor: $color("#e8e8e8"),
              align: $align.center,
              font: $font(14)
            },
            layout: function (make, view) {
              make.top.equalTo(0);
              make.right.inset(20);
              make.height.equalTo(30);
            }
          }, {
            type: "label",
            props: {
              id: "count",
              borderColor: $color("#e8e8e8"),
              align: $align.center,
              font: $font(14)
            },
            layout: function (make, view) {
              make.top.equalTo(30);
              make.right.inset(20);
              make.height.equalTo(30);
            }
          }],

        },

      },
      layout: function (make, view) {
        make.top.inset(60);
        make.left.right.bottom.inset(0);
      },
      events: {
        didSelect: function (sender, indexPath, data) {
          $clipboard.text = data.magnet.text;
          if ($clipboard.text) {
            let row = indexPath.row;
            sender.delete(row);
            $ui.toast("复制成功", 0.5);
          } else {
            $ui.err("复制失败", 0.5)
          }
        },

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
