const version = 1.0;
//检测扩展更新
scriptVersionUpdate();
const vedioListUrl =
  "https://app.bilibili.com/x/feed/index?build=6190&network=wifi&platform=ios"; //列表
const hotListUrl = "https://app.bilibili.com/x/v2/rank?order=all&pn=0&ps=100"; //排行榜
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
let aid = 0;
getlistData(vedioListUrl);

function getlistData(url) {
  $ui.loading("加载中");
  $http.get({
    url: url,
    handler: function (resp) {
      var data = resp.data;
      if (data.code == 0) {
        var data = data.data;
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
          if (data[i].is_ad != "") {
            if (data[i].is_ad != true && data[i].duration != undefined) {
              var obj = {
                cover_duration_title: {
                  text: data[i].title //标题
                },
                cover_duration_play: {
                  text: data[i].play > 10000 ?
                    Math.ceil(data[i].play / 1000) / 10 + "万" : " " + data[i].play + "次" //播放量
                },
                cover_duration_duration: {
                  text: s_to_m_s(data[i].duration) //时长
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
              };
              listData.push(obj);
            }
          }
        }
        //首次加载需要渲染视图
        if (firstLoad) {
          //首次加载需要更多数据
          getlistData(vedioListUrl);
          render(listData);
          firstLoad = false;
        } else {
          $("vedioList").data = listData;
        }
      }
    }
  });
}

