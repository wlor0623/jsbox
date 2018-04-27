$http.post({
  url: "http://wx.shenzhentong.com/queryBalanceInfo",
  header: {
    "X-Requested-With": "XMLHttpRequest",
    Cookie: "SESSION=36a148f72da05b27a039afa7988c524fb44ba592; openid=o0TgXuLZSKxWNy-7I_gqx9vZ1me8; openid-sign=1524738632"
  },
  body: {
    cardId: 689253655
  },
  handler: function (resp) {
    let data = resp.data;
    let queryDate = data.queryDate; //截止时间
    let balance = data.balance; //余额
    let balanceNum=parseInt(balance);//数字余额
    console.log(data);
    let progressValue = 0;
    let balanceColor=$color('#000');
    let progressColor=$color('#50a554');
    if(balanceNum<=30){
      progressColor=$color('#fe4365');
      balanceColor=$color('#fe4365');
    }else if(balanceNum<=70){
      progressColor=$color('#2196f3');
      balanceColor=$color('#2196f3');
    }
    if (balanceNum >= 100) {
      progressValue = 1.0;
    } else {
      progressValue = balanceNum / 100
    }
    $ui.render({
      views: [{
        type: "label", //时间
        props: {
          text: queryDate,
          font:$font("STHeitiTC-Medium",18),
        },
        layout: function (make, view) {
          make.left.equalTo(20);
          make.top.equalTo(45);
        }
      },{
        type: "label", //时间提示
        props: {
          text: "截止:",
          font:$font(16)
        },
        layout: function (make, view) {
          make.left.equalTo(20);
          make.top.equalTo(15);
        }
      }, {
        type: "label", //余额提示
        props: {
          text: "深圳通余额:",
          font:$font(16)
        },
        layout: function (make, view) {
          make.right.equalTo(-20);
          make.top.equalTo(15);
        }
      }, {
        type: "label", //余额
        props: {
          text: balance,
          font:$font("Avenir-Light",24),
          textColor:balanceColor
        },
        layout: function (make, view) {
          make.right.equalTo(-20);
          make.top.equalTo(40);
        }
      }, {
        type: "progress", //进度条
        props: {
          value: progressValue,
          progressColor:progressColor
        },
        layout: function (make, view) {
          make.left.equalTo(20);
          make.right.equalTo(-20);
          make.top.equalTo(80);
        }
      }]
    })
  }
})