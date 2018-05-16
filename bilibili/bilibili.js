var version = 1.2;
//检测扩展更新
scriptVersionUpdate();

// 剪贴板检测
clipboardDetect();

function render(id) {
  $http.get({
    url: "http://www.galmoe.com/t.php?aid=" + id,
    handler: function (resp) {
      var data = resp.data;
      console.log(data);
      if (data.result == 1) {
        let url = data.url;
        $ui.render({
          views: [{
              type: "image",
              props: {
                src: url
              },
              layout: function (make, view) {
                make.left.top.right.inset(10)
                make.size.equalTo($size(100, 200))
              }
            },
            {
              type: "button",
              props: {
                title: "下载封面"
              },
              layout: function (make, view) {
                make.center.equalTo(view.super)
                make.width.equalTo(120)
              },
              events: {
                tapped: function (sender) {
                  $ui.preview({
                    title: "URL",
                    url: url
                  })
                }
              }
            }
          ]
        })
      } else {
        $ui.alert("封面获取失败！")
      }
    }
  })
}

// 获取剪贴板文本
let text = $clipboard.link;
console.log(text);
// 弹出输入框
function inputpop() {
  $input.text({
    type: $kbType.number,
    placeholder: "输入要获取的av号",
    handler: function (text) {
      render(text)
    }
  })
}

// 剪贴板检测
function clipboardDetect() {
  var link = $clipboard.text;
  if (matchFun(link)) {
    $ui.alert({
      title: "提示",
      message: "检测到av号,是否手动输入?",
      actions: [{
          title: "从剪贴板获取",
          handler: function () {
            render(text); //有
          }
        },
        {
          title: "手动输入",
          handler: function () {
            inputpop(); //无
          }
        }
      ]
    })
  } else {
    inputpop(); //无
  }
}

// 正则过滤
function matchFun(link) {
  let reg = link.match("https://www.bilibili.com/video/av\\d{7,8}");
  if (reg != null) {
      return reg[0].slice(33);
  }
}

//检测扩展更新
function scriptVersionUpdate() {
  $http.get({
    url: "https://raw.githubusercontent.com/wlor0623/jsbox/master/bilibili/updateInfo.js",
    handler: function (resp) {
      var afterVersion = resp.data.version;
      var msg = resp.data.msg;
      if (afterVersion > version) {
        $ui.alert({
          title: "检测到新的版本！V" + afterVersion,
          message: "是否更新?\n更新完成后请退出至扩展列表重新启动新版本。\n" + msg,
          actions: [{
            title: "更新",
            handler: function () {
              var url = "jsbox://install?url=https://raw.githubusercontent.com/wlor0623/jsbox/master/bilibili/bilibili.js&name=哔哩哔哩封面提取v" + afterVersion + "&icon=icon_014.png";
              $app.openURL(encodeURI(url));
              $app.close()
            }
          }, {
            title: "取消"
          }]
        })
      }else{
        return;
      }
    }
  })
}
