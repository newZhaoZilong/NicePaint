// pages/zujian/zujian.js
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

  drawSanwei() {
    // {
    //   type: 'arc',
    //     x: 300,
    //       y: 300,
    //         radius: 100,
    //           isFill: true,
    //             sA: 0,
    //               eA: Math.PI,
    //                 color: 'red'
    // }
    // {
    //   type: 'polygon',
    //     isFill: false,
    //       color: 'black',
    //         lineWidth: 20,
    //           points: [{
    //             x: 10,
    //             y: 10
    //           }, {
    //             x: 200,
    //             y: 10,
    //           }, {
    //             x: 200,
    //             y: 200
    //           }, {
    //             x: 10,
    //             y: 200
    //           }]
    // }
    // {
    //   type: 'centerpolygon',
    //     x: 300,
    //       y: 300,
    //         lineColor: 'purple',
    //           lineWidth: 20,
    //             points: [{
    //               x: 10,
    //               y: 10,
    //               color: 'white'
    //             }, {
    //               x: 500,
    //               y: 10,
    //               color: 'green'
    //             }, {
    //               x: 500,
    //               y: 500,
    //               color: 'yellow'
    //             }, {
    //               x: 10,
    //               y: 500,
    //               color: 'orange'
    //             }]
    // }
    // {
    //   type: 'net',
    //     x: 500,
    //       y: 500,
    //         radius: 300,
    //           level: 20,
    //             color: 'black',
    //               lineWidth: 2,
    //                 isArc: true,
    //                   isPolygon: false
    // }
    this.setData({
      painting: {
        width: 1080,
        height: 1920,
        views: [{
          type: 'abilitychart',
          x: 500,
          y: 500,
          radius: 400,
          scores: [{
            score: 80,
            color: '#0000ff'
          }, {
            score: 70,
            color: 'black'
          }, {
            score: 90,
            color: '#00ff00'
            }, {
              score: 80,
              color: '#0000ff'
            }, {
              score: 70,
              color: 'black'
            }, {
              score: 90,
              color: '#00ff00'
            },{
              score: 70,
              color: 'black'
            }],
          net: {
            level: 5,
            lineWidth: 30,
            color: 'red',
            isCenter:true,
            // isArc:true,
            // isPolygon:false
          },
          polygon: {
          
            isStroke:true,
            lineColor:'yellow',
            lineWidth:10,
       
          },
          vertex:{
            color:'white',
            radius:20
          }
        }]
      }
    })
  },

  /**
   * 画海报结束
   */
  eventGetImage(event) {
    const {
      tempFilePath,
      errMsg
    } = event.detail
    if (errMsg === 'canvasdrawer:ok') {
      this.setData({
        shareImage: tempFilePath,
      })
    }
  },
})