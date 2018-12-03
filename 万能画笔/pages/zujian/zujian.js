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
    //   type: 'abilitychart',
    //     x: 500,
    //       y: 500,
    //         radius: 400,
    //           scores: [{
    //             score: 80,
    //             color: '#0000ff'
    //           }, {
    //             score: 70,
    //             color: 'black'
    //           }, {
    //             score: 90,
    //             color: '#00ff00'
    //           }, {
    //             score: 80,
    //             color: '#0000ff'
    //           }, {
    //             score: 70,
    //             color: 'black'
    //           }, {
    //             score: 90,
    //             color: '#00ff00'
    //           }, {
    //             score: 70,
    //             color: 'black'
    //           }],
    //             net: {
    //     level: 5,
    //       lineWidth: 30,
    //         color: 'red',
    //           isCenter: true,
    //         // isArc:true,
    //         // isPolygon:false
    //       },
    //   polygon: {

    //     isStroke: true,
    //       lineColor: 'yellow',
    //         lineWidth: 10,
       
    //       },
    //   vertex: {
    //     color: 'white',
    //       radius: 20
    //   }
    // }
    this.setData({

      painting: {
        width: 300,
        height: 300,
        clear: false,
        views: [{
          type:'net',
          x:150,
          y:150,
          radius:150,
          level:5,
          isArc:true,
          isPolygon:false
        }]
      }
    })
  },
  drawSanwei2(){
    this.setData({
      painting: {
        width: 1080,
        height: 1920,
        views: [{
          type: 'abilitychart',
          x: 500,
          y: 500,
          radius: 300,
          scores:[{
            score:80,
            color:'red'
          },{
            score:90,
            color:'blue'
          },{
              score: 90,
              color: 'green'
          }],
          net:{
            isArc:true,
            isPolygon:false,
            level: 5,
          },
          polygon:{
            // points:[{
            //   x:300,
            //   y:200
            // },{
            //   x:500,
            //   y:300
            // },{
            //   x:100,
            //   y:400
            // }]
          },
          
          
          // color: 'yellow',
          // lineWidth: 5,
          // isCenter: true,
          // isArc: false,
          // isPolygon: true
        }]
      }
    })
  },

  /**
   * 画海报结束
   */
  eventGetImage(event) {
    console.log('绘制成功，获取图片event', event)
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