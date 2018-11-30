//logs.js
const util = require('../../utils/util.js')
var NicePaint = require('../../utils/NicePaint.js');
Page({
  data: {
    header: 'https://productionvote.changingstudy.com/oSjgK0bt9fVjIE1v885lfX0OcWIs1541153097032791397_s.jpg',
    scancodeUrl: 'https://productionvote.changingstudy.com/oSjgK0bvBk1mlVxVKUCDjmHg38QI20181121125737.jpg'
  },
  onLoad: function() {
    this.prepareDraw();
  },
  /**
   * 获取尺寸数据
   */
  getSize() {
    return new Promise((resolve, reject) => {
      if (this.data.canvasWidth) {
        resolve();
      } else {
        wx.getSystemInfo({
          success: (res) => {
            console.log(res);
            this.setData({
              windowWidth: res.windowWidth,
              windowHeight: res.windowHeight,
              canvasWidth: res.windowWidth * 0.8,
              canvasHeight: res.windowHeight * 0.8
            })
            resolve();
          },
          fail: reject
        })
      }
    })
  },
  /**
   * 准备画海报
   */
  prepareDraw() {
    this.getSize()
      .then(() => {
        this.setData({
          showCanvas: true
        }, this.startDraw)
      })
  },
  /**
   * 开始画海报
   */
  startDraw() {
    this.paint = new NicePaint('canvasId');
    var cw = this.data.canvasWidth,
      ch = this.data.canvasHeight;
    // this.paint.drawElements([{
    //   type: 'image',
    //   url: this.data.header,
    //   left: 0.088 * cw,
    //   top: 0.18 * ch,
    //   width: 0.149 * cw,
    //   height: 0.149 * cw,
    //   borderRadius: 0.5
    // }])
    this.paint.drawElements([{
          type: 'rect',
          left: 0,
          top: 0,
          width: cw,
          height: ch,
          color: '#51bda3',
          borderRadius: 0.03
        },
        [{
            type: 'text',
            left: 0.5 * cw,
            top: 0.04 * ch,
            textAlign: 'center',
            content: '我在 “过目不忘” 活动中',
            fontSize: 0.054 * cw,
            color: 'white'
          },
          [{
            type: 'image',
            url: '/images/blueleft.png',
            left: 0,
            top: 0.164 * ch,
            width: 0.57 * cw,
            height: 0.28 * cw
          }, {
            type: 'image',
            url: '/images/redright.png',
            left: 0.57 * cw,
            top: 0.164 * ch,
            width: 0.43 * cw,
            height: 0.28 * cw
          }, {
            type: 'image',
            url: this.data.header,
            left: 0.088 * cw,
            top: 0.18 * ch,
            width: 0.149 * cw,
            height: 0.149 * cw,
            borderRadius: 0.5
            }, {
              type: 'image',
              url: this.data.header,
              left: cw - 0.088 * cw-0.149 * cw,
              top: 0.18 * ch,
              width: 0.149 * cw,
              height: 0.149 * cw,
              borderRadius: 0.5
            },{
              type:'text',
              content:'山歌',
              top: 0.18 * ch + 0.149 * cw+0.01*ch,
              left: 0.088 * cw + 0.149 * cw/2,
              textAlign:'center',
              fontSize:0.03*cw
            }]
        ]
      ])
      .then(() => {
        this.paint.draw();
      })
  }

})