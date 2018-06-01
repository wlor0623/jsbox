const version = 1.2;
//检测扩展更新
scriptVersionUpdate();

const vedioListUrl = "https://app.bilibili.com/x/feed/index?build=6190&network=wifi&platform=ios"//列表


//https://api.bilibili.com/x/v2/reply?oid=6666666&plat=3&pn=3&ps=20&sort=0&type=1 评论
//https://api.bilibili.com/x/article/categories     //分类?
// https://bangumi.bilibili.com/appindex/cinema/fall?platform=ios&region=index  //落 首页 电影
// https://bangumi.bilibili.com/appindex/follow_index_mine?access_key=611aaad5fb61b6494ce39b6d6ff9d4f3&pagesize=6   下一个索引
// https://bangumi.bilibili.com/appindex/cinema?platform=ios   //电影院
// https://bangumi.bilibili.com/appindex/follow_index_fall?mobi_app=iphone&pagesize=30   //指数
//https://api.live.bilibili.com/room/v1/AppIndex/getAllList?device=phone&platform=ios&scale=3   //房间  规模
// https://app.bilibili.com/x/v2/view/page?access_key=611aaad5fb61b6494ce39b6d6ff9d4f3&actionKey=appkey&aid=23977784&appkey=27eb53fc9058f8c3&build=6190&device=phone&mobi_app=iphone&platform=ios&sign=f1de6b939e8c99cca1085f354436690f&ts=1527855897
let listData = [];
let firstLoad = true;

getlistData();
s1.hdslb.com
function getlistData(sender) {
  $ui.loading("加载中");
  $http.get({
    url: vedioListUrl,
    handler: function (resp) {
      var data = resp.data;
      if (data.code == 0) {
        var data = data.data;
        console.log(data);

        // var bannerData = data[0].banner_item; //轮播数据
        // let banner_img = [];
        // for (let i = 0; i < bannerData.length; i++) {
        //   let obj = {
        //     type: "image",
        //     props: {
        //       url: bannerData[i].uri,
        //       src: bannerData[i].image
        //     },
        //   };
        //   banner_img.push(obj);
        // }
        for (let i = 1; i < data.length; i++) {
          //去广告标示
          if (data[i].is_ad != true && data[i].duration != undefined) {
            var obj = {
              cover_duration_title: {
                text: data[i].title //标题
              },
              cover_duration_play: {
                text:data[i].play > 10000?Math.ceil(data[i].play / 1000) / 10 + "万":" " + data[i].play + "次" //播放量
              },
              cover_duration_duration: {
                text: s_to_m_s(data[i].duration)//时长
              }, 
              cover_item_image: {
                src: data[i].cover //封面
              },
              cover_item_name: {
                text: "Up:" + data[i].name //up主
              },
              cover_item_tag_name: {
                text: data[i].tname //标签
              },
              cover_item_ctime: {
                text: ms_To_ymd(data[i].ctime) //发布时间
              },
              cover_item_param: {
                text: data[i].param //av 号
              },
              cover_item_danmu: {
                text: data[i].danmaku //弹幕数量
              }
             
            }
            listData.push(obj);
          }
        }

        //首次加载需要渲染视图
        if (firstLoad) {
          render(listData);
          firstLoad = false;
        } else {
          sender.endFetchingMore();
          $("vedioList").data = listData;
        }
      }
    }
  })
}

