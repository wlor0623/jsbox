const version = 1.0;
let videoTitle = '';
let videoLinks;
let videoIndex = 0;
let videoCover = '';
let PHPSESSIID = '';
var urlArr = ['kuaishou', 'yunyinyue'];
var shortUrlArr = ['url', 't', 'dwz', 'suo'],
  service1Arr = ['tiktokv', 'tiktokcdn', 'tiktok', 'musical', 'flipagram'],
  hostMap = {
    huoshan: 'huoshan',
    huoshanzhibo: 'huoshan',
    hotsoonzb: 'huoshan',
    smzhuhe: 'huoshan',
    woaidazhe: 'huoshan',
    gifshow: 'kuaishou',
    kuaishou: 'kuaishou',
    kwai: 'kuaishou',
    kw: 'kuaishou',
    yxixy: 'kuaishou',
    chenzhongtech: 'kuaishou',
    miaopai: 'weibo',
    xiaokaxiu: 'weibo',
    yixia: 'weibo',
    weibo: 'weibo',
    weico: 'weibo',
    toutiao: 'toutiao',
    '365yg': 'toutiao',
    ixigua: 'toutiao',
    xiguaapp: 'toutiao',
    xiguavideo: 'toutiao',
    xiguashipin: 'toutiao',
    pstatp: 'toutiao',
    zijiecdn: 'toutiao',
    zijieimg: 'toutiao',
    toutiaocdn: 'toutiao',
    toutiaoimg: 'toutiao',
    toutiao12: 'toutiao',
    toutiao11: 'toutiao',
    neihanshequ: 'toutiao',
    meipai: 'meipai',
    douyin: 'douyin',
    iesdouyin: 'douyin',
    amemv: 'douyin',
    tiktokv: 'douyin',
    tiktokcdn: 'douyin',
    tiktok: 'douyin',
    douyinshortvideo: 'douyin',
    musical: 'muse',
    musemuse: 'muse',
    muscdn: 'muse',
    xiaoying: 'xiaoying',
    vivavideo: 'xiaoying',
    immomo: 'momo',
    momocdn: 'momo',
    inke: 'inke',
    flipagram: 'flipagram',
    '163': 'yunyinyue',
    qq: 'weishi',
    qzone: 'weishi',
    weishi: 'weishi',
    hulushequ: 'pipixia'
  };
