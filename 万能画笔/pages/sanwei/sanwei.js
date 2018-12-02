// pages/sanwei/sanwei.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.ctx = wx.createCanvasContext('mycanvas');
  },
  /**
   * 画海报结束
   */
  eventGetImage(event) {

    console.log('海报绘制完成', event);
    wx.hideLoading()
    const {
      tempFilePath,
      errMsg
    } = event.detail
    if (errMsg === 'canvasdrawer:ok') {
      this.setData({
        shareImage: tempFilePath,
        posterDrawn: true
      })
    }
  },
  /**
   * 画七维图
   */
  drawSanwei() {
    // var config1 = {
    //   type: 'polygon',
    //   points: [{
    //     x: 10,
    //     y: 10
    //   }, {
    //     x: 200,
    //     y: 10
    //   }, {
    //     x: 200,
    //     y: 200
    //   }, {
    //     x: 10,
    //     y: 200
    //   }, {
    //     x: 50,
    //     y: 50
    //   }]
    // }
    var config2 = {
      type: 'polygon',
      color: 'white',
      isFill: false,
      lineWidth: 1,
      points: [{
        x: 200,
        y: 100
      }, {
        x: 150,
        y: 300
      }, {
        x: 10,
        y: 200
      }]
    }
    // var list = this.getPolygonLocations(200,200,100,7,Math.PI*1.5);
    // var list2 = this.getPolygonLocations(200, 200, 80, 7, Math.PI * 1.5);
    // console.log(list);
    // config2.points = list;
    // // this.drawPolygon(config1);
    // this.drawPolygon(config2);
    // config2.points = list2;

    // this.drawPolygon(config2);
    // this.ctx.beginPath();
    // this.ctx.lineTo(10, 10)
    // this.ctx.lineTo(100, 10)

    // this.ctx.beginPath();
    // this.ctx.lineTo(10, 30)
    // this.ctx.lineTo(100, 30)

    // // this.drawArc({ x: 200, y: 200, radius: 50, sA: 0, eA: Math.PI * 1.5});

    // this.ctx.stroke();
    // this.drawRegularPolygon({
    //   x: 150,
    //   y: 150,
    //   radius: 50,
    //   lines: 7,
    //   level: 4,
    //   // color: 'white',
    //   colors: ['white', 'yellow', 'red', 'black'],
    //   lineWidth: 2,
    //   isFill: false
    // });

    // this.drawRegularArc({
    //   x: 100,
    //   y: 100,
    //   radius: 50,
    //   color: 'white',
    //   colors:['yellow','red','green','blue'],
    //   // isFill: false,
    //   level:5
    // })
    // this.drawPolygon({
    //   points: [{
    //     x: 200,
    //     y: 100
    //   }, {
    //     x: 150,
    //     y: 300
    //   }, {
    //     x: 10,
    //     y: 200
    //   }]
    // })
    // this.ctx.beginPath();
    // this.ctx.setLineJoin('round');

    // this.ctx.lineTo(100, 100);
    // this.ctx.lineTo(200, 100);
    // this.ctx.lineTo(150, 150);
    // this.ctx.setFillStyle('white');
    // this.ctx.setLineWidth(10);
    // // this.ctx.closePath();

    // this.ctx.fill();
    // this.ctx.stroke();
    // this.ctx.beginPath();

    // this.ctx.lineTo(200, 100);
    // this.ctx.lineTo(200, 250);
    // this.ctx.lineTo(150, 150);
    // // this.ctx.closePath();
    // this.ctx.setFillStyle('yellow');
    // this.ctx.fill();
    // this.ctx.stroke();
    // this.drawRegularArcOrPolygon({
    //   x: 100,
    //   y: 100,
    //   radius: 50,
    //   // isFill:true,
    //   color: 'white',
    //   colors: ['yellow', 'red', 'green', 'blue'],
    //   // isFill: false,
    //   level: 5,
    //   // isArc: true
    // })
    // this.drawCenterPolygon({
    //   x: 150,
    //   y: 150,
    //   lineWidth: 2,
    //   points: [{
    //     x: 100,
    //     y: 100,
    //     color: 'red',
    //   }, {
    //     x: 200,
    //     y: 100,
    //     color: 'yellow'
    //   }, {
    //     x: 200,
    //     y: 200,
    //     color: 'blue'
    //   }, {
    //     x: 100,
    //     y: 200,
    //     color: 'green'
    //   }]
    // })
    this.drawAbilityChart({
      x: 200,
      y: 200,
      radius: 100,
      net:{level:4,isArc:true,isPolygon:false,color:'white'},
      polygon:{lineWidth:2,isStroke:false},
      vertex:{
          color:'yellow',
          radius:5,
          isFill:false
      },
      scores: [{
        score: 99,
        color: 'white'
      }, {
        score: 88,
        color: 'orange'
      }, {
        score: 90,
        color: 'blue'
      }, {
        score: 50,
        color: 'black'
      }, {
        score: 60,
        color: 'green'
      }, {
        score: 80,
        color: 'yellow'
      }, {
        score: 100,
        color: 'red'
      }]
    })
    this.ctx.draw();
  },

  /**
   * 绘制能力表,需要传入中心点坐标,
   * 能力值的对象数组scores,每个对象有一个
   * score能力值属性,
   * color对应的颜色
   */
  drawAbilityChart({
    x,
    y,
    radius, //半径
    scores, //能力值数组,必须写颜色,和能力值
    net={},
    polygon={},
    vertex={}
    // lineWidth = 1,
    // lineColor = 'white', //能力多边形的边框颜色,
    // netColor = 'white', //网格的颜色
    // isArc = true, //如果线框是圆形的，那么能力多边形在上,线框,在下,否则相反    
    // pointColor,
    // isFill = true,
    // isStroke = true,
  }) {
    this.ctx.save();

    //对于多边形层框，分为三步，再画中心多边形,先画层框，最后画点
    var points = this.getRegularPolygonLocations({
      x,
      y,
      radius,
      rates: scores.map((v) => v.score)
    });
    points.forEach((v, i) => {
      v.color = scores[i].color || 'red'
    })
    console.log(points);
    //封装画网格的参数对象
    net.x = x, net.y = y, net.radius = radius;
    //封装画中心多边形的参数对象
    polygon.x = x, polygon.y = y, polygon.points = points;
    //封装画顶点的参数对象
    if (net.isArc) {
      //对于圆形层框，分为三步,先画层框，再画中心多边形，最后画点  
      this.drawRegularArcOrPolygon(net);
      this.drawCenterPolygon(polygon);
    } else {
      this.drawCenterPolygon(polygon);
      net.lines = scores.length;
      this.drawRegularArcOrPolygon(net);
    }
    points.forEach((v) => {
      this.drawArc({
        x: v.x,
        y: v.y,
        ...vertex
      })
    })
    this.ctx.restore();
  },

  /**
   * 绘制同心圆或者同心正多边形,可设置层级,
   * 同心圆和同心正多边形可一块绘制
   */
  drawRegularArcOrPolygon({
    x,
    y,
    radius,
    isFill = false,
    level = 1, //层级
    lineWidth = 1, //线宽
    color = 'red',
    colors,
    lines = 4,
    isArc = false,
    isPolygon = true
  }) {
    this.ctx.save();
    var interval = radius / level;
    var count = 0;
    while (radius - count * interval > 0) {
      if (colors && colors.length > 0) {
        var index = count % colors.length;
        color = colors[index];
      }

      if (isArc) { //绘制圆
        console.log('绘制圆');
        this.drawArc({
          isFill,
          x,
          y,
          radius: radius - count * interval,
          color,
          lineWidth
        });
      }
      //绘制多边形
      if (isPolygon) {
        var locations = this.getRegularPolygonLocations({
          x,
          y,
          radius: radius - count * interval,
          lines
        });
        this.drawPolygon({
          isFill,
          points: locations,
          lineWidth,
          color
        });
      }
      count++;
    }
    this.ctx.restore();
  },

  /**
   * 根据一个中心点，半径,多边形边数，
   * 计算出多边形顶点坐标和相对于中心点弧度并
   * 返回一个对象数组,对象属性有
   * x,横坐标
   * y,纵坐标,
   * A,相对于中心点的弧度
   */
  getRegularPolygonLocations({
    x, //中心点x坐标
    y, //中心点y坐标
    radius, //半径
    lines, //边数
    rates, //每个点所占半径的比率，是一个数字数组例如[25,80],代表两个点各占半径的25%和80%，当rates不为空时,lines无效,rates不能写空数组
    startA = Math.PI * 1.5
  }) {
    if (rates) {
      if (rates.length == 0) {
        return;
      }
      lines = rates.length;
    }
    var intervalA = Math.PI * 2 / lines;
    var count = 0;
    var list = [];
    while (count < lines) {
      var A = (startA + count * intervalA) % (Math.PI * 2)
      var point_radius = rates ? radius * rates[count] / 100 : radius;
      list.push(this.getLocation(x, y, A, point_radius));
      count++;
    }
    return list;
  },
  /**
   * 根据一个坐标,角度,半径,获取另一个角标
   */
  getLocation(x, y, A, radius) {
    return {
      x: x + radius * Math.cos(A),
      y: y + radius * Math.sin(A)
    }
  },
  /**
   * 绘制中心多边形，需要一个中心点坐标
   * color代表填充颜色
   * lineColor代表边框颜色
   * 有三种风格默认加边框填充
   * isFill = true;
   * isStoke = true;
   * 或者不加边框只填充
   * isFill = true;
   * isStroke = false;
   * 只加边框不填充
   * isFill = false;
   * isStroke = true;
   * points可以设置一个color属性,代表一个每个区域的颜色,
   * 可以加边框或不加边框,边框颜色用lineColor设置
   */
  drawCenterPolygon({
    x, //中心点x坐标 必填
    y, //中心点y坐标 必填
    isFill = true, //填充
    isStroke = true, //描边
    lineWidth = 10,
    lineColor = 'white', //边框颜色
    color = 'red',
    points,
  }) {
    console.log('绘制中心多边形');
    if (!points) return;
    this.ctx.save();
    if (isStroke) {
      //设置线条的结束交点样式
      this.ctx.setLineJoin('round');
      this.ctx.setLineWidth(lineWidth);
      this.ctx.setStrokeStyle(lineColor);
    }
    //循环绘制每个三角区域
    for (var i = 0; i < points.length; i++) {
      this.ctx.beginPath();
      this.ctx.lineTo(points[i].x, points[i].y);
      var nextIndex = (i + 1) % points.length;
      this.ctx.lineTo(points[nextIndex].x, points[nextIndex].y);
      this.ctx.lineTo(x, y);
      this.ctx.closePath();
      if (isFill) {
        this.ctx.setFillStyle(points[i].color || color);
        this.ctx.fill();
      }
      if (isStroke) {
        this.ctx.stroke();
      }
    }

    this.ctx.restore();
  },
  /**
   * 绘制多边形
   */
  drawPolygon({
    isFill = true,
    lineWidth = 10,
    color = 'red',
    points,
  }) {
    console.log('绘制多边形');
    if (!points) return;
    this.ctx.save();
    this.ctx.beginPath();
    for (var i = 0; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    this.ctx.closePath();
    if (isFill) {
      this.ctx.setFillStyle(color);
      this.ctx.fill();
    } else {
      this.ctx.setLineWidth(lineWidth);
      this.ctx.setStrokeStyle(color);
      this.ctx.stroke();
    }
    this.ctx.restore();
  },

  /**
   * 绘制圆弧
   */
  drawArc({
    isFill = true,
    x = 10,
    y = 10,
    radius = 20,
    sA = 0,
    eA = Math.PI * 2,
    isClockwise = false,
    color,
    lineWidth = 2
  }) {
    console.log('绘制圆弧');
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, sA, eA, isClockwise);
    this.ctx.closePath();
    if (isFill) {
      this.ctx.setFillStyle(color);
      this.ctx.fill();
    } else {
      this.ctx.setLineWidth(lineWidth);
      this.ctx.setStrokeStyle(color);
      this.ctx.stroke();
    }
    this.ctx.restore();
  },

  /**
   * 绘制正多边形
   */
  drawRegularPolygon({
    x,
    y,
    radius,
    isFill = false,
    level = 1, //层级
    lineWidth, //线宽
    color = 'red',
    colors,
    lines
  }) {
    this.ctx.save();
    var interval = radius / level;
    var count = 0;
    while (radius - count * interval > 0) {
      if (colors && colors.length > 0) {
        var index = count % colors.length;
        color = colors[index];
      }

      var locations = this.getRegularPolygonLocations({
        x,
        y,
        radius: radius - count * interval,
        lines
      });
      this.drawPolygon({
        isFill,
        points: locations,
        lineWidth,
        color
      });
      count++;
    }
    this.ctx.restore();
  },
  /**
   * 绘制正圆,可以设置层级
   */
  drawRegularArc({
    x = 10,
    y = 10,
    radius = 20,
    isFill = false,
    level = 1,
    lineWidth,
    color = 'red',
    colors
  }) {

    this.ctx.save();
    var interval = radius / level;
    var count = 0;
    while (radius - count * interval > 0) {
      if (colors && colors.length > 0) {
        var index = count % colors.length;
        color = colors[index];
      }
      console.log('x,y', x, y);
      this.drawArc({
        isFill,
        x,
        y,
        radius: radius - count * interval,
        color,
        lineWidth
      });
      count++;
    }
    this.ctx.restore();
  }
})



// var width = 1080,
//   height = 1920;
// this.setData({
//   painting: {
//     width: width,
//     height: height,
//     views: [{
//       type: 'rect',
//       color: '#51bda3',
//     },
//     {
//       type: 'polygon',
//       points: [{
//         x: 10,
//         y: 10
//       }, {
//         x: 200,
//         y: 10
//       }, {
//         x: 200,
//         y: 200
//       }, {
//         x: 10,
//         y: 200
//       }]
//     }]
//   }
// })