//渲染
function render(listData) {
  $ui.render({
    type: "view",
    props: {
      bgcolor: $color("#f3f4f4"),
      title: "首页",
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
                  borderColor: $color("#e1e1e1")
                },
                views: [{
                  type: "image",
                  props: {
                    id: "cover_item_image"
                  },
                  layout: function (make, view) {
                    make.top.left.right.equalTo(0);
                    make.height.equalTo(100);
                  }
                }],
                layout: function (make, view) {
                  make.top.bottom.left.right.equalTo(0);
                  make.height.equalTo(view.super);
                  make.width.equalTo(view.super);
                }
              },
              {
                type: "view",
                props: {
                  font: $font(10)
                },
                views: [{
                    type: "label", //半透明注释内容 (视频时间)
                    props: {
                      font: $font(12),
                      lines: 0,
                      textColor: $color("#f5f5f5")
                    },
                    views: [{
                      type: "label", // 视频时长
                      props: {
                        id: "cover_duration_duration",
                        font: $font(12),
                        radius: 5,
                        bgcolor: $rgba(0, 0, 0, 0.5),
                        textColor: $color("#f5f5f5"),
                        align: $align.center
                      },
                      layout: function (make, view) {
                        make.top.equalTo(0);
                        make.right.equalTo(0);
                        make.height.equalTo(20);
                        make.width.equalTo(40);
                      }
                    }],
                    layout: function (make, view) {
                      make.top.equalTo(-20);
                      make.height.equalTo(20);
                      make.width.equalTo(view.super);
                    }
                  },
                  {
                    type: "label", //视频标题
                    props: {
                      id: "cover_duration_title",
                      font: $font(12),
                      lines: 0,
                      align: $align.center
                    },
                    layout: function (make, view) {
                      make.left.right.inset(5);
                      make.top.equalTo(10);
                      make.height.equalTo(30);
                    }
                  },
                  {
                    type: "label", //视频up主
                    props: {
                      id: "cover_item_name",
                      font: $font(12),
                      align: $align.left
                    },
                    layout: function (make, view) {
                      make.left.right.inset(5);
                      make.top.equalTo(40);
                      make.height.equalTo(30);
                    }
                  },
                  {
                    type: "label", //视频发布时间
                    props: {
                      id: "cover_item_ctime",
                      font: $font(12),
                      align: $align.right
                    },
                    layout: function (make, view) {
                      make.left.right.inset(5);
                      make.top.equalTo(40);
                      make.height.equalTo(30);
                    }
                  },
                  {
                    type: "label", //视频标签
                    props: {
                      id: "cover_item_tag_name",
                      font: $font(12),
                      bgcolor: $color("#eee"),
                      align: $align.center,
                      radius: 10
                    },
                    layout: function (make, view) {
                      make.top.equalTo(70);
                      make.left.inset(5);
                      make.height.equalTo(20);
                      make.width.greaterThanOrEqualTo(40);
                    }
                  },
                  {
                    type: "label", // 播放量
                    props: {
                      id: "cover_duration_play",
                      font: $font(12),
                      bgcolor: $color("#eee"),
                      align: $align.center,
                      radius: 10
                    },
                    layout: function (make, view) {
                      make.top.equalTo(70);
                      make.right.inset(5);
                      make.height.equalTo(20);
                      make.width.greaterThanOrEqualTo(40);
                    }
                  }
                ],
                layout: function (make, view) {
                  make.top.equalTo(100);
                  make.left.right.bottom.equalTo(0);
                }
              }
            ]
          }
        },
        layout: function (make, view) {
          make.top.left.right.equalTo(0);
          make.bottom.equalTo(-60);
        },
        events: {
          didReachBottom: function (sender) {
            getlistData(vedioListUrl);
            sender.endFetchingMore()
          },
          didSelect: function (sender, indexPath, data) {
            //打开网页
            aid = data.cover_item_param.text;
            let pageTitle=data.cover_duration_title.text;//设置标题
            $ui.push({
              props: {
                title: pageTitle,
                
              },
              views: [{
                  type: "web",
                  props: {
                    showsProgress: true,
                    inlineMedia: true,
                    scrollEnabled: false,
                    url: `https://m.bilibili.com/video/av${aid}.html`,
                    style: ".index__videoPage__src-videoPage-{padding-top:0px;}.player-container .player-box .display .load-layer>img{filter: none;-webkit-filter: none;}.index__player__src-videoPage-player- .index__videoTime__src-videoPage-player-{background-color: rgba(0,0,0,.3)}" //去除头部app推广
                  },
                  layout: function (make, view) {
                    make.height.equalTo(260);
                    make.width.equalTo(view.super);
                  }
                },
                {
                  type: "button",
                  props: {
                    title: "保存封面"
                  },
                  layout: function (make, view) {
                    make.top.equalTo(280);
                    make.width.equalTo(160);
                    make.height.equalTo(40);
                    make.left.equalTo(20);
                  },
                  events: {
                    tapped: function (sender) {
                      $ui.toast("正在获取..");
                      $ui.loading(true);
                      $http.get({
                        url: "http://www.galmoe.com/t.php?aid=" + aid,
                        handler: function (resp) {
                          var data = resp.data;
                          $ui.loading(false);
                          if (data.result == 1) {
                            let url = data.url;
                            saveImage(url);
                          } else {
                            $ui.alert("封面获取失败！:(");
                          }
                        }
                      });
                    }
                  }
                },
                {
                  type: "button",
                  props: {
                    title: "跳转客户端",
                    bgcolor: $color("#e9799b")
                  },
                  layout: function (make, view) {
                    make.top.equalTo(280);
                    make.width.equalTo(160);
                    make.height.equalTo(40);
                    make.right.equalTo(-20);
                  },
                  events: {
                    tapped: function (sender) {
                      let urlScheme = "bilibili://?av=" + aid;
                      $app.openURL(urlScheme);
                    }
                  }
                }
              ],
              layout: function (make, view) {
                make.top.left.bottom.right.equalTo(0);
              }
            });
          }
        }
      },
      {
        type: "menu",
        props: {
          items: ["首页", "分类", "排行榜", "我"],
          borderColor: $color('#eee')
        },
        layout: function (make) {
          make.left.bottom.right.equalTo(0);
          make.height.equalTo(60);
        },
        events: {
          changed: function (sender) {
            var items = sender.items;
            var index = sender.index;
            if(index==2){
              getHotList();//排行榜
            }
          }
        }
      }
    ]
  });
}

