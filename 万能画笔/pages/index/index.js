//index.js
//获取应用实例
const app = getApp()
var NicePaint = require('../../utils/NicePaint.js');
Page({
  data: {
    imgUrl1: '/images/99.png',
    imgUrl2: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543518497476&di=0aa0c309131083d7dba800d4aa889d03&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F8b82b9014a90f6037cb445933312b31bb151edda.jpg',
    scancodeUrl: 'https://productionvote.changingstudy.com/oSjgK0bvBk1mlVxVKUCDjmHg38QI20181121125737.jpg'
  },

  onLoad: function() {
    var scoreData = [{
      "score": "99.80",
      "capacity": "语言天赋"
    }, {
      "score": "70.00",
      "capacity": "音乐天赋"
    }, {
      "score": "66.00",
      "capacity": "数学逻辑能力"
    }, {
      "score": "52.80",
      "capacity": "空间想象能力"
    }, {
      "score": "85.80",
      "capacity": "身体动觉才能"
    }, {
      "score": "72.60",
      "capacity": "自我认识才能"
    }, {
      "score": "66.00",
      "capacity": "认识他人才能"
    }];
    this.setData({
      scoreData: scoreData
    })
    // setTimeout(this.turnToResult, 3000);
  },
  /**
 * 转到答题结果页
 */
  turnToResult() {
    // wx.showLoading({
    //   title: '请稍后...',
    // })
    this.setData({
      state: 'C',
    })
    this.initUI(this.data.scoreData, true);
    // this.initResultData();

  },
  /**
   * 初始化ui位置,isShort代表是短图还是详情图
   */
  initUI(isShort = true) {

    var scoreData = this.data.scoreData;
    var colors = ['rgb(137,223,255)', 'rgb(255,215,102)', 'rgb(128,126,129)', 'rgb(112,137,221)', 'rgb(171,234,161)', 'rgb(213,89,91)', 'rgb(255,170,152)'];


    var scores = isShort ? scoreData.slice(0, 3) : scoreData;
    console.log(scores);
    var scoreTitlesLocation = this.getRegularPolygonLocations({
      x: 50,
      y: 50,
      radius: 42,
      lines: scores.length
    });
    console.log(scoreTitlesLocation)
    scores.forEach((v, i) => {
      v.x = scoreTitlesLocation[i].x;
      v.y = scoreTitlesLocation[i].y;
      v.color = colors[i % colors.length];
    })
    console.log('scores', scores);
    if (isShort) {
      this.setData({
        shortScoreData: scores,
      })
    } else {
      this.setData({
        detailScoreData: scores
      })
    }
    var scores = [{ score: '80', color: 'red' }, {
      score: '90',
      color: 'yellow'
    }, {
      score: '70',
      color: 'green'
    }]
    this.setData({

      painting: {
        width: 200,
        height: 200,
        clear: false,
        views: [{
          type: 'abilitychart',
          x: 100,
          y: 100,
          radius: 92,
          scores: scores,
          net: {
            color: 'red',
            isArc: isShort,
            isPolygon: !isShort,
            lineWidth: isShort ? 3 : 1,
            level: 6,
            isVertexLine: true
          },
          polygon: {
            isStroke: false,
            lineColor: 'white',
            lineWidth: 1
          },
          vertex: {
            radius: isShort ? 5 : 3,
            color: isShort ? 'yellow' : 'white'
          }
        }]
      }
    })

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
   * 绘制网格
   */
  drawNet(){
      this.setData({
        painting:{
          width:200,
          height:200,
          views:[{
            type:'net',
            x:100,
            y:100,
            radius:100,
            level:4,
            isArc:true,
            isPolygon:false
          }]
        }
      })
  },
  /**
   * 绘制中心多边形
   */
  drawPolygon(){

  },
  /**
   * 绘制能力表
   */
  drawChart(){
    var isShort = true;
    var scores = [{score:'80',color:'red'},{
      score:'90',
      color:'yellow'
    },{
      score:'70',
      color:'green'
    }]
    this.setData({

      painting: {
        width: 200,
        height: 200,
        clear: false,
        views: [{
          type: 'abilitychart',
          x: 100,
          y: 100,
          radius: 92,
          scores: scores,
          net: {
            color: 'red',
            isArc: isShort,
            isPolygon: !isShort,
            lineWidth: isShort ? 3 : 1,
            level: 6,
            isVertexLine: true
          },
          polygon: {
            isStroke: false,
            lineColor: 'white',
            lineWidth: 1
          },
          vertex: {
            radius: isShort ? 5 : 3,
            color: isShort ? 'yellow' : 'white'
          }
        }]
      }
    })
  },

  /**
   * 获取到返回的图片
   */
  getImage(e){
      console.log(e);
      this.setData({
        netUrl: e.detail.tempFilePath
      })
  }


})