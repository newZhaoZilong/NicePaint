//index.js
//获取应用实例
const app = getApp()
var NicePaint = require('../../utils/NicePaint.js');
Page({
  data: {
    imgUrl1: '/images/99.png',
    imgUrl2: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543518497476&di=0aa0c309131083d7dba800d4aa889d03&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F8b82b9014a90f6037cb445933312b31bb151edda.jpg',
    scancodeUrl: 'https://productionvote.changingstudy.com/oSjgK0bvBk1mlVxVKUCDjmHg38QI20181121125737.jpg',
  },

  onLoad: function() {

  },
  onShareAppMessage() {
    return {
      title: this.shareDesc,
      path: this.route,
      imageUrl: this.activityImg,
      success: (res) => {
        console.log(res);
        // 小米 8 有时能走进来 有时候不能
      }

    }

  },
  onPush: function() {
    let obj = {
      top: '(4)',
      center: 'D',
      deep: '测试'
    }
    this.data.items.push(obj)
    this.setData({
      items: this.data.items
    })
    console.log('items', this.data.items)
  },


  /**
   * 绘制矩形
   */
  drawRect() {
    this.setData({
      painting: {
        width: 200, //画布宽，也是导出图片的尺寸
        height: 200, //画布高
        views: [{
          type: 'rect', //绘制网格
          left: 20,
          top: 50,
          width: 150,
          height: 100,
          color: 'blue',
          isFill: true,
          isStroke: false, //是否描边，默认false
          lineColor: 'red', //边框颜色,默认color
          borderRadius: 10, //圆角边框，默认为0,单位是px
          shadow: '20 20 2 black' //阴影
        }]
      }
    })
  },

  /**
   * 绘制圆形
   */
  drawArc() {
    this.setData({
      painting: {
        width: 200, //画布宽，也是导出图片的尺寸
        height: 200, //画布高
        views: [{
          type: 'arc', //绘制网格
          x: 100,
          y: 100,
          radius: 80,
          color: 'blue',
          isFill: true,
          isStroke: true, //是否描边，默认false
          lineWidth: 10,
          lineColor: 'red', //边框颜色,默认color
          borderRadius: 10, //圆角边框，默认为0
          shadow: '10 10 2 black' //阴影
        }]
      }
    })
  },
  /**
   * 绘制多边形
   */
  drawPolygon() {
    this.setData({
      painting: {
        width: 200, //画布宽，也是导出图片的尺寸
        height: 200, //画布高
        views: [{
          type: 'polygon', //绘制网格
          color: 'yellow', //填充颜色
          isFill: false, //是否填充
          isStroke: true, //是否描边
          lineColor: 'red', //边框颜色,不写和color一样
          shadow: '20 20 5 black', //阴影，因为描边是覆盖在在填充上,所以'1 1 0 black'会被描边覆盖
          borderRadius: 5, //圆角边框
          points: [{ //points里是4个顶点的坐标
            x: 50,
            y: 50,
          }, {
            x: 100,
            y: 10,
          }, {
            x: 150,
            y: 50,
          }, {
            x: 150,
            y: 180,
          }, {
            x: 20,
            y: 150
          }]
        }]
      }
    })
  },
  /**
   * 绘制网格
   */
  drawNet() {
    this.setData({
      painting: {
        width: 200, //画布宽，也是导出图片的尺寸
        height: 200, //画布高
        views: [{
          type: 'net', //绘制网格
          x: 100, //中心点横坐标
          y: 100, //中心点纵坐标
          radius: 80, //半径
          level: 5, //层级，就是5个圈
          isArc: false, //是否是圆,
          isPolygon: true, //是否是多边形
          isFill: false, //是否是填充
          isStroke: true, //是否描边，与填充不能共存
          lineWidth: 5, //线宽
          color: 'red', //颜色
          colors: ['green', 'red', 'yellow', 'orange'], //当colors存在时，color无效
          isVertexLine: false, //是否有中心线
          lines: 6,
          shadow: '3 3 2 gray',
          borderRadius: 10,
          // lineColor: 'red',
        }]
      }
    })
  },
  /**
   * 绘制中心多边形
   */
  drawCenterPolygon() {
    this.setData({
      painting: {
        width: 200, //画布宽，也是导出图片的尺寸
        height: 200, //画布高
        views: [{
          type: 'centerpolygon', //绘制中心多边形
          x: 110, //中心点横坐标
          y: 110, //中心点纵坐标
          // lineColor: 'green', //边框的颜色
          // lineWidth: 3, //边框的宽度
          isStroke: false,
          isFill: true,
          border: {
            color: 'orange',
            lineWidth: 5,
          },
          shadow: '10 10 5 black',
          points: [{ //points里是4个顶点的坐标
            x: 10,
            y: 10,
            color: 'red',
          }, {
            x: 150,
            y: 10,
            color: 'yellow'
          }, {
            x: 150,
            y: 120,
            color: 'black'
          }, {
            x: 10,
            y: 190,
            color: 'blue'
          }]
        }]
      }
    })
  },
  /**
   * 绘制能力表
   */
  drawChart() {
    var scores = [{
      score: '90',
      color: 'red'
    }, {
      score: '70',
      color: 'yellow'
    }, {
      score: '80',
      color: 'blue'
    }]
    this.setData({
      painting: {
        width: 200,
        height: 200,
        views: [{
          type: 'abilitychart', //绘制能力表
          x: 100, //中心点横坐标
          y: 100, //中心点纵坐标
          radius: 92, //半径，主要用于网格
          scores: scores, //能力数组,有一个score属性,和color属性,color代表区域颜色

          isNet: true,
          net: { //net的属性跟drawNet里传入的参数一样
            color: 'red',
            isArc: true, //网格是圆
            isFill: false,
            isStroke: true,
            isPolygon: false, //网格是正多边形
            lineWidth: 2, //网格的线宽
            level: 6, //网格层级
            isVertexLine: false //是否有中线
          },
          polygon: { //net的属性跟drawPolygon里传入的参数一样，不需要传入points
            isFill: true,
            isStroke: true, //是否有边框   
            lineColor: 'white',
            lineWidth: 1,
            shadow: '2 2 2 gray',
          },
          vertex: { //vertex的属性跟drawArc里传入的参数一样,中心点坐标不需要传
            radius: 3, //半径
            isStroke: true, //是否有边框
            lineWidth: 1, //边框宽度
            lineColor: 'white',
            isFill: true
          }
        }]
      }
    })
  },
  /**
   * 绘制海报
   */
  drawHaibao() {
    this.setData({
      painting: {
        width: 500,
        height: 500,
        views: [{
          type: 'rect', //绘制矩形
          left: 0, //左上角横坐标
          top: 0, //左上角纵坐标
          width: 500,
          height: 500,
          isFill: true,
          isStroke: false,
          color: 'pink',
        }, {
          type: 'image', //绘制图片
          url: this.data.scancodeUrl, //图片地址
          left: 10, //左上角横坐标
          top: 10, //左上角纵坐标
          width: 200.25, //宽
          height: 200.25, //高
          borderRadius: 20, //边框半径
          // shadow: '10 10 10 gray' //加阴影,必须4个都写
        }, {
          type: 'text', //绘制文本
          content: 'nicepaint，一个普通人写的工作用的canvas组件,可以随便更改', //文本内容
          left: 250, //文本左上角横坐标
          top: 10, //文本左上角纵坐标
          width: 250, //如果设置了宽度就会换行，不设置的话，不换行
          color: 'black', //字体颜色
          fontSize: 30, //字体尺寸，只有数字
          fontWeight: 'bold', //字体尺寸，只有normal和bold两种，默认normal
          shadow: '1 1 0 white', //加阴影,必须4个都写
          textDecoration: 'lineThrough'
        }, {
          type: 'line',
          left: 250,
          top: 250,
          width: 200,
          lineWidth: 10,
          lineDash: [18, 20]
        }, {
          type: 'image',
          url: this.data.imgUrl2,
          left: 250,
          top: 250,
          width: 200,
          height: 200,
          borderRadius: 20,
          mode: 'aspectFit',
          shadow: '30 30 10 gray'
        }, {
          type: 'image',
          url: this.data.imgUrl2,
          left: 10,
          top: 250,
          width: 200,
          height: 200,
          // shadow: '30 30 10 gray'
        }]
      }
    })
  },
  /**
   * 如果每个元素可以添加一个views属性，这样的话views里的元素就是当前元素的子元素，其坐标原点位于父元素的左上角位置
   */
  drawCover() {
    this.setData({
      painting: {
        width: 500,
        height: 500,
        views: [{
          type: 'rect', 
          left: 0, 
          top: 0, 
          width: 500,
          height: 500,
          color: 'pink',
          views: [{
            type: 'arc', 
            x: 300, //其坐标位置是相对于父元素的,父元素的左上角坐标为(0,0)
            y: 300, 
            radius: 200,
            color: 'yellow',
            views: [{
              type: 'rect', 
              left: 100, //其坐标位置是相对于父元素的,父元素的左上角坐标为(300-200,300-200)也就是(100,100),所以当前元素的实际坐标是(200,200)
              top: 100, 
              width: 300,
              height: 300,
              color: 'green',
            }, {
              type: 'image',
              url: this.data.imgUrl2,
              left: 10,
              top: 10,
              width: 100,
              height: 100,
            }]
          }]
        }]
      }
    })
  },

  /**
   * 获取到返回的图片
   */
  getImage(e) {
    console.log('绘制图片结果', e);
    this.setData({
      imgUrl: e.detail.tempFilePath
    })
  }


})