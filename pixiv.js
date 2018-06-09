const userName='';//用户名
const password=''//密码

const config = {
  debug: true
};
let header = {
  Authorization: "",
  Referer: "https://www.pixiv.net",
};

let search_keywords = ""; //搜索关键词
let order_type = "popular_d"; //popular_d 全站   popular_male_d 男性 popular_female_d 女性
let search_page_number = 1; //页码
let imagesList=[];

//切换到搜索
function openSearch() {
  $input.text({
    type: $kbType.search,
    placeholder: "搜索",
    handler: function (text) {
       getSearchList(text, order_type, search_page_number);
    }
  });
}
getLoginInfo();
renderView();
openSearch();

//获取搜索列表
async function getSearchList(keywords, order_type, search_page_number) {
  search_keywords = keywords;
  keywords = $text.URLEncode(keywords);
  let url = `https://www.pixiv.net/touch/ajax_api/search_api.php?endpoint=search&mode=search_illust&word=${keywords}&order=${order_type}&p=${search_page_number}&type=&scd=&ecd=&circle_list=0&s_mode=s_tag&blt=&bgt=&adult_mode=`;
  let resp = await $http.get({header: header,url: url});
  let data = resp.data;
  let illust = data.illust;
  for (let i = 0; i < illust.length; i++) {
    $ui.toast(`正在下载第${i+1}/15张图片`);
    let illust_id = illust[i].illust_id; //作品id
    let img_url = await getSmallImg(illust[i].url); //作品路径
    let illust_user_id = illust[i].illust_user_id; //画师id
    let user_name = illust[i].user_name; //画师昵称
    let illust_title = illust[i].illust_title; //标题
    let illust_create_date = illust[i].illust_create_date; //创建时间
    let illust_page_count = illust[i].illust_page_count; //总页数
    
    let likeBtnTitle = '';
    if(illust[i].bookmark_id){
      likeBtnTitle='❤'
    }else{
      likeBtnTitle = '♡';
    }
    const obj = {
      illust_id: {
        text: illust_id
      },
      illust_user_id: {
        text: illust_user_id
      },
      illust_title: {
        text: illust_title
      },
      illust_create_date: {
        text: illust_create_date
      },
      user_name: {
        text: user_name
      },
      img_url: {},
      illust_page_count: {
        text: illust_page_count
      },
      likeBtn: {
        title: likeBtnTitle,
        info: illust_id
      }
    };
    let cacheImgData = getCache(`img_${illust_id}`);
    if (cacheImgData) {
      obj.img_url.data = cacheImgData;
    } else {
      obj.img_url.data = await downloadPic(img_url, illust_id);
    }
    imagesList.push(obj);
    $("imagesList").data = imagesList;
  }
  $ui.toast("图片加载完成");
}
// 渲染视图
function renderView(){
  $ui.render({
  views: [{
    type: "matrix",
    props: {
      columns: 2,
      itemHeight: 150,
      id: "imagesList",
      bgcolor: $color("#eee"),
      spacing: 10,
      template: {
        props: {
          radius: 10
        },
        views: [{
            type: "image", //封面
            props: {
              id: "img_url",
              bgcolor: $color("#eee")
            },
            layout: function (make, view) {
              make.width.equalTo(view.super);
              make.height.equalTo(view.super);
            }
          },
          {
            type: "button",
            props: {
              title: "♡",
              id: "likeBtn",
              bgcolor: $color("#4f95d3"),
              font: $font("bold", 20),
              titleColor: $color("#fff")
            },
            layout: function (make, view) {
              make.width.equalTo(30);
              make.height.equalTo(30);
              make.bottom.right.inset(10);
            },
            events: {
              tapped: async function (sender) {
                let illust_id = sender.info;
                if(sender.title=='♡'){
                  if (await likeImgfn(illust_id)){
                    sender.title = "❤";
                  }
                }else{
                  if(await cancelLikeImgfn(illust_id)){
                    sender.title = "♡";
                  }
                }
              }
            }
          },
          {
            type: "label",
            props: {
              id: "illust_page_count",
              align: $align.center,
              bgcolor: $rgba(0, 0, 0, 0.6),
              textColor: $color("#f5f5f5")
            },
            layout: function (make, view) {
              make.width.equalTo(40);
              make.right.equalTo(0);
            }
          }
        ],
        layout: function (make, view) {
          make.top.equalTo(60);
          make.left.right.equalTo(0);
          // make.bottom.inset(60);
          make.height.equalTo(view.super);
        }
      }
    },
    layout: function (make, view) {
      make.top.left.right.equalTo(0);
      make.height.equalTo(view.super);
    },
    events: {
      didReachBottom: function (sender) {
        search_page_number++;
        getSearchList(search_keywords, order_type, search_page_number);
        sender.endFetchingMore();
      }
    }
  }]
});
}

