
const version = 1.0;//版本号
//检测扩展更新
scriptVersionUpdate();
getLocation();
const phoneHeight=$device.info.screen.height
var tip = "";
var weather = "";
var pageTitle="车来了";
function getLocation() {
  $location.fetch({
    handler: function (resp) {
      let lat = resp.lat;
      let lng = resp.lng;
      getCity(lat, lng);
    }
  });
}

async function getCity(lat, lng) {
  let resp = await $http.get(`https://api.chelaile.net.cn/goocity/city!localCity.action?s=IOS&gpsAccuracy=65.000000&gpstype=wgs&push_open=1&vc=10554&lat=${lat}&lng=${lng}`)
  let data = JSON.parse(resp.data.replace("**YGKJ", "").replace("YGKJ##", ""));
  let cityId = data.jsonr.data.localCity.cityId;
  pageTitle=`${data.jsonr.data.localCity.cityName}交通`;
  let cityName = $text.URLEncode(data.jsonr.data.localCity.cityName);
  // getWeather()
  renderMap(lat, lng, cityId, cityName)
}

function getWeather() {
  $http.get({
    url: 'https://www.sojson.com/open/api/weather/json.shtml?city=%E6%B7%B1%E5%9C%B3%E5%B8%82',
    handler: function (resp) {
      let data = resp.data;
      tip = `${data.data.forecast[0].notice}`;
      weather = `${data.data.forecast[0].type} : ${data.data.wendu}℃`
      $('tips').text = tip;
      $('weather').text = weather;
    }
  })
}

function renderMap(lat, lng, cityId, cityName) {
  let url = `http://web.chelaile.net.cn/ch5/index.html?utm_source=webapp_meizu_map&src=webapp_meizu_map&utm_medium=menu&hideFooter=1&gpstype=gcj&cityName=${cityName}&cityId=${cityId}&supportSubway=1&cityVersion=0&lat=${lat}&lng=${lng}#!/linearound`;
  $ui.render({
    props: {
      type: "view",
      navBarHidden: true,
      scrollEnabled:false,
      bgcolor: $color("#508aeb")
    },
    views: [{
      type: "label",
      props: {
        text: "关闭",
        textColor:$color('#fff'),
        align:$align.center,
      },
      layout: function (make, view) {
        make.top.inset(20);
        make.right.inset(0);
        make.height.equalTo(40)
        make.width.equalTo(80);
      },
      events: {
        tapped: function (sender) {
          $app.close(0);
        }
      }
    },
    {
      type: "label",
      props: {
        text:pageTitle,
        id:"pageTitle",
        font:$font(18),
        textColor:$color('#fff'),
        align:$align.center,
      },
      layout: function (make, view) {
        make.centerX.equalTo(0);
        make.top.inset(20);
        make.height.equalTo(40)
        make.width.equalTo(100);
      },
    },
    {
      type: "label",
      props: {
        text:"刷新位置",
        textColor:$color('#fff'),
        align:$align.center,
      },
      layout: function (make, view) {
        make.top.inset(20);
        make.left.inset(0);
        make.height.equalTo(40)
        make.width.equalTo(80);
      },
      events: {
        tapped: function (sender) {
          getLocation()
        }
      }
    },{
        type: "label",
        props: {
          id: "weather",
          text: weather,
          lines: 0,
          textColor: $color('#fff'),
          align: $align.center
        },
        layout: function (make, view) {
          make.width.equalTo(view.super);
          make.height.equalTo(30);
          make.top.equalTo(60)
        }
      }, {
        type: "label",
        props: {
          id: "tips",
          text: tip,
          lines: 0,
          textColor: $color('#fff'),
          align: $align.center
        },
        layout: function (make, view) {
          make.width.equalTo(view.super);
          make.height.equalTo(30);
          make.top.equalTo(90)
        }
      }, {
        type: "label",
        props: {
          id: "Smile",
          text: '(σ・ω・)σ(',
          lines: 0,
          textColor: $color('#fff'),
          align: $align.center
        },
        layout: function (make, view) {
          make.width.equalTo(view.super);
          make.height.equalTo(30);
          make.top.equalTo(120)
        }
      },
      {
        type: "web",
        props: {
          url: url,
          id: "webView",
          contentSize:$size(0, 0),
          style:".page-list .ico-chelaile-container{display:none;}.page-list .switch-city{display:none;}.page-list .div-imitate-search-ui{padding:9px;}"
        },
        layout: function (make, view) {
          make.top.inset(60);
          make.left.right.equalTo(0);
          make.height.equalTo(phoneHeight-40)
        },
        events: {
          didFinish: function (sender, navigation) {
            sender.transparent = true;
          },
        }
      },
    ],
  });
}

//检测扩展更新
function scriptVersionUpdate() {
  $http.get({
    url: "https://raw.githubusercontent.com/wlor0623/jsbox/master/chelaile/updateInfo.js",
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
                let url = `jsbox://install?url=https://raw.githubusercontent.com/wlor0623/jsbox/master/chelaile/chelaile.js&name=%e8%bd%a6%e6%9d%a5%e4%ba%86&icon=icon_001.png`;
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
