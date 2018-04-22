// https://github.com/wlor0623/jsbox/blob/master/cili.js
var urls = [{
  name: "磁力猫",
  pattern: "http://www.cilimao.me/api/search?size=10&sortDirections=desc&page=0&word="
}, {
  name: "种子搜",
  pattern: "http://bt.xiandan.in/search-json?site=%E7%A7%8D%E5%AD%90%E6%90%9C&keyword="
}, {
  name: "bt177",
  pattern: "http://bt.xiandan.in/search-json?site=bt177&keyword="
}, {
  name: "屌丝搜",
  pattern: "http://bt.xiandan.in/search-json?site=%E5%B1%8C%E4%B8%9D%E6%90%9C&keyword="
}
, {
  name: "磁力吧",
  pattern: "http://bt.xiandan.in/search-json?site=%E7%A3%81%E5%8A%9B%E5%90%A7&keyword="
}
// , {
//   name: "AOYOSO",
//   pattern: "http://bt.xiandan.in/search-json?site=AOYOSO&keyword"
// }, {
//   name: "SOBT",
//   pattern: "http://bt.xiandan.in/search-json?site=SOBT&keyword="
// }, {
//   name: "BT岛",
//   pattern: "http://bt.xiandan.in/search-json?site=BT%E5%B2%9B&keyword="
// }, {
//   name: "种子帝",
//   pattern: "http://bt.xiandan.in/search-json?site=zhongzidi&keyword="
// }, {
//   name: "cililiana",
//   pattern: "http://bt.xiandan.in/search-json?site=cililiana&keyword="
// }
]
var nameList = [];
var dIndex = 0;
var text='';
for (var i = 0; i < urls.length; i++) {
  nameList[i] = urls[i].name
}
// 弹出
$input.text({
  handler: function (text) {
    text = encodeURI(text);
    //如果直接按完成 则获取剪贴板内容搜索
    if (text == '') {
      var text = $clipboard.text;
      return search(dIndex, text);
    } else {
      //如果输入了内容
      search(dIndex, text);
    }
  }
})

function search(dIndex, word) {
  var rowsData = [];
  //加载提示
  $ui.loading("加载中...");
  $http.get({
    url: urls[dIndex].pattern + word,
    handler(res) {
      var data = res.data;
      console.log(data);
      $ui.loading(false);
      if(dIndex==0){
        var item = data.data.result.content;
        for (var i = 0; i < item.length; i++) {
          var obj = {};
          obj.title = {};
          obj.content = {};
          obj.magnet = {};
          obj.title.text = item[i].title;

          var size='';
          if((item[i].content_size / 1048576).toFixed(2)<1){
            size='百度网盘'
          }else{
            size=(item[i].content_size / 1048576).toFixed(2) + "MB";
          }
          obj.content.text =size
          var magnet=''
          if((item[i].content_size / 1048576).toFixed(2)<1){
            magnet='https://pan.baidu.com/s/'+item[i].shorturl;
          }else{
            magnet='magnet:?xt=urn:btih:'+item[i].infohash;
          }
          obj.magnet.text = magnet;
          rowsData.push(obj);
        }
      }else{
        var item = data;
        for (var i = 0; i < item.length; i++) {
          var obj = {};
          obj.title = {};
          obj.content = {};
          obj.magnet = {};
          obj.title.text = item[i].name;
          obj.content.text = item[i].size;
          obj.magnet.text = item[i].magnet;
          rowsData.push(obj);
        }
      }
      console.log(rowsData);
      $ui.render({
        views: [{
          type: "menu",
          props: {
            items: nameList,
            index: dIndex
          },
          layout: function(make) {
            make.left.top.right.equalTo(0)
            make.height.equalTo(44)
          },
          events: {
            changed: function(sender) {
              var items = sender.items
              var index = sender.index;
              // $ui.toast(index + ": " + items[index]);
              search(index,word);
            }
          }
        },{
          type: "list",
          props: {
            grouped: true,
            rowHeight: 64,
            footer: {
              type: "label",
              props: {
                height: 20,
                text: "-我是有底线的-",
                textColor: $color("#AAAAAA"),
                align: $align.center,
                font: $font(12)
              }
            },
            template: [{
                type: "label",
                props: {
                  id: "title",
                  font: $font(20)
                },
                layout: function (make) {
                  make.left.equalTo(10)
                  make.top.right.inset(8)
                  make.height.equalTo(24)
                }
              },
              {
                type: "label",
                props: {
                  id: "content",
                  textColor: $color("#888888"),
                  font: $font(15)
                },
                layout: function (make) {
                  make.left.right.equalTo($("title"))
                  make.top.equalTo($("title").bottom)
                  make.bottom.equalTo(0)
                }
              }
            ],
            data: [{
              rows: rowsData
            }]
          },
          layout: function(make,view) {
            make.left.right.equalTo(0);
            make.top.equalTo(45);
            make.height.equalTo(view.super);
            make.bottom.equalTo(100);
          },
          events: {
            didSelect: function (tableView, indexPath) {
              var row = indexPath.row;
              if (rowsData[row].magnet.text) {
                $clipboard.text = rowsData[row].magnet.text
                $ui.toast("复制成功!");
              }else{
                return $ui.error("无数据!");
              }
            }
          }
        }]
      })
    }
  })
}
