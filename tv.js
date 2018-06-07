/*
高清电视直播
by：iPhoneX、枫

*/
version=1.3


var baseUrl = "https://raw.githubusercontent.com/hugohhuang/m3u/master/mytv.json"
 
//var baseUrl="https://coding.net/u/hgc1027/p/m3u/git/raw/master/mytv.json"

var tv = {};

$ui.render({
  props: {
    title: "电视直播"
  },
  views: [{
    type: "matrix",
    props: {
      id: "Video",
      itemHeight: 50,
      columns: 2,
      spacing: 3,
      template: [{
        type: "label",
        props: {
          id: "name",
          align: $align.center,
          lines: 0,
          bgcolor: $color("#F8F8F8"),
          borderColor: $color("#f0f0f0"),
          borderWidth: 1,
          font: $font("bold", 15)

        },
        layout: function(make, view) {
          make.centerX.centerY.equalTo(view.super)
          make.size.equalTo($size(80, 10))
          make.bottom.left.right.inset(3)
        }
      }]
    },
    layout: function(make) {
      make.left.top.right.equalTo(0)
      make.bottom.left.right.inset(0)
    },
    events: {
      didSelect: function(sender, indexPath, data) {
        channelDetail(data.type, data.name.text)
      }

    }
  }]
})

scriptVersionUpdate()

channelList(baseUrl)

//频道观看
function view(title, lines) {
  var line = lines[0]
  var js = []
  for (i in lines) {
    var a = lines[i];
    js.push({
      bt: {
        text: a.name
      },
      playurl: a.playurl
    })
  }

  $ui.push({
    props: {
      title: title
    },
    views: [{
      type: "web",
      props: {
        id: "bof",
        url: line.playurl,
        radius: 7,
        inlineMedia:true,
        pictureInPicture:true
      },
      layout: function(make, view) {
        make.right.left.top.inset(0)
        make.height.equalTo(196)
      }

    }, {
      type: "label",
      props: {
        id: "bqxj",
        text: "🔵 频道列表：",
        font: $font(21),
      },
      layout(make, view) {
        make.top.equalTo($("bof").bottom).inset(5)
        make.left.inset(5)
        //make.size.equalTo($size(200, 30))

      }
    }, {
      type: "label",
      props: {
        id: "bdmz",
        text: line.name,
        font: $font(21),

        color: $color("#f01232"),
      },
      layout(make, view) {
        make.top.equalTo($("bof").bottom).inset(5)
        make.right.inset(5)
        //make.size.equalTo($size(200, 30))

      }
    }, {
      type: "matrix",
      props: {
        id: "jslb",
        data: js,
        columns: 2,
        itemHeight: 50,
        spacing: 5,
        template: [{
          type: "label",
          props: {
            id: "bt",
            bgcolor: $color("#F8F8F8"),
            borderColor: $color("#f0f0f0"),
            borderWidth: 1,
            align: $align.center,
          },
          layout(make, view) {
            make.top.left.right.bottom.inset(0)
          }

        }]
      },
      layout(make, view) {
        make.top.equalTo($("bqxj").bottom).inset(5)
        make.left.right.inset(5)
        make.bottom.inset(0)

      },
      events: {
        didSelect: function(sender, indexPath, data) {
          /*$("jslb").cell(indexPath).add({
            type: "label",
            props: {
              text: data.bt.text,
              bgcolor: $color("#F8F8F8"),
              borderColor: $color("#f01232"),
              borderWidth: 1,
              align: $align.center,
            },
            layout(make, view) {
              make.top.left.right.bottom.inset(0)
            }

          })*/
          play(data.bt.text, data.playurl)

        }

      }
    }, ]

  })
}

function play(name, playurl) {
  $("bof").url = playurl
  $("bdmz").text = name

}

//频道详情
function channelDetail(id, name) {
  var lines = []
  var options = tv.live
  $console.info(name)
  for (i in options) {
    var a = options[i]
    var urllist = a.urllist.split("#")
    if (a.itemid == id) {
      lines.push({
        name: a.name,
        playurl: urllist[0]
      })
    }
  }
  view(name, lines);
}

//频道列表
function channelList(url) {
  $http.get({
    url: baseUrl,
    handler: function(resp) {
      tv = resp.data
      $console.info(tv)
      var data = []
      var list = tv.type
      for (i in list) {
        var a = list[i]
        data.push({
          name: {
            text: a.name
          },
          type: a.id
        })
      }
      $("Video").data = data
    }
  })
}
function scriptVersionUpdate() {
  $http.get({
    url: "https://raw.githubusercontent.com/hugohhuang/m3u/master/updateInfo",
    handler: function(resp) {
      $console.info(resp.data)
      var afterVersion = resp.data.version
      var msg = resp.data.msg
      if (afterVersion > version) {
        $ui.alert({
          title: "检测到新的版本！V" + afterVersion,
          message: "是否更新?\n更新完成后请退出至扩展列表重新启动新版本。\n" + msg,
          actions: [{
            title: "更新",
            handler: function() {
              var url = "jsbox://install?url=https://raw.githubusercontent.com/hugohhuang/m3u/master/tv.js&name=tv" + afterVersion + "&icon=icon_087.png&types=1&author=feng&website=https://t.me/hgc1027"
              $app.openURL(encodeURI(url))
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
