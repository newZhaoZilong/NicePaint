class NicePaint {
  constructor(canvasId) {
    this.canvasId = canvasId;
    this.ctx = wx.createCanvasContext(canvasId);
    this.cache = {};
    /**
     * 这是一个type注册表，注册了不同type对应的绘制方法,
     * 这样就省去了判断type的步骤，直接通过查询type注册表执行
     * 对应的函数
     */
    this.canvasHandle = {
      'image': this.drawImage.bind(this),
      'text': this.drawText.bind(this),
      'rect': this.drawRect.bind(this)
    }
  }
  /**
   * 在构造函数里写this.draw = this.ctx.draw;结果在开发工具上不显示
   * 所以只能这样写
   */
  draw(...args) {
    return this.ctx.draw(...args);
  }

  /**
   * drawElements是绘制元素的终极方法，接收一个数组，
   * 会依次绘制数组中的元素，与drawElementsInOrder不同的是，
   * 如果遇到元素是数组，将会调用drawElementsTogether方法，基本上所有
   * 的海报都可以通过该方法快速生成
   */
  drawElements(list) {
    var result;
    list.forEach((value, index) => {
      var method = (value instanceof Array) ? this.drawElementsTogether.bind(this) : this.drawElement.bind(this);
      if (index === 0) {
        //从数组的第一个开始
        result = method(value);
      } else {
        result = result.then(() => {
          //依次执行所有任务
          return method(value);
        })
      }
    })
    return result;
  }
  /**
   * 接收一个数组，循环的调用drawElement和drawElementsInOrder
   * 绘制元素，drawElementsTogether会同时的绘制数组中的所有
   * 元素，并等待所有的绘制完毕
   */
  drawElementsTogether(list) {
    return Promise.all(list.map((v) => {
      if (v instanceof Array) {
        return this.drawElementsInOrder(v);
      } else {
        return this.drawElement(v);
      }
    }))
  }


  /**
   * 接收一个数组，循环的调用drawElement绘制元素,
   * 本来想用reduce做叠加的，结果好像用了还麻烦，算了，
   * drawElementsInOrder会依次绘制完数组中的所有元素
   */
  drawElementsInOrder(list) {
    var result;
    list.forEach((value, index) => {
      if (index === 0) {
        //从数组的第一个开始
        result = this.drawElement(value);
      } else {
        result = result.then(() => {
          //依次执行所有任务
          return this.drawElement(value);
        })
      }
    })
    return result;
  }

  /**
   * drawElement是绘制单一元素的统一方法
   * 需要传入一个对象，对象必须有type属性，这样才能指定对应的
   * 绘制方法，config参数对象其实就是drawImage,drawText传入的对象多了一个type属性
   */
  drawElement(config) {
    console.log('元素类型', config.type);
    return this.canvasHandle[config.type](config);
  }

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

    return new Promise((resolve, reject) => {
      this.getImagePath(url)
        .then((path) => {
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
          resolve();
        })
        .catch(reject);
    })
  }

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
    width = 300, //文字的宽度，用于换行的
    lineHeight = 20, //文字的行高,
    textAlign = 'left', //文字
    textBaseline = 'top',
    font //如果定义了font，那么fontSize无效，font-weight只有normal和bold两个有效
    //font是字符串格式类似,必须是30px而不是只有30这个数字   ‘bold 30px Arial‘
  }) {
    return new Promise((resolve, reject) => {
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
      this.ctx.restore();
      resolve();
    })
  }
  /**
   * 绘制rect,可能是瞄边，也可能是填充
   */
  drawRect({
    top = 10,
    left = 10,
    width = 200,
    height = 200,
    isFill = true,
    lineWidth = 10,
    color = 'red',
    borderRadius
  }) {
    return new Promise((resolve, reject) => {
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
      resolve();
    })
  }
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
    if (shadow){
      var shadow_list = shadow.split(' ');
      //shadow4个属性必须全部填写
      this.ctx.setShadow(...shadow_list);
      //如果不用fill的话，阴影会变成一个圈，如果设置透明色的话，阴影也会变透明
      this.ctx.fill();
    }
    this.ctx.clip();
  }



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
      if (this.cache[url]) {
        resolve(this.cache[url]);
      } else {
        const objExp = new RegExp(/^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/);
        if (objExp.test(url)) {
          wx.getImageInfo({
            src: url,
            complete: res => {
              if (res.errMsg === 'getImageInfo:ok') {
                this.cache[url] = res.path;
                resolve(res.path);
              } else {
                reject('getImagePath fail');
              }
            }
          })
        } else {
          this.cache[url] = url;
          resolve(url);
        }
      }
    })
  }
  /**
   * 保存图片到相册
   */
  saveImage({
    left, //指定的画布区域的左上角横坐标
    right, //指定的画布区域的左上角纵坐标，
    width, //指定的画布区域的宽度，
    height, //指定的画布区域的高度
    destWidth, //输出的图片的宽度
    destHeight, //输出的图片的高度
    canvasId, //画布标识
    quality = 1 //图片的质量
  } = {}) {
    return new Promise((resolve, reject) => {
      if (!canvasId) {
        canvasId = this.canvasId;
      }
      wx.canvasToTempFilePath({
        x: left,
        y: right,
        height,
        destWidth,
        destHeight,
        canvasId,
        quality,
        success(res) {
          wx.authorize({ //判断是否有权限
            scope: 'scope.writePhotosAlbum',
            success() {
              wx.saveImageToPhotosAlbum({ //将图片保存到图库
                filePath: res.tempFilePath,
                success: resolve,
                fail: reject
              })
            },
            fail: reject
          })
        },
        fail: reject
      })
    })
  }
}


//导出，因为公司是主要应用es5的，所以没有用export default class NicePaint;
module.exports = NicePaint;