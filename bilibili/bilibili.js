const version = 1.0;
//检测扩展更新
scriptVersionUpdate();
const vedioListUrl ="https://app.bilibili.com/x/feed/index?build=6190&network=wifi&platform=ios"; //列表
const hotListUrl = "https://app.bilibili.com/x/v2/rank?order=all&pn=0&ps=100"; //排行榜
let listData = [];
let firstLoad = true;
let aid = 0; //av号
let activeTab = 0; //默认tab index
start();
// 入口函数
function start(){
  getlistData(vedioListUrl);
}

//获取首页数据
function getlistData(url) {
  $ui.loading("加载中");
  $http.get({
    url: url,
    handler: function(resp) {
      let res = resp.data;
      if (res.code == 0) {
        var data = res.data;
        console.log("首页数据");
        console.log(data);
        var bannerData = data[0].banner_item; //轮播数据
        let banner_img = [];
        for (let i = 0; i < bannerData.length; i++) {
          let obj = {
            type: "image",
            props: {
              url: bannerData[i].uri,
              src: bannerData[i].image
            },
          };
          banner_img.push(obj);
        }
        
        for (let i = 1; i < data.length; i++) {
          //去广告标示
          if (data[i].is_ad != "") {
            if (data[i].is_ad != true && data[i].duration != undefined) {
              var obj = {
                cover_duration_title: {
                  text: data[i].title //标题
                },
                cover_duration_play: {
                  text:
                    data[i].play > 10000
                      ? Math.ceil(data[i].play / 1000) / 10 + "万"
                      : " " + data[i].play + "次" //播放量
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
      }else{
        return 
      }
    }
  });
}

//渲染首页
function render(listData) {
  $ui.render({
    type: "view",
    props: {
      bgcolor: $color("#f3f4f4"),
      title: "首页"
    },
    views: [
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
            views: [
              {
                type: "view", //单个盒子
                props: {
                  bgcolor: $color("#ffffff"),
                  textColor: $color("#555555"),
                  radius: 10,
                  borderWidth: 1,
                  borderColor: $color("#e1e1e1")
                },
                views: [
                  {
                    type: "image",
                    props: {
                      id: "cover_item_image"
                    },
                    layout: function(make, view) {
                      make.top.left.right.equalTo(0);
                      make.height.equalTo(100);
                    }
                  }
                ],
                layout: function(make, view) {
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
                views: [
                  {
                    type: "label", //半透明注释内容 (视频时间)
                    props: {
                      font: $font(12),
                      lines: 0,
                      textColor: $color("#f5f5f5")
                    },
                    views: [
                      {
                        type: "label", // 视频时长
                        props: {
                          id: "cover_duration_duration",
                          font: $font(12),
                          radius: 5,
                          bgcolor: $rgba(0, 0, 0, 0.5),
                          textColor: $color("#f5f5f5"),
                          align: $align.center
                        },
                        layout: function(make, view) {
                          make.top.equalTo(0);
                          make.right.equalTo(0);
                          make.height.equalTo(20);
                          make.width.equalTo(40);
                        }
                      }
                    ],
                    layout: function(make, view) {
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
                    layout: function(make, view) {
                      make.left.right.inset(5);
                      make.top.equalTo(10);
                      make.height.equalTo(30);
                    }
                  },
                  {
                    type: "label", //视频up主
                    props: {
                      id: "cover_item_name",
                      font: $font("Avenir-Light", 14),
                      align: $align.left
                    },
                    layout: function(make, view) {
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
                      align: $align.left,
                      textColor: $color("#f5f5f5"),
                      bgcolor: $rgba(0, 0, 0, 0.5)
                    },
                    layout: function(make, view) {}
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
                    layout: function(make, view) {
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
                    layout: function(make, view) {
                      make.top.equalTo(70);
                      make.right.inset(5);
                      make.height.equalTo(20);
                      make.width.greaterThanOrEqualTo(40);
                    }
                  }
                ],
                layout: function(make, view) {
                  make.top.equalTo(100);
                  make.left.right.bottom.equalTo(0);
                }
              }
            ]
          }
        },
        layout: function(make, view) {
          make.top.equalTo(0);
          make.left.right.equalTo(0);
          make.bottom.equalTo(-60);
        },
        events: {
          didReachBottom: function(sender) {
            $ui.toast("正在加载...",0.5);
            getlistData(vedioListUrl);
            sender.endFetchingMore();
          },
          didSelect: function(sender, indexPath, data) {
            //打开网页
            aid = data.cover_item_param.text;
            let pageTitle = data.cover_duration_title.text; //设置标题
            openUrlInfo(pageTitle);
          }
        }
      },
      {
        type: "menu",
        props: {
          items: ["首页", "搜索", "排行榜"],
          borderColor: $color("#eee"),
          index: activeTab
        },
        layout: function(make) {
          make.left.right.equalTo(0);
          make.bottom.equalTo(-5);
          make.height.equalTo(60);
        },
        events: {
          changed: function(sender) {
            var items = sender.items;
            var index = sender.index;
            activeTab = index;
            switch (index) {
              case 0:
                render(listData); //首页
                break;
              case 1:
                $input.text({
                  type: $kbType.search,
                  placeholder: "输入搜索内容",
                  handler: function(text) {
                    getSearchList(text); //搜索
                  }
                });
                break;
              case 2:
                getHotList(); //排行榜
                break;
              default:
            }
          }
        }
      },
      {
        type: "view",//回到顶部
        props: {
          bgcolor: $color("#999"),
          alpha:0.7,
          radius: 30, //圆角,
        },
        views:[{
          type: "label",
          props: {
            text: "↑",
            align: $align.center,
            textColor:$color('#fff')
          },
          layout: function(make, view) {
            make.center.equalTo(view.super)
          }
        }],
        layout: function(make, view) {
          make.right.equalTo(-20);
          make.bottom.equalTo(-90);
          make.size.equalTo($size(60, 60))
        },
        events: {
          tapped: function(sender) {
            $("vedioList").scrollTo({
              indexPath: $indexPath(0, 0),
              animated: true // 默认为 true
            })
          }
        }
      }
    ]
  });
}


let loadingFlag=true;
let hotList = [];
// 获取排行榜数据
function getHotList() {
  if(!loadingFlag){
    return  pushView(hotList,"排行榜");
  }
  $http.get({
    url: "https://app.bilibili.com/x/v2/rank?order=all&pn=0&ps=100",
    handler: function(resp) {
      let res = resp.data;
      if (res.code == 0) {
        loadingFlag=false;
        let data = res.data;
        console.log("排行榜数据");
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          let obj = {
            cover_item_image: {
              src: data[i].cover //封面
            },
            cover_duration_title: {
              text: "" + data[i].title //标题
            },
            cover_item_name: {
              text: "" + data[i].name //up主
            },
            cover_item_param: {
              text: "" + data[i].param //av 号
            },
            cover_item_ranking: {
              text: i + 1 + "" //排名
            },
            cover_duration_duration: {
              text: s_to_m_s(data[i].duration) //时长
            },
            cover_duration_play: {
              text:
                data[i].play > 10000
                  ? Math.ceil(data[i].play / 1000) / 10 + "万"
                  : " " + data[i].play + "次" //播放量
            },
            cover_item_danmu: {
              text: "弹幕:" + data[i].danmaku //弹幕数量
            },
            cover_item_tag_name: {
              text: data[i].rname //标签
            },
            cover_item_ctime: {
              text: ms_To_ymd(data[i].pubdate) //发布时间
            }
          };
          hotList.push(obj);
        }
        pushView(hotList,"排行榜");
      }
    }
  });
}
// push
function pushView(hotList,pageName) {
  $ui.render({
    props: {
      title: pageName
    },
    views: [
      {
        type: "view",
        props: {},
        views: [
          {
            type: "matrix",
            props: {
              id: "hotList",
              columns: 1,
              data: hotList,
              bgcolor: $color("#f3f4f4"),
              itemHeight: 100, //高
              spacing: 10, //间隔
              square: false,
              radius: 10, //圆角,
              template: {
                props: {
                  bgcolor: $color("#fff"),
                  radius: 10 //圆角,
                },
                views: [
                  {
                    type: "image", //左封面
                    props: {
                      id: "cover_item_image"
                    },
                    layout: function(make, view) {
                      make.height.equalTo(view.super);
                      make.width.equalTo(180);
                      make.left.top.bottom.equalTo(0);
                    }
                  },
                  {
                    type: "label", //播放时间
                    props: {
                      id: "cover_duration_duration",
                      bgcolor: $rgba(0, 0, 0, 0.5),
                      align: $align.center,
                      textColor: $color("#fff"),
                      font: $font(14)
                    },
                    layout: function(make, view) {
                      make.left.equalTo(0);
                      make.height.equalTo(30);
                      make.top.equalTo(70);
                      make.width.equalTo(50);
                    }
                  },
                  {
                    type: "label", //排名
                    props: {
                      id: "cover_item_ranking",
                      bgcolor: $color("#e9799b"),
                      align: $align.center,
                      textColor: $color("#fff"),
                      font: $font(14)
                    },
                    layout: function(make, view) {
                      make.left.equalTo(150);
                      make.height.equalTo(30);
                      make.top.equalTo(70);
                      make.width.equalTo(30);
                    }
                  },
                  {
                    type: "view", //右侧盒子
                    props: {
                      bgcolor: $color("#fff")
                    },
                    views: [
                      {
                        type: "label",
                        props: {
                          id: "cover_duration_title", //标题
                          align: $align.center,
                          font: $font(14)
                        },
                        layout: function(make, view) {
                          make.top.left.right.equalTo(0);
                          make.height.equalTo(30);
                        }
                      },
                      {
                        type: "label",
                        props: {
                          id: "cover_item_name", //up主
                          font: $font(14),
                          textColor: $color("#adadad"),
                          align: $align.center
                        },
                        layout: function(make, view) {
                          make.left.right.equalTo(0);
                          make.top.equalTo(30);
                          make.height.equalTo(30);
                        }
                      },
                      {
                        type: "label",
                        props: {
                          id: "cover_item_tag_name", //标签
                          font: $font(14),
                          textColor: $color("#adadad"),
                          align: $align.left
                        },
                        layout: function(make, view) {
                          make.left.right.equalTo(10);
                          make.top.equalTo(80);
                          make.height.equalTo(20);
                        }
                      },
                      {
                        type: "label",
                        props: {
                          id: "cover_duration_play", //播放量
                          font: $font(14),
                          textColor: $color("#adadad"),
                          align: $align.right
                        },
                        layout: function(make, view) {
                          make.left.right.equalTo(0);
                          make.top.equalTo(60);
                          make.height.equalTo(20);
                        }
                      },
                      {
                        type: "label",
                        props: {
                          id: "cover_item_ctime", //发布时间
                          font: $font(14),
                          textColor: $color("#adadad"),
                          align: $align.left
                        },
                        layout: function(make, view) {
                          make.left.equalTo(10);
                          make.width.equalTo(130);
                          make.top.equalTo(60);
                          make.height.equalTo(20);
                        }
                      },
                      {
                        type: "label",
                        props: {
                          id: "cover_item_danmu", //弹幕数
                          font: $font(14),
                          textColor: $color("#adadad"),
                          align: $align.right
                        },
                        layout: function(make, view) {
                          make.left.right.equalTo(0);
                          make.top.equalTo(80);
                          make.height.equalTo(20);
                        }
                      }
                    ],
                    layout: function(make, view) {
                      make.left.equalTo(180);
                      make.top.bottom.right.equalTo(0);
                    }
                  }
                ]
              }
            },
            events: {
              // didReachBottom: function (sender) {},
              didSelect: function(sender, indexPath, data) {
                //打开网页
                aid = data.cover_item_param.text;
                let pageTitle = data.cover_duration_title.text; //设置标题
                openUrlInfo(pageTitle);
              }
            },
            layout: function(make, view) {
              make.top.left.right.equalTo(0);
              make.bottom.equalTo(-60);
            }
          },
          {
            type: "menu",
            props: {
              items: ["首页", "搜索", "排行榜"],
              borderColor: $color("#eee"),
              index: activeTab
            },
            layout: function(make) {
              make.left.right.equalTo(0);
              make.bottom.equalTo(-5);
              make.height.equalTo(60);
            },
            events: {
              changed: function(sender) {
                var items = sender.items;
                var index = sender.index;
                activeTab = index;
                switch (index) {
                  case 0:
                    render(listData); //首页
                    break;
                  case 1:
                    $input.text({
                      type: $kbType.search,
                      placeholder: "输入搜索内容",
                      handler: function(text) {
                        getSearchList(text); //搜索
                      }
                    });
                    break;
                  case 2:
                    getHotList(); //排行榜
                    break;
                  default:
                    break;
                }
              }
            }
          },
          {
            type: "view",//回到顶部
            props: {
              bgcolor: $color("#999"),
              alpha:0.7,
              radius: 30, //圆角,
            },
            views:[{
              type: "label",
              props: {
                text: "↑",
                align: $align.center,
                textColor:$color('#fff')
              },
              layout: function(make, view) {
                make.center.equalTo(view.super)
              }
            }],
            layout: function(make, view) {
              make.right.equalTo(-20);
              make.bottom.equalTo(-90);
              make.size.equalTo($size(60, 60))
            },
            events: {
              tapped: function(sender) {
                $("hotList").scrollTo({
                  indexPath: $indexPath(0, 0),
                  animated: true // 默认为 true
                })
              }
            }
          }
        ],
        layout: function(make, view) {
          make.top.bottom.left.right.equalTo(0);
        }
      }
    ]
  });
}
let searchLists = [];
// 获取搜索数据
function getSearchList(keyword) {
  let pageName=keyword;
  keyword=$text.URLEncode(keyword);
  var searchUrl = `http://app.bilibili.com/x/v2/search?build=6199&keyword=${keyword}&pn=1&ps=20`;
  $http.get({
    url: searchUrl,
    handler: function(resp) {
      let res = resp.data;
      if (res.code == 0) {
        let data = res.data;
        console.log("搜索数据");
        console.log(data);
        let archives = data.items.archive;
        for (let i = 0; i < archives.length; i++) {
          var obj = {
            cover_item_image: {
              src: "https://" + archives[i].cover.substring(2) //封面
            },
            cover_duration_duration: {
              text: archives[i].duration //时长
            },
            cover_duration_title: {
              text: "" + archives[i].title //标题
            },
            cover_item_ranking: {
              text: i + 1 + "" //排名
            },
            cover_item_name: {
              text: "" + archives[i].author //up主
            },
            cover_item_param: {
              text: "" + archives[i].param //av 号
            },
            cover_item_danmu: {
              text: "弹幕:" + archives[i].danmaku //弹幕数量
            },
            cover_duration_play: {
              text:
                archives[i].play > 10000
                  ? Math.ceil(archives[i].play / 1000) / 10 + "万"
                  : " " + archives[i].play + "次" //播放量
            },
            cover_item_ctime: {
              text: archives[i].desc //发布时间
            }
          };
          searchLists.push(obj);
          pushView(searchLists,pageName);
        }
      }
    }
  });
}
//获取详情数据
function openUrlInfo(pageTitle) {
  let repliesList = [];

  $ui.push({
    props: {
      title: pageTitle
    },
    views: [
      {
        type: "web",
        props: {
          id: "vedioWeb",
          showsProgress: true,
          inlineMedia: false,
          scrollEnabled: false,
          canGoForward: false,
          canGoBack: false,
          url: `https://m.bilibili.com/video/av${aid}.html`,
          style:".index__videoPage__src-videoPage-{padding-top:0px;}.player-container .player-box .display .load-layer>img{filter: none;-webkit-filter: none;}.index__player__src-videoPage-player- .index__videoTime__src-videoPage-player-{background-color: rgba(0,0,0,.3)}" //去除头部app推广
        },
        layout: function(make, view) {
          make.top.equalTo(0);
          make.height.equalTo(260);
          make.width.equalTo(view.super);
        }
      },
      {
        type: "label",
        props: {
          text: pageTitle,
          font: $font(12),
          lines: 4,
          align: $align.center
        },
        layout: function(make, view) {
          make.top.equalTo(270);
          make.width.equalTo(view.super);
        }
      },
      {
        type: "button",
        props: {
          title: "保存封面",
          bgcolor: $color("#409eff")
        },
        layout: function(make, view) {
          make.top.equalTo(300);
          make.width.equalTo(160);
          make.height.equalTo(40);
          make.left.equalTo(20);
        },
        events: {
          tapped: function(sender) {
            $ui.toast("正在获取..");
            $ui.loading(true);
            $http.get({
              url: "http://www.galmoe.com/t.php?aid=" + aid,
              handler: function(resp) {
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
        layout: function(make, view) {
          make.top.equalTo(300);
          make.width.equalTo(160);
          make.height.equalTo(40);
          make.right.equalTo(-20);
        },
        events: {
          tapped: function(sender) {
            let urlScheme = "bilibili://?av=" + aid;
            $app.openURL(urlScheme);
          }
        }
      },
      {
        type: "button",
        props: {
          title: "刷新",
          bgcolor: $color("#909399")
        },
        layout: function(make, view) {
          make.top.equalTo(350);
          make.width.equalTo(160);
          make.height.equalTo(40);
          make.left.equalTo(20);
        },
        events: {
          tapped: function(sender) {
            $('vedioWeb').reload()
          }
        }
      },
      {
        type: "button",
        props: {
          title: "分享给朋友",
          bgcolor: $color("#f48081")
        },
        layout: function(make, view) {
          make.top.equalTo(350);
          make.width.equalTo(160);
          make.height.equalTo(40);
          make.right.equalTo(-20);
        },
        events: {
          tapped: function(sender) {
            let shareUrl = `https://m.bilibili.com/video/av${aid}.html`;
            $share.sheet(shareUrl);
          }
        }
      },
      {
        type: "matrix",
        props: {
          columns: 1,
          id: "repliesList", //评论区域
          bgcolor: $color("#f3f4f4"),
          itemHeight: 100, //高
          spacing: 10, //间隔
          square: false,
          radius: 10, //圆角,
          template: {
            props: {
              bgcolor: $color("#fff"),
              radius: 10
            },
            views: [
              {
                type: "label",
                props: {
                  id: "replies_content_message", //内容
                  font: $font(12),
                  lines: 4,
                  align: $align.center
                },
                layout: function(make, view) {
                  make.left.equalTo(5);
                  make.right.equalTo(-5);
                  make.height.equalTo(60);
                  make.top.equalTo(0);
                }
              },
              {
                type: "image",
                props: {
                  id: "replies_uimg", //头像
                  radius: 15,
                  borderWidth: 1,
                  borderColor: $color("#eee")
                },
                layout: function(make, view) {
                  make.right.equalTo(-10);
                  make.size.equalTo($size(30, 30));
                  make.top.equalTo(65);
                }
              },
              {
                type: "label",
                props: {
                  id: "replies_uname", //用户名
                  font: $font(12),
                  lines: 4,
                  align: $align.right
                },
                layout: function(make, view) {
                  make.left.equalTo(10);
                  make.right.equalTo(-50);
                  make.height.equalTo(40);
                  make.top.equalTo(60);
                }
              },
              {
                type: "label",
                props: {
                  id: "replies_ctime", //时间
                  font: $font(10),
                  lines: 4,
                  align: $align.right,
                  textColor: $color("#838fa7")
                },
                layout: function(make, view) {
                  make.left.equalTo(10);
                  make.right.equalTo(-50);
                  make.height.equalTo(14);
                  make.top.equalTo(86);
                }
              },
              {
                type: "label",
                props: {
                  id: "replies_like", //赞
                  font: $font(12),
                  lines: 4,
                  textColor: $color("#f56c6c"),
                  align: $align.left
                },
                layout: function(make, view) {
                  make.left.equalTo(10);
                  make.right.equalTo(-50);
                  make.height.equalTo(40);
                  make.top.equalTo(60);
                }
              }
            ]
          }
        },
        events: {
          didSelect(sender, indexPath, data) {
            $ui.push({
              props: {
                title: data.replies_uname.text
              },
              views: [{
                type: "text",
                props: {
                  text: data.replies_content_message.text
                },
                layout: $layout.fill
              },{
                type: "view",
                props: {
                  bgcolor: $color("#999"),
                  alpha:0.7,
                  radius: 30, //圆角,
                },
                views:[{
                  type: "label",
                  props: {
                    text: "←",
                    align: $align.center,
                    textColor:$color('#fff')
                  },
                  layout: function(make, view) {
                    make.center.equalTo(view.super)
                  }
                }],
                layout: function(make, view) {
                  make.right.equalTo(-20);
                  make.bottom.equalTo(-90);
                  make.size.equalTo($size(60, 60))
                },
                events: {
                  tapped: function(sender) {
                    $ui.pop();
                  }
                }
              }]
            })
          }
        },
        layout: function(make, view) {
          make.top.equalTo(400);
          make.left.right.equalTo(0);
          make.bottom.equalTo(0);
        }
      },
      {
        type: "view",
        props: {
          bgcolor: $color("#999"),
          alpha:0.7,
          radius: 30, //圆角,
        },
        views:[{
          type: "label",
          props: {
            text: "←",
            align: $align.center,
            textColor:$color('#fff')
          },
          layout: function(make, view) {
            make.center.equalTo(view.super)
          }
        }],
        layout: function(make, view) {
          make.right.equalTo(-20);
          make.bottom.equalTo(-90);
          make.size.equalTo($size(60, 60))
        },
        events: {
          tapped: function(sender) {
            $ui.pop();
          }
        }
      }
    ],
    layout: function(make, view) {
      make.top.left.bottom.right.equalTo(0);
    }
  });
  $http.get({
    url: `https://api.bilibili.com/x/v2/reply?oid=${aid}&plat=3&pn=3&ps=20&sort=0&type=1`,
    handler: function(resp) {
      var res = resp.data;
      if (res.code == 0) {
        var data = res.data;
        var hots = data.hots; //热门
        var replies = data.replies; //回复
        //热评
        for (let i = 0; i < 3; i++) {
          let message = hots[i].content.message; //内容
          let uname = hots[i].member.uname;
          let like = hots[i].like; //赞
          let usex = hots[i].member.sex; //性别
          let avatar = hots[i].member.avatar; //头像
          let level = hots[i].member.level_info.current_level; //等级
          let ctime = ms_To_ymd(hots[i].ctime); //时间
          let obj = {
            replies_content_message: {
              text: message,
              textColor: $color("#f56c6c")
            },
            replies_uname: {
              text: `Lv  ${level}  ${uname}` //用户名
            },
            replies_like: {
              text: `赞:  ${like}` //赞
            },
            replies_uimg: {
              src: avatar
            },
            replies_ctime: {
              text: ctime
            }
          };
          if (usex == "男") {
            obj.replies_uname.text += " ♂";
            obj.replies_uname.textColor = $color("#409eff");
          } else if (usex == "女") {
            obj.replies_uname.text += " ♀";
            obj.replies_uname.textColor = $color("#f25d8e");
          } else {
            obj.replies_uname.textColor = $color("#555");
          }
          repliesList.push(obj);
        }
        // 普通
        for (let i = 0; i < replies.length; i++) {
          let message = replies[i].content.message; //内容
          let uname = replies[i].member.uname; //用户名
          let usex = replies[i].member.sex; //性别
          let avatar = replies[i].member.avatar; //头像
          let like = replies[i].like; //赞
          let level = replies[i].member.level_info.current_level; //等级
          let ctime = ms_To_ymd(replies[i].ctime); //时间
          let obj = {
            replies_content_message: {
              text: ` ${message}`,
              textColor: $color("#555")
            },
            replies_uname: {
              text: `Lv${level}  ${uname}` //用户名
            },
            replies_like: {
              text: `赞:  ${like}` //赞
            },
            replies_uimg: {
              src: avatar
            },
            replies_ctime: {
              text: ctime
            }
          };
          if (usex == "男") {
            obj.replies_uname.text += " ♂";
            obj.replies_uname.textColor = $color("#409eff");
          } else if (usex == "女") {
            obj.replies_uname.text += " ♀";
            obj.replies_uname.textColor = $color("#f25d8e");
          } else {
            obj.replies_uname.textColor = $color("#555");
          }
          repliesList.push(obj);
        }
        $("repliesList").data = repliesList;
      }
    }
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
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate() + " ";

  return M + D;
}

//检测扩展更新
function scriptVersionUpdate() {
  $http.get({
    url:
      "https://raw.githubusercontent.com/wlor0623/jsbox/master/bilibili/updateInfo.js",
    handler: function(resp) {
      let afterVersion = resp.data.version;
      let msg = resp.data.msg;
      if (afterVersion > version) {
        $ui.alert({
          title: "检测到新的版本！V" + afterVersion,
          message:
            "是否更新?\n更新完成后请退出至扩展列表重新启动新版本。\n" + msg,
          actions: [
            {
              title: "更新",
              handler: function() {
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
    progress: function(bytesWritten, totalBytes) {
      var percentage = bytesWritten * 1.0 / totalBytes;
    },
    handler: function(resp) {
      $photo.save({
        data: resp.data,
        handler: function(success) {
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
