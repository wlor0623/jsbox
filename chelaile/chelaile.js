const version = 1.4; //版本号
//检测扩展更新
scriptVersionUpdate();
$app.validEnv = $env.app;
var tip = "";
var weather = "";
var pageTitle = "";
var mainColor = "#508aeb";
var screenHeight = $device.info.screen.height - 40;
statistics()
getLocation();
function getLocation() {
  $location.fetch({
    handler: function(resp) {
      let lat = resp.lat;
      let lng = resp.lng;
      $location.stopUpdates();
      getCity(lat, lng);
    }
  });
}
async function getCity(lat, lng) {
  let resp = await $http.get(
    `https://api.chelaile.net.cn/goocity/city!localCity.action?s=IOS&gpsAccuracy=65.000000&gpstype=wgs&push_open=1&vc=10554&lat=${lat}&lng=${lng}`
  );
  let data = JSON.parse(resp.data.replace("**YGKJ", "").replace("YGKJ##", ""));
  let cityId = data.jsonr.data.localCity.cityId;
  pageTitle = ` ${data.jsonr.data.localCity.cityName}市`;
  let cityName = $text.URLEncode(data.jsonr.data.localCity.cityName);
  getWeather(lat, lng);
  renderMap(lat, lng, cityId, cityName);
}
function getWeather(lat, lng) {
  $http.get({
    url: `https://restapi.amap.com/v3/geocode/regeo?key=127caacaa204cc855a9bcdbc8ca06a49&location=${lng},${lat}`,
    handler: function(resp) {
      let data = resp.data;
      if (data.status == 1) {
        $("tips").text = `${data.regeocode.formatted_address}`;
      }
    }
  });
  $http.get({
    url: `https://api.caiyunapp.com/v2/Y2FpeXVuX25vdGlmeQ==/${lng},${lat}/forecast`,
    handler: function(resp) {
      let data = resp.data;
      if (data.status == "ok") {
        $("weather").text = data.result.forecast_keypoint;
      }
    }
  });
}

function renderMap(lat, lng, cityId, cityName) {
  const url = `http://web.chelaile.net.cn/ch5/index.html?showFav=1&switchCity=0&utm_source=webapp_meizu_map&showTopLogo=0&gpstype=wgs&src=webapp_meizu_map&utm_medium=menu&showHeader=1&hideFooter=1&cityName=${cityName}&cityId=${cityId}&supportSubway=1&cityVersion=0&lat=${lat}&lng=${lng}#!/linearound`;
  $ui.render({
    props: {
      type: "view",
      navBarHidden: true,
      bgcolor: $color(mainColor)
    },
    views: [
      {
        type: "label",
        props: {
          text: "",
          id: "close"
        },
        layout: function(make) {
          make.top.inset(30);
          make.right.inset(0);
          make.height.equalTo(30);
          make.width.equalTo(80);
        },
        events: {
          tapped: function() {
            $app.close(0);
          }
        }
      },
      {
        type: "button",
        props: {
          title: pageTitle,
          id: "cityName",
          textColor: $color("#fff"),
          bgcolor: $color("clear"),
          align: $align.center,
          font: $font(20)
        },
        layout: function(make) {
          make.top.inset(30);
          make.centerX.equalTo(0);
          make.height.equalTo(30);
        },
        events: {
          tapped: function() {
            getLocation();
          }
        }
      },
      {
        type: "label",
        props: {
          id: "tips",
          hidden: true,
          text: tip,
          lines: 0,
          textColor: $color("#fff"),
          align: $align.center
        },
        layout: function(make, view) {
          make.width.equalTo(view.super);
          make.height.equalTo(30);
          make.top.equalTo(60);
        }
      },
      {
        type: "label",
        props: {
          id: "weather",
          text: weather,
          lines: 0,
          hidden: true,
          textColor: $color("#fff"),
          align: $align.center
        },
        layout: function(make, view) {
          make.width.equalTo(view.super);
          make.height.equalTo(30);
          make.top.equalTo(90);
        }
      },
      {
        type: "web",
        props: {
          url: url,
          id: "webView",
          style: `.detail__bottom.show-fav .swap-container, .detail__bottom.show-fav .fav-container, .detail__bottom.show-fav .ads, .detail__bottom.show-fav .same-station-container, .detail__bottom.show-fav .refresh-container{background-color:transparent !important}.container{max-width:none}.page-list .switch-city{display:none;}.page-list .div-imitate-search-ui{padding:9px;}.around-refresh{background-color: ${mainColor}}.page-list .div-imitate-input{text-align: center;}`
        },
        layout: function(make, view) {
          make.top.equalTo($("cityName").bottom);
          make.left.right.equalTo(0);
          make.height.equalTo(screenHeight);
        },
        events: {
          didFinish: function(sender) {
            $("tips").hidden = false;
            $("weather").hidden = false;
            $delay(1, function() {
              sender.transparent = true;
            });
          }
        }
      }
    ]
  });
}

//检测扩展更新
function scriptVersionUpdate() {
  $http.get({
    url:
      "https://raw.githubusercontent.com/wlor0623/jsbox/master/chelaile/updateInfo.js",
    handler: function(resp) {
      let afterVersion = resp.data.version;
      let msg = resp.data.msg;
      if (afterVersion > version) {
        $ui.alert({
          title: `检测到新的版本！V ${afterVersion}`,
          message: `是否更新?\n更新完成后请退出至扩展列表重新启动新版本。\n  ${msg}`,
          actions: [
            {
              title: "更新",
              handler: function() {
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
// 统计
async function statistics() {
  let resp =await $http.get(`http://118.126.106.247:3333/tongji/cili`);
  console.log(resp.data);
}