//写入缓存
function setCache(key, value) {
  $cache.set(key, value);
}
//获取缓存
function getCache(key) {
  return $cache.get(key);
}
//写入图片缓存
function setImgCache(key, value) {
  $cache.set(`img_${key}`, value);
}

//获取图片缓存
function getImgCache(key) {
  return $cache.get(`img_${key}`);
}

//添加收藏
async function likeImgfn(illust_id) {
  illust_id = illust_id.toString();
  var resp = await $http.request({
    url: `https://app-api.pixiv.net/v2/illust/bookmark/add`,
    method: "POST",
    header: header,
    form: {
      restrict: "public",
      illust_id: illust_id
    }
  });
  if (resp.data.error) {
    $ui.toast("收藏失败!");
    return false;
  } else {
    $ui.toast("收藏成功");
    return true;
  }
}
//取消收藏
async function cancelLikeImgfn(illust_id) {
  illust_id = illust_id.toString();
  var resp = await $http.request({
    url: `https://app-api.pixiv.net/v1/illust/bookmark/delete`,
    method: "POST",
    header: header,
    form: {
      restrict: "public",
      illust_id: illust_id
    }
  });
  console.log(resp.data)
  if (resp.data.error) {
    $ui.toast("取消收藏失败!");
    return false;
  } else {
    $ui.toast("取消收藏成功");
    return true;
  }
}
// 转小图片
async function getSmallImg(url) {
  return url;
  let imgSize150 = url.indexOf("https://i.pximg.net/c/360x360_70");
  if (imgSize150 == 0) {
    return `https://i.pximg.net/c/150x150${
      url.split("https://i.pximg.net/c/360x360_70")[1]
    }`;
  } else {
    return url;
  }
}

// 登陆
async function getlogin(username, password) {
  username = username.toString();
  password = password.toString();
  const resp = await $http.post({
    url: "https://oauth.secure.pixiv.net/auth/token",
    header: {
      Authorization: "",
      Referer: "https://www.pixiv.net"
    },
    form: {
      username: username,
      password: password,
      device_token: "pixiv",
      grant_type: "password",
      get_secure_url: "1",
      client_secret: "W9JZoJe00qPvJsiyCGT3CCtC6ZUtdpKpzMbNlUGP",
      client_id: "KzEZED7aC0vird8jWyHM38mXjNTY"
    }
  });
  if (resp.data.has_error) {
    return $ui.alert("登陆失败!");
  } else {
    $ui.toast("登陆成功!");
    if(config.debug){ console.log(resp.data);}
    setCache('loginInfo',resp.data);
    header.Authorization=`Bearer ${resp.data.response.access_token}`;
  }
}

function getLoginInfo(){
  let loginInfo=getCache('loginInfo')
  if(!loginInfo){
    getlogin(userName,password);
  }else{
    $ui.toast("获取缓存信息成功");
    header.Authorization=`Bearer ${loginInfo.response.access_token}`;
    console.log(`Bearer ${loginInfo.response.access_token}`)
  }
}


//下载
async function downloadPic(url,imgID) {
  let resp = await $http.download({
    url: url,
    header: header
  });
  setImgCache(imgID,resp.data)
  return resp.data;
}
