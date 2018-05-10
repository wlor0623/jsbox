function render(id) {
  $http.get({
    url: "http://www.galmoe.com/t.php?aid=" + id,
    handler: function(resp) {
      var data = resp.data;
      console.log(data);
      if (data.result == 1) {
        let url = data.url;
        $ui.render({
          views: [{
              type: "image",
              props: {
                src: url
              },
              layout: function(make, view) {
                make.left.top.right.inset(10)
                make.size.equalTo($size(100, 200))
              }
            },
            {
              type: "button",
              props: {
                title: "下载封面"
              },
              layout: function(make, view) {
                make.center.equalTo(view.super)
                make.width.equalTo(120)
              },
              events: {
                tapped: function(sender) {
                  $ui.preview({
                    title: "URL",
                    url: url
                  })
                }
              }
            }
          ]
        })
      }
    }
  })
}

$input.text({
  type: $kbType.number,
  placeholder: "输入要获取的av号",
  handler: function(text) {
    render(text)
  }
})
