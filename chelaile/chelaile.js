const version = 1.0; //版本号
//检测扩展更新
scriptVersionUpdate();

getLocation();
var tip = "";
var weather = "";
var pageTitle = "车来了";

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
  pageTitle = ` ${data.jsonr.data.localCity.cityName}市`;
  let cityName = $text.URLEncode(data.jsonr.data.localCity.cityName);
  getWeather(cityName)
  renderMap(lat, lng, cityId, cityName)
}

function getWeather(cityName) {
  $http.get({
    url: `https://www.sojson.com/open/api/weather/json.shtml?city=${cityName}`,
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
  const url = `http://web.chelaile.net.cn/ch5/index.html?utm_source=webapp_meizu_map&gpstype=wgs&src=webapp_meizu_map&utm_medium=menu&hideFooter=1&cityName=${cityName}&cityId=${cityId}&supportSubway=1&cityVersion=0&lat=${lat}&lng=${lng}#!/linearound`;
  $ui.render({
    props: {
      type: "view",
      navBarHidden: true,
      scrollEnabled: false,
      bgcolor: $color("#508aeb")
    },
    views: [{
        type: "label",
        props: {
          text: "关闭",
          textColor: $color('#fff'),
          align: $align.center,
          font: $font(20)
        },
        layout: function (make, view) {
          make.top.inset(22);
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
        type: "button",
        props: {
          title: pageTitle,
          textColor: $color('#fff'),
          bgcolor: $color("clear"),
          align: $align.center,
          font: $font(24),
        },
        layout: function (make, view) {
          make.top.inset(20);
          make.left.inset(15);
          make.height.equalTo(40)
        },
        events: {
          tapped: function (sender) {
            getLocation();
          }
        }
      }, {
        type: "label",
        props: {
          id: "weather",
          text: weather,
          lines: 0,
          hidden: true,
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
          hidden: true,
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
          hidden: true,
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
          style: ".page-list .ico-chelaile-container{display:none;}.page-list .switch-city{display:none;}.page-list .div-imitate-search-ui{padding:9px;}.around-refresh{background-color: #508aeb}"
        },
        layout: function (make, view) {
          make.top.inset(60);
          make.left.right.equalTo(0);
          make.bottom.equalTo(20);
        },
        events: {
          didFinish: function (sender, navigation) {
            $('Smile').hidden = false;
            $('tips').hidden = false;
            $('weather').hidden = false;
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
                let url = `jsbox://install?url=https://raw.githubusercontent.com/wlor0623/jsbox/master/chelaile/chelaile.js&name=车来了网页版&icon=icon_087.png`;
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