//轮播图      
function render(listData) {
  $ui.render({
    type: "view",
    props: {
      bgcolor: $color("#f3f4f4"),
    },
    views: [
      //   {
      //   type: "gallery", //banner广告
      //   props: {
      //     interval: 5,
      //     radius: 10.0,
      //     items: banner_img
      //   },
      //   layout: function (make, view) {
      //     make.top.left.right.inset(10);
      //     make.height.equalTo(140)
      //   },
      //   events: {
      //     tapped(sender) {

      //     },
      //   }
      // }, 
      {
        type: "matrix", //九宫格
        props: {
          id: "vedioList",
          data: listData,
          bgcolor: $color("#f3f4f4"),
          columns: 2,
          itemHeight: 200, //高
          spacing: 10, //间隔
          square: false,
          radius: 10, //圆角,
          template: {
            views: [{
              type: "view", //单个盒子
              props: {
                bgcolor: $color("#ffffff"),
                textColor: $color("#555555"),
                radius: 10,
                borderWidth: 1,
                borderColor: $color("#e1e1e1"),
              },
              views: [{
                type: "image",
                props: {
                  id: 'cover_item_image',
                },
                layout: function (make, view) {
                  make.top.left.right.equalTo(0);
                  make.height.equalTo(100);
                },
                events: {
                  tapped(sender) {
                    console.log(sender)
                  },
                }
              }],
              layout: function (make, view) {
                make.top.bottom.left.right.equalTo(0);
                make.height.equalTo(view.super);
                make.width.equalTo(view.super);
              }
            }, {
              type: "view",
              props: {
                font: $font(10),
              },
              views: [{
                type: "label", //半透明注释内容 (视频时间)
                props: {
                  font: $font(12),
                  lines: 0,
                  textColor: $color('#f5f5f5'),
                },
                views: [{
                  type: "label", // 视频时长
                  props: {
                    id: "cover_duration_duration",
                    font: $font(12),
                    radius: 5,
                    bgcolor: $rgba(0, 0, 0, 0.5),
                    textColor: $color('#f5f5f5'),
                    align: $align.center,
                  },
                  layout: function (make, view) {
                    make.top.equalTo(0);
                    make.right.equalTo(0);
                    make.height.equalTo(20);
                    make.width.equalTo(40)
                  }
                }],
                layout: function (make, view) {
                  make.top.equalTo(-20);
                  make.height.equalTo(20);
                  make.width.equalTo(view.super)
                }
              }, {
                type: "label", //视频标题
                props: {
                  id: 'cover_duration_title',
                  font: $font(12),
                  lines: 0,
                  align: $align.center
                },
                layout: function (make, view) {
                  make.left.right.inset(5);
                  make.top.equalTo(10);
                  make.height.equalTo(30);
                }
              }, {
                type: "label", //视频up主
                props: {
                  id: 'cover_item_name',
                  font: $font(12),
                  align: $align.left
                },
                layout: function (make, view) {
                  make.left.right.inset(5);
                  make.top.equalTo(40);
                  make.height.equalTo(30);
                }
              }, {
                type: "label", //视频发布时间
                props: {
                  id: 'cover_item_ctime',
                  font: $font(12),
                  align: $align.right
                },
                layout: function (make, view) {
                  make.left.right.inset(5);
                  make.top.equalTo(40);
                  make.height.equalTo(30);
                }
              }, {
                type: "label", //视频标签
                props: {
                  id: 'cover_item_tag_name',
                  font: $font(12),
                  bgcolor: $color('#eee'),
                  align: $align.center,
                  radius: 10,
                },
                layout: function (make, view) {
                  make.top.equalTo(70);
                  make.left.inset(5);
                  make.height.equalTo(20);
                  make.width.greaterThanOrEqualTo(40);
                }
              }, {
                type: "label", // 播放量
                props: {
                  id: "cover_duration_play",
                  font: $font(12),
                  bgcolor: $color('#eee'),
                  align: $align.center,
                  radius: 10,
                },
                layout: function (make, view) {
                  make.top.equalTo(70);
                  make.right.inset(5);
                  make.height.equalTo(20);
                  make.width.greaterThanOrEqualTo(40);
                }
              }],
              layout: function (make, view) {
                make.top.equalTo(100);
                make.left.right.bottom.equalTo(0);
              }
            }]
          }
        },
        layout: function (make, view) {
          make.top.left.bottom.right.equalTo(0);
        },
        events: {
          didReachBottom: function (sender) {
            getlistData(sender);
          },
          didSelect: function (sender, indexPath, data) {

          }
        }
      }
    ]
  })
}

//秒数转为 00:00
function s_to_m_s(s) {
  let min = Math.floor(s / 60);
  min = min < 10 ? '0' + min : min;
  let sec = (s % 60);
  sec = sec < 10 ? '0' + sec : sec;
  return min + ":" + sec
}
//时间戳转换
function ms_To_ymd(timestamp) {
  let date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  D = date.getDate()<10?"0"+date.getDate():date.getDate() + ' '

  return M + D
}

//检测扩展更新
function scriptVersionUpdate() {
    $http.get({
      url: "https://raw.githubusercontent.com/wlor0623/jsbox/master/bilibili/updateInfo.js",
      handler: function (resp) {
        let afterVersion = resp.data.version;
        let msg = resp.data.msg;
        if (afterVersion > version) {
          $ui.alert({
            title: "检测到新的版本！V" + afterVersion,
            message: "是否更新?\n更新完成后请退出至扩展列表重新启动新版本。\n" + msg,
            actions: [{
              title: "更新",
              handler: function () {
                let url = "jsbox://install?url=https://raw.githubusercontent.com/wlor0623/jsbox/master/bilibili/bilibili.js&name=哔哩哔哩封面提取v" + afterVersion + "&icon=icon_014.png";
                $app.openURL(encodeURI(url));
                $app.close()
              }
            }, {
              title: "取消"
            }]
          })
        }
      }
    })
  }