await getCookie();
await scriptVersionUpdate();
async function getCookie() {
  var resp = await $http.get('http://douyin.iiilab.com/');
  let Cookie = resp.response.headers['Set-Cookie'];
  let sliceStr = Cookie.slice(
    Cookie.indexOf('PHPSESSIID=') + 11,
    Cookie.indexOf('PHPSESSIID=') + 23
  );
  if (/^\d{12}$/.test(sliceStr)) {
    PHPSESSIID = sliceStr;
    console.log('获取到Cookie', PHPSESSIID);
    renderView();
  } else {
    return $ui.alert('cookie获取失败!');
  }
}
function start(inputURL) {
  inputURL = $detector.link(inputURL)[0];
  let host = parseHost(inputURL);
  console.log('host地址',host);
  // 短链接
  if (contains(shortUrlArr, parseHost(inputURL))) {
    unShortUrlAndParseVideo(inputURL);
  }
  for (var i in hostMap) {
    if (i == host) {
      console.log('匹配成功!');
      parseVideo(inputURL, hostMap[i]);
      return;
    }
  }
}
// 渲染
function renderView() {
  $ui.render({
    views: [
      {
        type: 'view',
        props: {
          bgcolor: $color('#f5f5f5')
        },
        views: [
          {
            type: 'input',
            props: {
              id: 'inputBar',
              type: $kbType.url,
              autoFontSize: true,
              placeholder: '请将视频链接粘贴到这里'
            },
            layout: function(make, view) {
              make.height.equalTo(40);
              make.top.left.inset(10);
              make.right.inset(90);
            },
            events: {
              returned: function(sender) {
                console.log(sender.text);
              }
            }
          },
          {
            type: 'button',
            props: {
              title: '解析',
              id: 'parse'
            },
            layout: function(make, view) {
              make.right.inset(10);
              make.top.inset(10);
              make.width.equalTo(70);
              make.height.equalTo(40);
            },
            events: {
              // 点击按钮解析视频
              tapped: function(sender) {
                $('inputBar').blur();
                let inputURL = $('inputBar').text;
                if ($detector.link(inputURL).length != 0) {
                  start(inputURL);
                } else {
                  $ui.alert('请输入正确的网址!');
                  $('inputBar').text = '';
                }
              }
            }
          },
          {
            type: 'view',
            props: {
              hidden: true,
              id: 'vedioView'
            },
            layout: function(make, view) {
              make.left.bottom.right.inset(10);
              make.top.equalTo(60);
            },
            views: [
              {
                type: 'label',
                props: {
                  id: 'videoTitle',
                  align: $align.center,
                  lines: 0,
                  autoFontSize: true
                },
                layout: function(make, view) {
                  make.left.right.inset(10);
                  make.top.equalTo(10);
                  make.height.equalTo(40);
                }
              },
              {
                type: 'video',
                props: {
                  id: 'videoDemo',
                  bgcolor: $color('#eee')
                },
                layout: function(make, view) {
                  make.left.right.inset(10);
                  make.top.equalTo(60);
                  make.height.equalTo(250);
                }
              },
              {
                type: 'button',
                props: {
                  title: '分享给好友',
                  id: 'shareBtn',
                  bgcolor: $color('#f56c6c')
                },
                layout: function(make, view) {
                  make.top.inset(320);
                  make.left.right.inset(10);
                  make.height.equalTo(50);
                },
                events: {
                  tapped: function(sender) {
                    $ui.loading('加载中...');
                    $http.download({
                      url: videoLinks,
                      progress: function(bytesWritten, totalBytes) {
                        var percentage = (bytesWritten * 1.0) / totalBytes;
                      },
                      handler: function(resp) {
                        $ui.loading(false);
                        $share.sheet(resp.data);
                      }
                    });
                  }
                }
              },
              {
                type: 'button',
                props: {
                  title: '从浏览器打开',
                  id: 'shareBtn',
                  bgcolor: $color('#409eff')
                },
                layout: function(make, view) {
                  make.top.inset(380);
                  make.left.right.inset(10);
                  make.height.equalTo(50);
                },
                events: {
                  tapped: function(sender) {
                    // 从浏览器打开
                    $app.openURL(videoLinks);
                  }
                }
              },
              {
                type: 'button',
                props: {
                  title: '复制视频地址',
                  id: 'shareBtn',
                  bgcolor: $color('#909399')
                },
                layout: function(make, view) {
                  make.top.inset(440);
                  make.left.right.inset(10);
                  make.height.equalTo(50);
                },
                events: {
                  tapped: function(sender) {
                    $clipboard.text = videoLinks;
                    $ui.toast('复制成功!');
                  }
                }
              }
            ]
          }
        ],
        layout: function(make, view) {
          make.top.bottom.left.right.equalTo(0);
        },
        events: {
          // 点击页面失去输入框焦点
          tapped: function(sender) {
            $('inputBar').blur();
          }
        }
      }
    ]
  });
}

// 解析host
function parseHost(url) {
  var sign = '://';
  var pos = url.indexOf(sign);
  if (pos >= 0) {
    pos += sign.length;
    url = url.slice(pos);
  }
  var array = url.split('.');
  if (
    array[0] == 'www' ||
    array[0] == 'm' ||
    array[0] == 'music' ||
    array[0] == 'h5' ||
    array[0] == 'mlive3' ||
    array[0] == 'boc' ||
    array[0] == 'reflow' ||array[0] == 'v'
  ) {
    return array[1];
  }
  return array[0];
}

// 短网址和解析视频
function unShortUrlAndParseVideo(link) {
  console.log('正在转换短链接', link);
  $http.lengthen({
    url: link,
    handler: function(url) {
      console.log('长链接', url);
      if (url != '') {
        start(url);
      }
    }
  });
}