//秒数转为 00:00
function s_to_m_s(s) {
  let min = Math.floor(s / 60);
  min = min < 10 ? "0" + min : min;
  let sec = s % 60;
  sec = sec < 10 ? "0" + sec : sec;
  return min + ":" + sec;
}
//时间戳转换
function ms_To_ymd(timestamp) {
  let date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  M =
    (date.getMonth() + 1 < 10 ?
      "0" + (date.getMonth() + 1) :
      date.getMonth() + 1) + "-";
  D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate() + " ";

  return M + D;
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
                let url =
                  "jsbox://install?url=https://raw.githubusercontent.com/wlor0623/jsbox/master/bilibili/bilibili.js&name=bilibili" +
                  afterVersion +
                  "&icon=icon_014.png";
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
// 保存图片
function saveImage(imgUrl) {
  $http.download({
    url: imgUrl,
    progress: function (bytesWritten, totalBytes) {
      var percentage = bytesWritten * 1.0 / totalBytes;
    },
    handler: function (resp) {
      $photo.save({
        data: resp.data,
        handler: function (success) {
          $ui.loading(false);
          if (success == 1) {
            $ui.alert("封面保存成功");
          } else {
            $ui.alert("保存失败!");
          }
        }
      });
    }
  });
}

// 获取排行榜数据
function getHotList() {
  $http.get({
    url: "https://app.bilibili.com/x/v2/rank?order=all&pn=0&ps=100",
    handler: function (resp) {
      let res = resp.data;
      let hotList = [];
      if (res.code == 0) {
        let data = res.data;
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          let obj = {
            cover_item_image: {
              src: data[i].cover, //封面
            },
            cover_duration_title: {
              text: ""+data[i].title //标题
            },
            cover_item_name: {
              text: "" + data[i].name //up主
            },
            cover_item_param: {
              text: ""+data[i].param //av 号
            },
            cover_item_ranking: {
              text: i + 1+""//排名
            },
            cover_duration_duration: {
              text: s_to_m_s(data[i].duration) //时长
            },
            cover_duration_play: {
              text: data[i].play > 10000 ?
                Math.ceil(data[i].play / 1000) / 10 + "万" : " " + data[i].play + "次" //播放量
            },
            cover_item_danmu: {
              text: "弹幕:"+data[i].danmaku //弹幕数量
            },
            cover_item_tag_name: {
              text: data[i].rname //标签
            },
            cover_item_ctime: {
              text: ms_To_ymd(data[i].pubdate) //发布时间
            },
          }
          hotList.push(obj);
        }
        console.log(hotList);
        pushView(hotList);
      }
    }
  })
}
// push
function pushView(hotList) {
  $ui.push({
    props: {
      title: "排行榜",
    },
    views: [{
      type: "view",
      props: {

      },
      views: [{
        type: "matrix",
        props: {
          id: 'hotList',
          columns: 1,
          data: hotList,
          bgcolor: $color("#f3f4f4"),
          itemHeight: 100, //高
          spacing: 10, //间隔
          square: false,
          radius: 10, //圆角,
          template: {
            props: {
              bgcolor: $color('#fff'),
              radius: 10, //圆角,
            },
            views: [{
                type: "image", //左封面
                props: {
                  id: "cover_item_image",
                  

                },
                layout: function (make, view) {
                  make.height.equalTo(view.super);
                  make.width.equalTo(180);
                  make.left.top.bottom.equalTo(0);
                }
              },{
                type: "label", //播放时间
                props: {
                  id:"cover_duration_duration",
                  bgcolor: $rgba(0, 0, 0, 0.5),
                  align: $align.center,
                  textColor:$color('#fff'),
                  font: $font(14),
                },
                layout: function (make, view) {
                  make.left.equalTo(0);
                  make.height.equalTo(30);
                  make.top.equalTo(70);
                  make.width.equalTo(50);
                }
              },{
                type: "label", //排名
                props: {
                  id:"cover_item_ranking",
                  bgcolor:$color('#e9799b'),
                  align: $align.center,
                  textColor:$color('#fff'),
                  font: $font(14),
                },
                layout: function (make, view) {
                  make.left.equalTo(150);
                  make.height.equalTo(30);
                  make.top.equalTo(70);
                  make.width.equalTo(30);
                }
              },
              {
                type: "view", //右侧盒子
                props: {
                  bgcolor: $color('#fff'),
                  
                },
                views: [{
                  type: "label",
                  props: {
                    id: "cover_duration_title", //标题
                    align: $align.center,
                    font: $font(14),
                  },
                  layout: function (make, view) {
                    make.top.left.right.equalTo(0);
                    make.height.equalTo(30);
                  }
                }, {
                  type: "label",
                  props: {
                    id: "cover_item_name", //up主
                    font: $font(14),
                    textColor: $color('#adadad'),
                    align: $align.center
                  },
                  layout: function (make, view) {
                    make.left.right.equalTo(0);
                    make.top.equalTo(30);
                    make.height.equalTo(30);
                  }
                }, {
                  type: "label",
                  props: {
                    id: "cover_item_tag_name", //标签
                    font: $font(14),
                    textColor: $color('#adadad'),
                    align: $align.left
                  },
                  layout: function (make, view) {
                    make.left.right.equalTo(10);
                    make.top.equalTo(80);
                    make.height.equalTo(20);
                  }
                }, {
                  type: "label",
                  props: {
                    id: "cover_duration_play", //播放量
                    font: $font(14),
                    textColor: $color('#adadad'),
                    align: $align.right
                  },
                  layout: function (make, view) {
                    make.left.right.equalTo(0);
                    make.top.equalTo(60);
                    make.height.equalTo(20);
                  }
                },{
                  type: "label",
                  props: {
                    id: "cover_item_ctime", //发布时间
                    font: $font(14),
                    textColor: $color('#adadad'),
                    align: $align.left
                  },
                  layout: function (make, view) {
                    make.left.right.equalTo(10);
                    make.top.equalTo(60);
                    make.height.equalTo(20);
                  }
                },  {
                  type: "label",
                  props: {
                    id: "cover_item_danmu", //弹幕数
                    font: $font(14),
                    textColor: $color('#adadad'),
                    align: $align.right
                  },
                  layout: function (make, view) {
                    make.left.right.equalTo(0);
                    make.top.equalTo(80);
                    make.height.equalTo(20);
                  }
                }],
                layout: function (make, view) {
                  make.left.equalTo(180);
                  make.top.bottom.right.equalTo(0)
                }
              },
            ],
            layout: function (make, view) {
              make.left.right.top.bottom.equalTo(0);
            },
          }
        },
        events: {
          // didReachBottom: function (sender) {},
          didSelect: function (sender, indexPath, data) {
            //打开网页
            aid = data.cover_item_param.text;
            $ui.push({
              views: [{
                  type: "web",
                  props: {
                    showsProgress: true,
                    inlineMedia: true,
                    scrollEnabled: false,
                    url: `https://m.bilibili.com/video/av${aid}.html`,
                    style: ".index__videoPage__src-videoPage-{padding-top:0px;}" //去除头部app推广
                  },
                  layout: function (make, view) {
                    make.height.equalTo(260);
                    make.width.equalTo(view.super);
                  }
                },
                {
                  type: "button",
                  props: {
                    title: "保存封面"
                  },
                  layout: function (make, view) {
                    make.top.equalTo(280);
                    make.width.equalTo(160);
                    make.height.equalTo(40);
                    make.left.equalTo(20);
                  },
                  events: {
                    tapped: function (sender) {
                      $ui.toast("正在获取..");
                      $ui.loading(true);
                      $http.get({
                        url: "http://www.galmoe.com/t.php?aid=" + aid,
                        handler: function (resp) {
                          var data = resp.data;
                          $ui.loading(false);
                          if (data.result == 1) {
                            let url = data.url;
                            saveImage(url);
                          } else {
                            $ui.alert("封面获取失败！:(");
                          }
                        }
                      });
                    }
                  }
                },
                {
                  type: "button",
                  props: {
                    title: "跳转客户端",
                    bgcolor: $color("#da5380")
                  },
                  layout: function (make, view) {
                    make.top.equalTo(280);
                    make.width.equalTo(160);
                    make.height.equalTo(40);
                    make.right.equalTo(-20);
                  },
                  events: {
                    tapped: function (sender) {
                      let urlScheme = "bilibili://?av=" + aid;
                      $app.openURL(urlScheme);
                    }
                  }
                }
              ],
              layout: function (make, view) {
                make.top.left.bottom.right.equalTo(0);
              }
            });
          }
        },
        layout: function (make, view) {
          make.top.bottom.left.right.equalTo(0)
        },
      }],
      layout: function (make, view) {
        make.top.bottom.left.right.equalTo(0)
      },
    }]
  })
}
