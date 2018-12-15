// pages/prepare/prepare.js
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
    this.ctx = wx.createCanvasContext("mycanvas", this);
  },
  /**
   * 绘制canvas
   */
  drawcanvas2() {
    var borderRadius = 30;
    var points = [{
      x: 100,
      y: 50
    }, {
      x: 200,
      y: 50
    }, {
      x: 200,
      y: 200
    }, {
        x: 100,
        y: 200
    }];
    this.ctx.beginPath();
    var len = points.length;
    for (var i = 0; i < len; i++) {
      var {
        x:x1,
        y:y1
      } = points[i];
      var {
        x: x2,
        y: y2
      } = points[(i + 1) % len];
      var {
        x: x3,
        y: y3
      } = points[(i + 2) % len];

      //起点坐标
      var {
        x:sX,
        y:sY
      } = this.getLocation(x1, y1, this.getA(x1, y1, x2, y2), borderRadius);;
      this.ctx.lineTo(sX, sY);
      //计算出第一条线和x轴的夹角
      var a1 = this.getA(x2, y2, x1, y1)
      //首先计算出下个点的坐标
      var {
        x:nX,
        y:nY
      } = this.getLocation(x2, y2, a1, borderRadius);
      this.ctx.lineTo(nX, nY);
      //计算出第二条线和x轴的夹角
      var a2 = this.getA(x2, y2, x3, y3);
      var {
        x:aX,
        y:aY
      } = this.getLocation(nX, nY, a2, borderRadius);

      //绘制圆弧

      this.ctx.arc(aX, aY, borderRadius, a2 + Math.PI, a1 + Math.PI);
    }
    this.ctx.closePath();
   

    this.ctx.setStrokeStyle('black');
    this.ctx.setLineWidth(10);
    this.ctx.stroke();
    this.ctx.draw();
    // console.log(distance1);

  },
  drawcanvas() {
    var borderRadius = 30;
    var points = [{
      x: 100,
      y: 50
    }, {
      x: 200,
      y: 50
    }, {
      x: 200,
      y: 200
    }, {
      x: 100,
      y: 200
    }];
    this.ctx.beginPath();
    var len = points.length;
    for (var i = 0; i < len; i++) {
      var {
        x: x1,
        y: y1
      } = points[(i - 1) % len];
      var {
        x: x2,
        y: y2
      } = points[i];
      var {
        x: x3,
        y: y3
      } = points[(i + 1) % len];

      //起点坐标
      var {
        x: sX,
        y: sY
      } = this.getLocation(x1, y1, this.getA(x1, y1, x2, y2), borderRadius);;
      // this.ctx.lineTo(sX, sY);
      //计算出第一条线和x轴的夹角
      var a1 = this.getA(x2, y2, x1, y1)
      //首先计算出下个点的坐标
      var {
        x: nX,
        y: nY
      } = this.getLocation(x2, y2, a1, borderRadius);
      this.ctx.lineTo(nX, nY);
      //计算出第二条线和x轴的夹角
      var a2 = this.getA(x2, y2, x3, y3);
      var {
        x: aX,
        y: aY
      } = this.getLocation(nX, nY, a2, borderRadius);

      //绘制圆弧

      this.ctx.arc(aX, aY, borderRadius, a2 + Math.PI, a1 + Math.PI);
    }
    this.ctx.closePath();


    this.ctx.setStrokeStyle('black');
    this.ctx.setLineWidth(10);
    this.ctx.stroke();
    this.ctx.draw();
    // console.log(distance1);

  },
  /**
   * 内部用的绘制圆角，borderRadius的值为0.5时，是圆形
   */
  createBorderRadiusPath(left, top, width, height, borderRadius) {
    var radius = height * borderRadius;
    this.ctx.beginPath();
    //画右下角
    this.ctx.lineTo(left + width, top + height - radius);
    if (borderRadius) {
      this.ctx.arc(left + width - radius, top + height - radius, radius, 0, 0.5 * Math.PI);
    }

    //画左下角
    this.ctx.lineTo(left + radius, top + height);
    if (borderRadius) {
      this.ctx.arc(left + radius, top + height - radius, radius, 0.5 * Math.PI, Math.PI);
    }

    //画左上角
    this.ctx.lineTo(left, top + radius);
    if (borderRadius) {
      this.ctx.arc(left + radius, top + radius, radius, Math.PI, 1.5 * Math.PI);
    }
    //画右上角
    this.ctx.lineTo(left + width - radius, top);
    if (borderRadius) {
      this.ctx.arc(left + width - radius, top + radius, radius, 1.5 * Math.PI, 0);
    }

    this.ctx.closePath();
  },
  /**
   * 根据三个点获取夹角的弧度
   */
  getJoinA(sX, sY, cX, cY, eX, eY) {
    var a1 = this.getA(cX, cY, sX, sY);
    var a2 = this.getA(cX, cY, eX, eY);
    console.log(a1, a2);
    return a1 - a2;
  },
  /**
   * 根据一个坐标,角度,半径,获取另一个角标
   */
  getLocation(x, y, A, radius) {
    return {
      x: x + radius * Math.cos(A), //Math.round(x + radius * Math.cos(A)),
      y: y + radius * Math.sin(A) //Math.round(y + radius * Math.sin(A))
    }
  },
  /**
   * 根据两点坐标计算出弧度
   */
  getA(sX, sY, eX, eY) {
    var tanA = (eY - sY) / (eX - sX);
    var A = Math.atan(tanA);
    if (eX >= sX && eY >= sY) {
      //在第一区域,不需要改变,包括右坐标和下坐标
    } else if (eX < sX && eY >= sY) {
      //在第二区域,包括左边坐标,负值
      A = A + Math.PI;
    } else if (eX < sX && eY < sY) {
      //在第三区域,不包括坐标,正值
      A = Math.PI + A;
    } else if (eX >= sX && eY < sY) {
      //在第四区域,包括上坐标,负值
      A = 2 * Math.PI + A;
    }
    //* 180 / Math.PI//* 180 / Math.PI
    return A
  },
  /**
   * 根据两点坐标计算出距离
   */
  getDistance(sX, sY, eX, eY) {
    return Math.sqrt(Math.pow(eY - sY, 2) + Math.pow(eX - sX, 2));
  },

})