// 解析视频
function parseVideo(link, site) {
  $ui.toast('正在解析...', 0.5);
  let host=parseHost(link);
  $http.post({
    url:`http://service${contains(service1Arr, host) ? '1' : '0'}.iiilab.com/video/web/${site}`,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Cookie': `iii_Session=41r8s87vgstudugp1pio88s0b7; PHPSESSIID=${PHPSESSIID}`,
      'Origin': 'http://toutiao.iiilab.com',
      'Referer': 'http://toutiao.iiilab.com/',
    },
    body: {
      link: link,
      r: generateStr(link + '@' + c).toString(10),
      s:Math.random().toString(10).substring(2)
    },
    handler: function(resp) {
      var data = resp.data;
      if (data.succ) {
        videoTitle = data.data.text;
        if (typeof data.data.cover == 'string') {
          videoCover = data.data.cover;
        } else if (typeof data.data.cover == 'object') {
          videoCover = data.data.cover[0];
        }
        if (typeof data.data.video == 'string') {
          videoLinks = data.data.video;
        } else if (typeof data.data.video == 'object') {
          if (data.data.video.link) {
            videoLinks = data.data.video.link[0].url;
          } else {
            videoLinks = data.data.video[0];
          }
        }
        console.log("视频标题",videoTitle);
        console.log("视频链接",videoLinks);
        console.log("视频封面",videoCover);
        videoTitle=videoTitle?videoTitle:''
        $('videoTitle').text = videoTitle;
        $('videoDemo').src = videoLinks;
        $('videoDemo').poster = videoCover;
        $('vedioView').hidden = false;
        $ui.toast('视频链接获取成功', 0.5);
      } else {
        $ui.alert(data.retDesc);
      }
    }
  });
}

// 包含
function contains(arr, val) {
  return arr.indexOf(val) != -1 ? true : false;
}

// 生成加密字符串
function generateStr(a) {
  var c = (function() {
      for (var d = 0, f = new Array(256), g = 0; 256 != g; ++g) {
        (d = g),
          (d = 1 & d ? -306674912 ^ (d >>> 1) : d >>> 1),
          (d = 1 & d ? -306674912 ^ (d >>> 1) : d >>> 1),
          (d = 1 & d ? -306674912 ^ (d >>> 1) : d >>> 1),
          (d = 1 & d ? -306674912 ^ (d >>> 1) : d >>> 1),
          (d = 1 & d ? -306674912 ^ (d >>> 1) : d >>> 1),
          (d = 1 & d ? -306674912 ^ (d >>> 1) : d >>> 1),
          (d = 1 & d ? -306674912 ^ (d >>> 1) : d >>> 1),
          (d = 1 & d ? -306674912 ^ (d >>> 1) : d >>> 1),
          (f[g] = d);
      }
      return 'undefined' != typeof Int32Array ? new Int32Array(f) : f;
    })(),
    b = function(g) {
      for (var j, k, h = -1, f = 0, d = g.length; f < d; ) {
        (j = g.charCodeAt(f++)),
          j < 128
            ? (h = (h >>> 8) ^ c[255 & (h ^ j)])
            : j < 2048
              ? ((h = (h >>> 8) ^ c[255 & (h ^ (192 | ((j >> 6) & 31)))]),
                (h = (h >>> 8) ^ c[255 & (h ^ (128 | (63 & j)))]))
              : j >= 55296 && j < 57344
                ? ((j = (1023 & j) + 64),
                  (k = 1023 & g.charCodeAt(f++)),
                  (h = (h >>> 8) ^ c[255 & (h ^ (240 | ((j >> 8) & 7)))]),
                  (h = (h >>> 8) ^ c[255 & (h ^ (128 | ((j >> 2) & 63)))]),
                  (h =
                    (h >>> 8) ^
                    c[255 & (h ^ (128 | ((k >> 6) & 15) | ((3 & j) << 4)))]),
                  (h = (h >>> 8) ^ c[255 & (h ^ (128 | (63 & k)))]))
                : ((h = (h >>> 8) ^ c[255 & (h ^ (224 | ((j >> 12) & 15)))]),
                  (h = (h >>> 8) ^ c[255 & (h ^ (128 | ((j >> 6) & 63)))]),
                  (h = (h >>> 8) ^ c[255 & (h ^ (128 | (63 & j)))]));
      }
      return h ^ -1;
    };
  return b(a) >>> 0;
}

async function scriptVersionUpdate() {
  let resp = await $http.get(
    'https://raw.githubusercontent.com/wlor0623/jsbox/master/vedios/updateInfo.js'
  );
  let afterVersion = resp.data.version;
  let msg = resp.data.msg;
  console.log('远程版本', afterVersion);
  if (afterVersion > version) {
    $ui.alert({
      title: `检测到新的版本！V ${afterVersion}`,
      message: `是否更新?\n更新完成后请退出至扩展列表重新启动新版本。\n  ${msg}`,
      actions: [
        {
          title: '更新',
          handler: function() {
            let url = `jsbox://install?url=https://raw.githubusercontent.com/wlor0623/jsbox/master/vedios/videos.js&name=无水印视频解析&icon=icon_055.png&author=wlor`;
            $app.openURL(encodeURI(url));
            $app.close();
          }
        },
        {
          title: '取消'
        }
      ]
    });
  }
}
