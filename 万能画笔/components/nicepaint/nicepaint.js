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
          if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
            if (newVal && newVal.width && newVal.height) {
              this.setData({
                showCanvas: true,
                isPainting: true
              })
              this.readyPigment()
            }
          } else {
            if (newVal && newVal.mode !== 'same') {
              this.triggerEvent('getImage', {
                errMsg: 'canvasdrawer:samme params'
              })
            }
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
    //canvas默认宽高
    canvasWidth: 100,
    canvasHeight: 100,
    //图片缓存
    cache: {},
    clear: true,


    isPainting: false
  },
  ready() {
    this.ctx = wx.createCanvasContext('canvasdrawer', this);
    this.data.canvasHandle = {
      'image': this.drawImage,
      'text': this.drawText,
      'rect': this.drawRect
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 开始绘制,基本步骤就是首先设置canvas宽高,然后开始绘制views,绘制完views后将图片保存
     * 到本地，获取本地临时路径,然后关闭canvas，并触发冒泡函数,将路径输出出去
     */
    readyPigment() {
      console.log(this.data.paint);
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
        clear
      })
      //调用drawElements绘制图片     
      this.downAllImageToCache(views)
        .then(() => {
          this.drawElements(views);
          this.ctx.draw(this.data.clear, () => {
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
                this.triggerEvent('getImage', {
                  errMsg: 'canvasdrawer:fail'
                })
              })
          })
        })
        .catch(()=>{
          this.triggerEvent('getImage', {
            errMsg: 'canvasdrawer:fail'
          })
        })

    },
    /**
     * 将图片加载到缓存
     */
    downAllImageToCache(list) {
      var imglist = [];
      for (var i = 0; i < list.length; i++) {
        if (list[i].type == 'image') {
          imglist.push(this.getImagePath(list[i].url));
        }
      }
      return Promise.all(imglist);
    },

    drawElements(list){
      for(var i=0;i<list.length;i++){
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
      if(!width){
        this.ctx.fillText(content, left, top);
      }else{
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
      width,
      height,
      isFill = true,
      lineWidth = 10,
      color = 'red',
      borderRadius
    }) {
      if(!width){
        width = this.data.canvasWidth;
      }
      if(!height){
        height = this.data.canvasHeight;
      }

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