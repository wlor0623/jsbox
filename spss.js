// 搜索
$input.text({
  type: $kbType.url,
  placeholder: "输入名",
  handler: function (text) {
    text = text.trim().toUpperCase();
    $ui.menu({
      items: ["240p", "480p"],
      handler: function (title, idx) {
        getData(idx,text)
      },
      finished: function (cancelled) {
        console.log(cancelled)
      }
    })

  }
});
// 获取数据
function getData(index,text) {
  let urlStr ="";
  if(index==0){
    urlStr = `http://jp-kao.aass4.top:8086/src2/static/${text}/240/${text}.m3u8`;
  }else if(index==1){
    urlStr = `http://jp-kao.aass4.top:8086/src2/static/${text}/${text}.m3u8`;
  }
  $http.get({
    url: urlStr,
    handler: function (resp) {
      var data = resp.data;
      var reg = /<[^>]+>/g;
      if (reg.test(data)) {
        return alert("暂无资源！");
      } else {
        $app.openBrowser({
          type: 10000,
          url: urlStr
        });
      }
    }
  });
}
