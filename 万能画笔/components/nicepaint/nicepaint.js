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
            }, () => {
              this.readyToDraw()
            })
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
    isPainting: false,
    clear: false
  },
  ready() {
    this.ctx = wx.createCanvasContext('canvasdrawer', this);
    //注册绘制方法，type类型=>对应处理方法,没新添加一个类型方法都要
    //在这里注册一下，这样写的好处调用方法的时候不需要进行条件判断
    this.data.canvasHandle = {
      'image': this.drawImage, //绘制图片
      'text': this.drawText, //绘制文本
      'rect': this.drawRect, //绘制长方形
      'arc': this.drawArc, //绘制圆弧,基本方法
      'polygon': this.drawPolygon, //绘制多边形，基本方法（核心）
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
     * 然后预先下载所有图片存储到缓存,(这一步如果图片太多可以提前调用downloadAllImageToCache将图片预先下载到本地)
     * 然后开始同步绘制元素views,
     * 绘制完views后将图片保存到本地，获取本地临时路径,
     * 然后隐藏canvas，并触发冒泡函数,将路径输出出去
     */
    readyToDraw() {
      const {
        width,
        height,
        views,
      } = this.data.painting;
      this.setData({
        canvasWidth: width,
        canvasHeight: height,
      }, () => {
        //这里如果不延时的话，安卓手机容易出错，错误现象是图片变形，就是canva的宽高并没有设置成功
        setTimeout(() => {
          this.downloadAllImageToCache(views, 'url')
            .then(() => {
              this.drawElements(views);
              this.ctx.draw(this.data.painting.clear || this.data.clear, () => {
                this.saveImageToLocal()
                  .then((res) => {
                    this.setData({
                      showCanvas: false,
                      isPainting: false,
                    })
                    this.triggerEvent('getImage', {
                      tempFilePath: res.tempFilePath,
                      errMsg: 'canvasdrawer:ok',
                      id: this.data.painting.id
                    })
                    console.log('全部元素绘制成功');
                  })
                  .catch((res) => {
                    this.setData({
                      showCanvas: false,
                      isPainting: false,
                    })
                    this.triggerEvent('getImage', {
                      errMsg: res.message
                    })
                  })
              })
            })
            .catch((res) => {
              this.setData({
                //如果改为true,连续绘制就会出错
                showCanvas: false,
                isPainting: false,
              })
              this.triggerEvent('getImage', {
                errMsg: res.message
              })
            })
        }, 300)
      });
    },
    /**
     * 将图片加载到缓存
     */
    downloadAllImageToCache(list, key) {
      var imgPromiselist = [];
      for (var i = 0; i < list.length; i++) {
        var imgUrl;
        if (key) {
          imgUrl = list[i][key];
        } else {
          imgUrl = list[i];
        }
        if (imgUrl) {
          imgPromiselist.push(this.getImagePath(imgUrl));
        }
      }
      return Promise.all(imgPromiselist);
    },
    /**
     * 遍历数组一次性绘制list中的所有元素
     */
    drawElements(list) {
      for (var i = 0; i < list.length; i++) {
        this.drawElement(list[i]);
      }
    },

    /**
     * drawElement是绘制单一元素的统一方法
     * 需要传入一个对象，对象必须有type属性，这样才能指定对应的
     * 绘制方法，config参数对象其实就是drawImage,drawText传入的参数对象多了一个type属性
     */
    drawElement(config) {
      console.log('将要绘制的元素类型', config.type);
      return this.data.canvasHandle[config.type].call(this, config);
    },

    /**
     * 绘制图片的方法,如果有圆角边框而且还有阴影的话,会首先绘制阴影然后使用clip指定绘制区域，
     * 然后绘制图片
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
      borderRadius //圆角边框,只支持不大于0.5的小数，例如0.5,0.4，是相对于高度,0.5会切成圆
    }) {
      //直接从缓存中取路径
      var path = this.data.cache[url];
      //如果不保存之前的绘图上下文的画，那么绘制阴影后，会影响到之后绘制的
      //图片
      this.ctx.save();
      this.setShadow(shadow);
      if (borderRadius) {
        this.createBorderRadiusPath(this.getPointsByInfo(left, top, width, height), borderRadius);
        if (shadow) {
          //这一步是为了绘制阴影
          this.ctx.fill();
        }
        this.ctx.clip();
      }

      if (sx) {
        this.ctx.drawImage(path, sx, sy, sWidth, sHeight, left, top, width, height);
      } else if (width) {
        this.ctx.drawImage(path, left, top, width, height);
      } else {
        this.ctx.drawImage(path, left, top);
      }
      //save+restore相当于重置之前的绘图上下文
      //避免设置的属性影响到其他图片
      this.ctx.restore();
      console.log('绘制图片成功', url);
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
      width, //文字的宽度，用于换行的,如果添加width，文字超出宽度时就会换行,不写width属性不会换行
      lineHeight, //文字的行高,
      textAlign = 'left', //文字对齐方式
      textBaseline = 'top', //文字相对于基线位置
      fontWeight = 'normal', //文本的粗细,只有normal和bold可用
      shadow //阴影,是个字符串类似'2 2 1 gray'
    }) {
      if (!lineHeight) {
        lineHeight = fontSize * 1.25;
      }

      this.ctx.save();

      this.setShadow(shadow);

      this.ctx.setTextBaseline(textBaseline);
      this.ctx.setTextAlign(textAlign);
      this.ctx.setFillStyle(color);

      var font_str = `${fontWeight} ${fontSize}px Arial`
      this.ctx.font = font_str;

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
     * 绘制rect,可能是描边，也可能是填充
     */
    drawRect({
      left = 0,
      top = 0,
      width = 100,
      height = 100,
      ...commonStyle
    }) {
      this.drawPolygon({
        points: this.getPointsByInfo(left, top, width, height),
        ...commonStyle
      });
      console.log('绘制矩形成功');
    },
    /**
     * 绘制能力表,需要传入中心点坐标,
     * 能力值的对象数组scores,每个对象有一个
     * score能力值属性,
     * color对应的颜色,例如[{score:80,color:'red'},{score:70,color:'red'}]
     */
    drawAbilityChart({
      x, //中心点x坐标
      y, //中心点y坐标
      radius = 100, //半径
      isCenter = true, //是否需要中心点，为false的话，就直接画个多边形
      scores, //能力值数组,必须写颜色,和能力值
      vertexColors = [], //顶点的颜色数组
      net, //网格配置是一个对象
      polygon = {}, //中心多边形配置
      vertex = {}, //顶点配置
      // border,//边框配置
    }) {
      // this.ctx.save();
      //对于多边形层框，分为三步，再画中心多边形,先画层框，最后画点
      var points = this.getRegularPolygonLocations({
        x,
        y,
        radius,
        rates: scores.map((v) => v.score)
      });
      points.forEach((v, i) => {
        v.color = scores[i].color
      })
      console.log(points);
      //是否使用网格
      if (net) {
        this.drawNet({
          x,
          y,
          radius,
          lines: scores.length,
          ...net,
        });
      }
      //是否绘制中心多边形，不绘制的话，就直接绘制一个多边形
      if (isCenter) {
        this.drawCenterPolygon({
          x,
          y,
          points,
          ...polygon
        });
      } else {
        this.drawPolygon({
          points,
          ...polygon
        })
      }

      points.forEach((v, i) => {
        this.drawArc({
          ...vertex,
          x: v.x,
          y: v.y,
          color: vertexColors[i] || scores[i].color,
        })
      })
      // this.ctx.restore();
    },

    /**
     * 绘制同心圆或者同心正多边形,可设置层级,
     * 同心圆和同心正多边形可一块绘制,
     * 绘制方法是首先循环层级，从最外层开始
     * 依次获取每个层级的坐标然后绘制，由最外层绘制到最内层
     *       isFill = true, //是否填充
     *    isStroke = false, //是否描边
     * color = 'red', //填充颜色
     * lineWidth = 10, //边框宽度
     * lineColor, //如果不写默认是color
     *  shadow,
     * borderRadius = 0
     *这7个属性为常用属性,一般会放入commonStyle对象中
     */
    drawNet({
      x,
      y,
      radius = 100,
      level = 2, //层级
      colors, //颜色数组,如果此属性存在,color无效,['yellow','red','green']
      isArc = false, //是否绘制圆
      isPolygon = true, //是否绘制正多边形
      isVertexLine = true, //是否绘制中心点到顶点的连线
      lines = 4,
      ...commonStyle
    }) {

      this.ctx.save();
      var color = commonStyle.color;
      var interval = radius / level;
      var count = 0;

      while (count < level) {
        if (colors && colors.length > 0) {
          var index = count % colors.length;
          color = colors[index];
        }
        if (isPolygon || (isVertexLine && count == 0)) {
          var locations = this.getRegularPolygonLocations({
            x,
            y,
            radius: radius - count * interval,
            lines,
          });
        }

        //画顶点到中心的连线
        if (!commonStyle.isFill && isVertexLine && count == 0) {
          locations.forEach((v) => {
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(v.x, v.y);
          })
          this.ctx.setLineWidth(commonStyle.lineWidth);
          this.ctx.setStrokeStyle(color);
          this.ctx.stroke();
        }
        // console.log('locations', JSON.stringify(locations));

        if (isArc) { //绘制圆
          this.drawArc({
            ...commonStyle,
            x,
            y,
            radius: radius - count * interval,
          });
        }
        //绘制多边形
        if (isPolygon) {
          this.drawPolygon({
            ...commonStyle,
            color,
            points: locations,
          });
          if (commonStyle.shadow && commonStyle.isFill && count == 0) {
            //如果是fill的话，只绘制一个圆的阴影
            commonStyle.shadow = null;
          }
        }
        count++;
      }

      this.ctx.restore();

      console.log('绘制网格成功');
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
      points, //顶点的坐标数组，[{x:10,y:10,color:'red'},{x:100,y:10,color:'green'},{x:50,y:200,color:'blue'}]
      shadow,
      border,
      ...commonStyle
    }) {
      console.log('commonStyle', commonStyle);
      if (!points) {
        console.log('绘制中心多边形points是必须的!', points);
        return;
      };
      if (shadow) {
        this.drawPolygon({
          isFill: true,
          isStroke: false,
          shadow,
          points: points
        });
      }
      //循环绘制每个三角区域
      for (var i = 0; i < points.length; i++) {
        var nextIndex = (i + 1) % points.length;
        this.drawPolygon({
          ...commonStyle,
          color: points[i].color,
          points: [points[i], points[nextIndex], {
            x,
            y
          }]
        });
      }

      //是否在外围添加一个统一的边框
      if (border) {
        this.drawPolygon({
          ...border,
          isFill: false,
          isStroke: true,
          points
        })
      }


      console.log('绘制中心多边形成功');
    },
    /**
     * 绘制多边形
     */
    drawPolygon({
      points, //坐标数组类似[{x:10,y:10},{x:100,y:10},{x:50,y:100}]
      isFill = false, //是否填充
      isStroke = true, //是否描边
      color = 'red', //填充颜色   
      lineWidth = 10, //边框宽度
      lineColor, //如果不写默认是color
      shadow,
      borderRadius = 0,
      lineJoin = 'round',
      lineDash
    }) {
      if (!points) return;
      this.ctx.save();
      this.setShadow(shadow);
      this.createBorderRadiusPath(points, borderRadius);
      if (isFill) {
        this.ctx.setFillStyle(color);
        this.ctx.fill();
        this.setShadow(null);
      }
      if (isStroke) {
        this.ctx.setLineJoin(lineJoin);
        this.ctx.setLineWidth(lineWidth);
        this.ctx.setStrokeStyle(lineColor || color);
        if (lineDash) {
          this.ctx.setLineDash(lineDash, 0)
        }
        this.ctx.stroke();
      }
      this.ctx.restore();
      console.log('绘制多边形成功');
    },
    /**
     * 绘制圆弧
     */
    drawArc({
      isFill = true,
      isStroke = false,
      x = 10,
      y = 10,
      radius = 30,
      sA = 0,
      eA = Math.PI * 2,
      isClockwise = false,
      color,
      lineWidth = 2,
      lineColor,
      shadow,
      lineDash
    }) {
      // console.log('绘制圆的颜色',color);
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, sA, eA, isClockwise);
      this.ctx.closePath();
      this.setShadow(shadow);
      if (isFill) {
        this.ctx.setFillStyle(color);
        this.ctx.setFillStyle(color);
        this.ctx.fill();
        this.setShadow(null);
      }
      if (isStroke) {
        this.ctx.setLineWidth(lineWidth);
        this.ctx.setStrokeStyle(lineColor || color);
        if (lineDash) {
          this.ctx.setLineDash(lineDash, 0)
        }
        this.ctx.stroke();
      }

      this.ctx.restore();
      console.log('绘制圆弧成功');
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
      startA = Math.PI * 1.5, //开始的弧度,
      isClockwise = false //false是逆时针,true为正湿疹
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
        var A = isClockwise ? startA + count * intervalA : startA - count * intervalA //% (Math.PI * 2)
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
        x: Math.round(x + radius * Math.cos(A)),
        y: Math.round(y + radius * Math.sin(A))
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
     * 设置阴影
     */
    setShadow(shadow) {
      if (shadow) {
        var shadow_list = shadow.split(' ');
        if (shadow_list.length < 3) {
          console.log('shadow4个属性必须全部填写!!!!!!!!!');
        }
        this.ctx.setShadow(...shadow_list);
      } else {
        console.log('清除阴影');
        this.ctx.setShadow(0, 0, 0, 'black');
      }
    },
    // /**
    //  * 内部用的绘制圆角，borderRadius的值为0.5时，是圆形
    //  */
    // createBorderRadiusPath(left, top, width, height, borderRadius) {

    //   var radius = height * borderRadius;
    //   this.ctx.beginPath();
    //   //画右下角
    //   this.ctx.lineTo(left + width, top + height - radius);
    //   if (borderRadius) {
    //     this.ctx.arc(left + width - radius, top + height - radius, radius, 0, 0.5 * Math.PI);
    //   }

    //   //画左下角
    //   this.ctx.lineTo(left + radius, top + height);
    //   if (borderRadius) {
    //     this.ctx.arc(left + radius, top + height - radius, radius, 0.5 * Math.PI, Math.PI);
    //   }

    //   //画左上角
    //   this.ctx.lineTo(left, top + radius);
    //   if (borderRadius) {
    //     this.ctx.arc(left + radius, top + radius, radius, Math.PI, 1.5 * Math.PI);
    //   }
    //   //画右上角
    //   this.ctx.lineTo(left + width - radius, top);
    //   if (borderRadius) {
    //     this.ctx.arc(left + width - radius, top + radius, radius, 1.5 * Math.PI, 0);
    //   }

    //   this.ctx.closePath();
    // },
    createBorderRadiusPath(points, borderRadius = 0) {
      this.ctx.beginPath();
      var len = points.length;
      // console.log('points', points);
      if (borderRadius) {
        for (var i = 0; i < len; i++) {
          var {
            x: x1,
            y: y1
          } = points[(i - 1 + len) % len];
          var {
            x: x2,
            y: y2
          } = points[i];
          var {
            x: x3,
            y: y3
          } = points[(i + 1) % len];

          var a1 = this.getA(x2, y2, x1, y1);
          var a2 = this.getA(x2, y2, x3, y3);
          var a3 = (Math.PI-(a1-a2)) / 2;
          var distance = borderRadius * Math.abs(Math.tan(a3));
          var {
            x: sX,
            y: sY
          } = this.getLocation(x2, y2, a1, distance);
          this.ctx.lineTo(sX, sY);
          var {
            x: eX,
            y: eY
          } = this.getLocation(x2, y2, a2, distance);

          this.ctx.arcTo(x2, y2, eX, eY, borderRadius);
        }
      } else {
        for (var i = 0; i < len; i++) {
          this.ctx.lineTo(points[i].x, points[i].y);
        }
      }
      this.ctx.closePath();
    },
    /**
     * 根据left,top,width,height计算出4个点的坐标
     */
    getPointsByInfo(left, top, width, height) {
      return [{
        x: left,
        y: top
      }, {
        x: left + width,
        y: top
      }, {
        x: left + width,
        y: top + height
      }, {
        x: left,
        y: top + height
      }]
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
          resolve(this.data.cache[url]);
        } else {
          const objExp = new RegExp(/^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/);
          if (objExp.test(url)) {
            wx.getImageInfo({
              src: url,
              complete: res => {
                if (res.errMsg === 'getImageInfo:ok') {
                  this.data.cache[url] = res.path;
                  console.log('下载图片成功', url);
                  resolve(res.path);
                } else {
                  reject('下载图片到本地失败');
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
     * 将canvas绘制的图片保存到本地,并输出图片路径
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
              reject('将canvas绘制的图片保存到本地失败');
            }
          }
        }, this)
      })
    }
  }
})