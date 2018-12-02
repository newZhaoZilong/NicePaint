

export default class Superpaint {

  constructor(canvasContext) {
    this.canvasContext = canvasContext;
    this.stopped = false;
    this.isFirstDraw = true;
  }

  drawPolyLine({ polyline = [], isClosedLine = true }) {
    var that = this;
    return new Promise(function (resolve, reject) {
      that.stopped = false;
      if (polyline.length > 1) {
        if (isClosedLine) {
          polyline.push(polyline[0]);
          polyline.push(polyline[1]);//画最后一个角需要第二个点的坐标
        }
        polyline.reduce(function (total, currentValue, currentIndex, array) {
          if (currentIndex == 1) {
            return that.sDrawLine(total.x, total.y, currentValue.x, currentValue.y)
          } else if (currentIndex < polyline.length - 1 || !isClosedLine) {
            return total.then(function ([sX, sY, eX, eY]) {
              return that.sDrawHorn(sX, sY, eX, eY, currentValue.x, currentValue.y)
            })
              .then(function ([sX, sY, eX, eY]) {
                return that.sDrawLine(sX, sY, eX, eY);
              })
          } else {
            return total.then(function ([sX, sY, eX, eY]) {
              // //console.log(polyline, pointIndex)
              return that.sDrawHorn(sX, sY, eX, eY, currentValue.x, currentValue.y)
            })
          }
        })
          .then(function () {
            console.log('绘制结束');
            that.isFirstDraw = true;
            resolve()
          })
      }
    })

  }
  drawRect(x, y, width, height) {
    this.stopped = false;
    var that = this
    return new Promise(function (resolve, reject) {
      that.sDrawLine(x, y, x + width, y)
        .then(function ([sX, sY, eX, eY]) {
          //画topright角
          return that.sDrawHorn(sX, sY, eX, eY, x + width, y + height);
        })
        .then(function ([sX, sY, eX, eY]) {
          //画right线
          return that.sDrawLine(sX, sY, eX, eY);
        })
        .then(function ([sX, sY, eX, eY]) {
          //画rightbottom角
          return that.sDrawHorn(sX, sY, eX, eY, x, y + height);
        })
        .then(function ([sX, sY, eX, eY]) {
          //画bottom线
          return that.sDrawLine(sX, sY, eX, eY);
        })
        .then(function ([sX, sY, eX, eY]) {
          //画bottomleft角
          return that.sDrawHorn(sX, sY, eX, eY, x, y)
        })
        .then(function ([sX, sY, eX, eY]) {
          //画left线
          return that.sDrawLine(sX, sY, eX, eY);
        })
        .then(function ([sX, sY, eX, eY]) {
          //画bottomleft角
          return that.sDrawHorn(sX, sY, eX, eY, x + width, y);
        })
        .then(function () {
          that.isFirstDraw = true
          resolve();
        })
    })
  }
  /**
   * 我的绘制角的方法
   */
  sDrawHorn(sX, sY, mX, mY, eX, eY, distance = 10, lineWidth = 10) {
    var that = this;
    return new Promise(function (resolve, reject) {


      var A1 = that.getA(sX, sY, mX, mY);

      var startX = mX - distance * Math.cos(A1);
      var startY = mY - distance * Math.sin(A1);

      var A2 = that.getA(mX, mY, eX, eY);
      var endX = mX + distance * Math.cos(A2);
      var endY = mY + distance * Math.sin(A2);

      that.canvasContext.setLineWidth(lineWidth);
      that.canvasContext.setLineJoin('round');
      that.canvasContext.setStrokeStyle('yellow');

      that.canvasContext.moveTo(startX, startY);
      that.canvasContext.lineTo(mX, mY);
      that.canvasContext.lineTo(endX, endY);
      that.canvasContext.stroke();
      that.canvasContext.draw(true, function () {
        if (!that.stopped) {
          resolve([mX, mY, eX, eY])
        }
      });
    })




  }
  //传入起点和终点坐标就会画一条线
  sDrawLine(sX, sY, eX, eY, speed = 3, lineWidth = 10) {
    var that = this;

    this.canvasContext.setLineWidth(lineWidth);
    //获取A的弧度
    var A = this.getA(sX, sY, eX, eY);
    //console.log(A);
    //获取距离
    var distance = this.getDistance(sX, sY, eX, eY);
    // //console.log('distance', distance);
    return new Promise(function (resolve, reject) {
      (function drawShortLine(startX, startY) {
        //根据startX,startY,线段长度,弧度值计算出endX,和endY的值
        var endX = startX + 10 * Math.cos(A);
        var endY = startY + 10 * Math.sin(A);
        var currentDistance = that.getDistance(sX, sY, endX, endY);
        if (currentDistance >= distance) {
          //如果发现距离大于等于最大距离,执行回调函数并返回
          resolve([sX, sY, eX, eY]);
          return;
        }
        // var grd = that.canvasContext.createLinearGradient(startX, startY, endX, endY)
        // grd.addColorStop(0, 'red');
        // grd.addColorStop(0.6, 'white');
        // grd.addColorStop(1, 'white');
        that.canvasContext.setStrokeStyle('yellow');
        that.canvasContext.moveTo(startX, startY)
        that.canvasContext.lineTo(endX, endY);
        that.canvasContext.stroke();

        that.canvasContext.draw(!that.isFirstDraw, () => {
          that.drawline_timeid = setTimeout(() => {
            if (!that.stopped) {
              //画完第一个根据startX,startY和速度和弧度值计算出下个开始位置
              var nextStartX = startX + speed * Math.cos(A);
              var nextStartY = startY + speed * Math.sin(A);
              drawShortLine(nextStartX, nextStartY);
            }
          }, 10)
        })
        if (that.isFirstDraw) {
          that.isFirstDraw = false
        }
      })(sX, sY)
    })
  }

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
    return A //* 180 / Math.PI
  }
  getDistance(sX, sY, eX, eY) {
    return Math.sqrt(Math.pow(eY - sY, 2) + Math.pow(eX - sX, 2));
  }
  /**
   * 关闭绘制方法
   */
  close() {
    this.stopped = true;
    clearTimeout(this.drawline_timeid);
    this.isFirstDraw = true
  }

}