//index.js
//获取应用实例
const app = getApp()
var NicePaint = require('../../utils/NicePaint.js');
Page({
  data: {
    imgUrl1: '/images/99.png',
    imgUrl2: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543518497476&di=0aa0c309131083d7dba800d4aa889d03&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F8b82b9014a90f6037cb445933312b31bb151edda.jpg'
  },

  onLoad: function() {
    this.paint = new NicePaint('mycanvas');
    var a = [1, 2, 3];
    var b = {
      name: 'nihao'
    }
    console.log(a instanceof Array);


  },
  toDrawElement: function() {
    this.paint.drawElement({
        type: 'image',
        url: this.data.imgUrl1,
        left: 10,
        top: 10,
        width: 200,
        height: 200
      })
      .then(() => {
        this.paint.draw();
      })
  },
  toDrawElementsInOrder: function() {
    this.paint.drawElementsInOrder([{
        type: 'image',
        url: this.data.imgUrl2,
        left: 10,
        top: 10,
        width: 200,
        height: 200,
      }, {
        type: 'image',
        url: this.data.imgUrl1,
        left: 10,
        top: 10,
        width: 100,
        height: 100
      }, {
        type: 'text',
        left: 40,
        top: 40,
        width: 100,
        color: 'white',
        content: '你好我好大家好啊啊啊啊'
      }])
      .then(() => {
        this.paint.draw();
      })
  },
  toDrawElementsTogether: function() {
    this.paint.drawElementsTogether([{
          type: 'image',
          url: this.data.imgUrl2,
          left: 10,
          top: 10,
          width: 200,
          height: 200,
        }, {
          type: 'image',
          url: this.data.imgUrl1,
          left: 10,
          top: 10,
          width: 100,
          height: 100
        }, {
          type: 'text',
          left: 40,
          top: 40,
          width: 100,
          color: 'white',
          content: '你好我好大家好啊啊啊啊'
        },
        [{
          type: 'image',
          url: this.data.imgUrl2,
          left: 200,
          top: 200,
          width: 200,
          height: 200,
        }, {
          type: 'image',
          url: this.data.imgUrl1,
          left: 200,
          top: 200,
          width: 100,
          height: 100
        }, {
          type: 'text',
          left: 200,
          top: 200,
          width: 100,
          color: 'white',
          content: '你好我好大家好啊啊啊啊'
        }]
      ])
      .then(() => {
        this.paint.draw();
      })
  },
  toDrawElements: function() {
    this.paint.drawElements([{
        type: 'image',
        url:this.data.imgUrl2,
        top:0,
        left:0,
        width:300,
        height:300
      },
      [{
          type: 'image',
          url:this.data.imgUrl1,
          top:0,
          left:0,
          width:100,
          height:100
        },
        [{
          type: 'image',
          url: this.data.imgUrl1,
          top: 50,
          left: 50,
          width: 100,
          height: 100
          },
          {
            type: 'text',
            top: 100,
            left: 100,
            width: 100,
            content:'卧槽泥马勒戈壁'
          }
        ]
      ]
    ])
    .then(()=>{
      this.paint.draw();
    })

  },


})