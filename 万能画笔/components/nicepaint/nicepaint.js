// components/nicepaint/nicepaint.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    painting: {
      type: Object,
      value: {
        view: []
      },
      observer(newVal, oldVal) {
        if (!this.data.isPainting) {
          if (newVal && newVal.width && newVal.height) {
            this.setData({
              showCanvas: true,
              isPainting: true
            })
            this.readyPigment()
          }
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showCanvas: false,
    //图片缓存
    cache: {},
    isPainting: false
  },
  ready() {
    this.ctx = wx.createCanvasContext('canvasdrawer', this);
    //注册绘制方法，type类型=>对应处理方法,没新添加一个类型方法都要
    //在这里注册一下，这样写的好处调用方法的时候不需要进行条件判断
    this.data.canvasHandle = {
      'image': this.drawImage, //绘制图片
      'text': this.drawText, //绘制文本
      'rect': this.drawRect, //绘制长方形
      'arc': this.drawArc, //绘制圆弧
      'polygon': this.drawPolygon, //绘制多边形
      'centerpolygon': this.drawCenterPolygon, //绘制中心多边形
      'net': this.drawNet, //绘制网格   
      'abilitychart': this.drawAbilityChart //绘制能力表
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 开始绘制,基本步骤就是
     * 首先设置canvas宽高,
     * 然后预先下载所有图片存储到缓存
     * 然后开始同步绘制views,
     * 绘制完views后将图片保存到本地，获取本地临时路径,
     * 然后关闭canvas，并触发冒泡函数,将路径输出出去
     */
    readyPigment() {
      const {
        width,
        height,
        views,
        clear
      } = this.data.painting;
      console.log('当前页面的width,height,views', width, height, views)
      this.setData({
        canvasWidth: width,
        canvasHeight: height,
      })
      //调用drawElements绘制图片     
      this.downloadAllImageToCache(views)
        .then(() => {
          this.drawElements(views);
          this.ctx.draw(clear, () => {
            this.saveImageToLocal()
              .then((res) => {
                this.setData({
                  showCanvas: false,
                  isPainting: false,
                })
                this.triggerEvent('getImage', {
                  tempFilePath: res.tempFilePath,
                  errMsg: 'canvasdrawer:ok'
                })
              })
              .catch((res) => {
                this.setData({
                  showCanvas: false,
                  isPainting: false,
                })
                this.triggerEvent('getImage', {
                  errMsg: 'canvasdrawer:fail'
                })
              })
          })
        })
        .catch(() => {
          this.setData({
            showCanvas: false,
            isPainting: false,
          })
          this.triggerEvent('getImage', {
            errMsg: 'canvasdrawer:fail'
          })
        })
    },
    /**
     * 将图片加载到缓存
     */
    downloadAllImageToCache(list) {
      var imglist = [];
      for (var i = 0; i < list.length; i++) {
        if (list[i].type == 'image') {
          imglist.push(this.getImagePath(list[i].url));
        }
      }
      return Promise.all(imglist);
    },
    /**
     * 遍历数组一次性绘制多个元素
     */
    drawElements(list) {
      for (var i = 0; i < list.length; i++) {
        this.drawElement(list[i]);
      }
    },

    /**
     * drawElement是绘制单一元素的统一方法
     * 需要传入一个对象，对象必须有type属性，这样才能指定对应的
     * 绘制方法，config参数对象其实就是drawImage,drawText传入的对象多了一个type属性
     */
    drawElement(config) {
      console.log('元素类型', config.type);
      return this.data.canvasHandle[config.type].call(this, config);
    },

    /**
     * 绘制图片的方法，sx,sy,sWidth,sHeight四个属性是选择图片的部分区域画到画布上
     */
    drawImage({
      url, //图片url地址，可以是本地路径，也可以是网络路径
      left = 0, //图像的左上角在目标 canvas 上 x 轴的位置
      top = 0, //图像的左上角在目标 canvas 上 y 轴的位置
      width, //在目标画布上绘制图像的宽度，允许对绘制的图像进行缩放
      height, //在目标画布上绘制图像的高度，允许对绘制的图像进行缩放
      sx, //源图像的矩形选择框的左上角 x 坐标
      sy, //源图像的矩形选择框的左上角 y 坐标
      sWidth, //源图像的矩形选择框的宽度
      sHeight, //源图像的矩形选择框的高度
      shadow, //阴影,是个字符串类似'2 2 1 gray'
      borderRadius //阴影和borderRadius不能共存,都设置的话，取borderRadius
    }) {
      //直接从缓存中取路径
      var path = this.data.cache[url];
      //如果不保存之前的绘图上下文的画，那么绘制阴影后，会影响到之后绘制的
      //图片
      this.ctx.save();
      if (borderRadius) {
        this.clipBorder(left, top, width, height, borderRadius, shadow);
      }

      if (shadow && !borderRadius) {
        var shadow_list = shadow.split(' ');
        if (shadow_list.length < 3) {
          reject('shadow4个属性必须全部填写');
        }
        this.ctx.setShadow(...shadow_list);
      }
      console.log('当前图片本地路径', path);

      if (sx) {
        this.ctx.drawImage(path, sx, sy, sWidth, sHeight, left, top, width, height);
      } else if (width) {
        this.ctx.drawImage(path, left, top, width, height);
      } else {
        this.ctx.drawImage(path, left, top);
      }
      //save+restore相当于重制之前的绘图上下文
      //避免设置的属性影响到其他图片
      this.ctx.restore();
    },

    /**
     * 绘制文字，left表示文字的x坐标,top代表y坐标
     * 一般left,top的位置就是文字左上角的位置，当然也可以通过textAlign和textBaseline修改
     * 可以设置width，可以自动换行
     */
    drawText({
      color = 'black', //文字的颜色
      content = '', //文字的内容
      fontSize = 16, //文字的尺寸
      left = 0, //文字位于画布的x坐标
      top = 0, //文字位于画布的y坐标
      width, //文字的宽度，用于换行的
      lineHeight = 20, //文字的行高,
      textAlign = 'left', //文字
      textBaseline = 'top',
      font //如果定义了font，那么fontSize无效，font-weight只有normal和bold两个有效
      //font是字符串格式类似,必须是30px而不是只有30这个数字   ‘bold 30px Arial‘
    }) {

      this.ctx.save();

      this.ctx.setTextBaseline(textBaseline);
      this.ctx.setTextAlign(textAlign);
      this.ctx.setFillStyle(color);
      if (font) {
        this.ctx.font = font;
      } else {
        this.ctx.setFontSize(fontSize);
      }

      var lineFontNumber = content.length; //字符个数
      var fillText = ''; //累加字符串
      var lineNumber = 1; //当前行数，0是第一行
      /**
       * 自动换行功能，主要是循环累加判断字符串长度，如果大于宽度
       * 就截取字符串输出，然后继续累加之后的字符串
       */
      if (!width) {
        this.ctx.fillText(content, left, top);
      } else {
        for (var i = 0; i < content.length; i++) {
          fillText += content[i];
          var textLength = this.ctx.measureText(fillText).width;
          //如果文字长度大于宽度，就输出并换行
          if (textLength > width) {
            var realText = fillText.slice(0, -1);
            var realTop = top + (lineNumber - 1) * lineHeight;
            this.ctx.fillText(realText, left, realTop);
            fillText = fillText.slice(-1);
            lineNumber++;
          }
          if (i === content.length - 1) {
            var realTop = top + (lineNumber - 1) * lineHeight;
            this.ctx.fillText(fillText, left, realTop);
          }
        }
      }
      this.ctx.restore();

    },
    /**
     * 绘制rect,可能是瞄边，也可能是填充
     */
    drawRect({
      top = 0,
      left = 0,
      width = this.data.canvasWidth,
      height = this.data.canvasHeight,
      isFill = true,
      lineWidth = 10,
      color = 'red',
      borderRadius
    }) {
      console.log('当前drawRectwidth', width);

      this.ctx.save();
      if (borderRadius) {
        this.clipBorder(left, top, width, height, borderRadius);
      }
      if (isFill) {
        this.ctx.setFillStyle(color);
        this.ctx.fillRect(top, left, width, height);

      } else {
        this.ctx.setStrokeStyle(color);
        this.ctx.strokeRect(top, left, width, height);
      }

      this.ctx.restore();
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
      net = {},
      polygon = {},
      vertex = {}
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
        this.drawNet(net);
        this.drawCenterPolygon(polygon);
      } else {
        this.drawCenterPolygon(polygon);
        net.lines = scores.length;
        this.drawNet(net);
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
    drawNet({
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
      isPolygon = true,
      isCenter
    }) {
      // //是否画中线
      // if (isPolygon && !isFill && isCenter) {
      //   // var interval_A ;
      //   this.ctx.save();

      //   this.ctx.moveTo(x, y);
      //   this.ctx.lineTo(x, y - radius);

      //   this.ctx.setLineWidth(lineWidth);
      //   this.ctx.setStrokeStyle(color);
      //   this.ctx.stroke();
      //   this.ctx.rotate(1);
      //   this.ctx.rotate(2);
      //   this.ctx.restore();
      // }
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
          //画中心线
          if (isPolygon && !isFill && isCenter && count == 0) {
            locations.forEach((v) => {
              this.ctx.moveTo(x, y);
              this.ctx.lineTo(v.x, v.y);
            })
            this.ctx.setLineWidth(lineWidth);
            this.ctx.setStrokeStyle(color);
            this.ctx.stroke();
          }

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
      return A //* 180 / Math.PI
    },
    /**
     * 根据两点坐标计算出距离
     */
    getDistance(sX, sY, eX, eY) {
      return Math.sqrt(Math.pow(eY - sY, 2) + Math.pow(eX - sX, 2));
    },
    /**
     * 对边框进行裁剪的小方法，可以将方形，图片裁剪出borderRadius
     * clip=true是用于切角，
     * clip=false是用于绘制阴影
     */
    clipBorder(left, top, width, height, borderRadius, shadow) {
      if (borderRadius > 0.5) {
        return;
      }
      var radius = height * borderRadius;
      this.ctx.beginPath();
      //画左上角
      this.ctx.moveTo(left + width - radius, top);
      this.ctx.arc(left + width - radius, top + radius, radius, 1.5 * Math.PI, 0);
      //画右下角
      this.ctx.lineTo(left + width, top + height - radius);
      this.ctx.arc(left + width - radius, top + height - radius, radius, 0, 0.5 * Math.PI);
      //画左下角
      this.ctx.lineTo(left + radius, top + height);
      this.ctx.arc(left + radius, top + height - radius, radius, 0.5 * Math.PI, Math.PI);
      //画左上角
      this.ctx.lineTo(left, top + radius);
      this.ctx.arc(left + radius, top + radius, radius, Math.PI, 1.5 * Math.PI);

      this.ctx.closePath();
      if (shadow) {
        var shadow_list = shadow.split(' ');
        //shadow4个属性必须全部填写
        this.ctx.setShadow(...shadow_list);
        //如果不用fill的话，阴影会变成一个圈，如果设置透明色的话，阴影也会变透明
        this.ctx.fill();
      }
      this.ctx.clip();
    },



    /**
     * 获取图片路径，其原理是首先判断缓存里是否有之前的url，
     * 如果没有就判断是本地的还是网络的，如果是网络的就通过getImageInfo获取
     * 如果是本地的直接返回
     */
    getImagePath(url) {
      return new Promise((resolve, reject) => {
        if (!url) {
          reject('图片路径不能为空');
        }
        if (this.data.cache[url]) {
          console.log('返回缓存中的图片', this.data.cache[url])
          resolve(this.data.cache[url]);
        } else {
          const objExp = new RegExp(/^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/);
          if (objExp.test(url)) {
            wx.getImageInfo({
              src: url,
              complete: res => {
                if (res.errMsg === 'getImageInfo:ok') {

                  this.data.cache[url] = res.path;
                  console.log('下载图片成功', this.data.cache[url])
                  resolve(res.path);
                } else {
                  reject('getImagePath fail');
                }
              }
            })
          } else {
            this.data.cache[url] = url;
            resolve(url);
          }
        }
      })
    },


    /**
     * 输出图片路径
     */
    saveImageToLocal() {
      const {
        canvasWidth: width,
        canvasHeight: height
      } = this.data;
      return new Promise((resolve, reject) => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width,
          height,
          canvasId: 'canvasdrawer',
          complete: res => {
            if (res.errMsg === 'canvasToTempFilePath:ok') {
              resolve(res);
            } else {
              reject(res);
            }
          }
        }, this)
      })
    }
  }
})