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

  },
  /**
   * 绘制canvas
   */
  drawcanvas() {
    var points = [{
      x: 10,
      y: 10
    }, {
      x: 100,
      y: 100
    }, {
      x: 10,
      y: 190
    }];
    var borderRadius = 20;

    var distance = this.getDistance(10,10,100,100);
    var a = this.getA(10, 10, 100, 100);
    var distance1 = this.getLocation(10, 10, a, distance - borderRadius);
    
    console.log(distance1);

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
    //* 180 / Math.PI
    return A * 180 / Math.PI
  },
  /**
   * 根据两点坐标计算出距离
   */
  getDistance(sX, sY, eX, eY) {
    return Math.sqrt(Math.pow(eY - sY, 2) + Math.pow(eX - sX, 2));
  },

})