// pages/haibao/haibao.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl2: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543518497476&di=0aa0c309131083d7dba800d4aa889d03&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F8b82b9014a90f6037cb445933312b31bb151edda.jpg',
    header: 'https://productionvote.changingstudy.com/oSjgK0bt9fVjIE1v885lfX0OcWIs1541153097032791397_s.jpg',
    scancodeUrl: 'https://productionvote.changingstudy.com/oSjgK0bvBk1mlVxVKUCDjmHg38QI20181121125737.jpg'
  },
  /**
   * 画海报结束
   */
  eventGetImage(event) {
    console.log('海报绘制完成', event);
    wx.hideLoading()
    const {
      tempFilePath,
      errMsg
    } = event.detail
    if (errMsg === 'canvasdrawer:ok') {
      this.setData({
        shareImage: tempFilePath,
        posterDrawn: true
      })
    }
  },
  eventSave() {
    const that = this
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage,
      success(res) {
        wx.showToast({
          title: '已保存到相册'
        })
        that.closePoster()
        that.getShareReward('circleOfFriends')
      }
    })
  },
  getShareReward: function(rewardType) {
    var that = this
    wx.request({
      url: app.globalData.localhost + '/wxapp/addMyaccount',
      header: {
        "Content-Type": 'application/x-www-form-urlencoded'
      },
      data: {
        openId: app.globalData.openid,
        type: rewardType
      },
      method: 'POST',
      success: (res) => {
        if (res.data.success && res.data.data > 0) {
          that.modelDialog.showDialog({
            dialogType: 0,
            showCancel: false,
            title: '获得奖励',
            content: '恭喜您获得了' + res.data.data + '个轻近点',
          })
        } else {
          console.log('未获取奖励')
        }
      },
      fail: function(error) {
        console.log('网络错误，请检查是否联网')
      }
    })
  },
  closePoster: function() {
    this.setData({
      isShowPoster: false
    })
  },
  /**
   * 画海报
   */
  drawHaibao() {
    if (!this.data.posterDrawn) {
      wx.showLoading({
        title: '海报生成中...',
        mask: true
      })
      var width = 1080,
        height = 1920;
      this.setData({
        isShowPoster: true,
        painting: {
          width: width,
          height: height,
          clear: true,
          views: [{
              type: 'rect',
              color: '#51bda3',
            },
            {
              type: 'text',
              content: '我在 "过目不忘" 活动中',
              left: 540,
              top: 106,
              textAlign: 'center',
              fontSize: 54,
              color: 'white'
            }, {
              type: 'image',
              url: '/images/blueleft.png',
              left: 0,
              top: 394,
              width: 629,
              height: 308,
            }, {
              type: 'image',
              url: '/images/redright.png',
              left: 629,
              top: 394,
              width: width - 629,
              height: 308
            }, {
              type: 'image',
              url: this.data.header,
              left: 97,
              top: 430,
              width: 165,
              height: 165,
              borderRadius: 0.5,
              shadow: '2 2 0 gray'
            }, {
              type: 'image',
              url: this.data.header,
              left: width - 97 - 165,
              top: 430,
              width: 165,
              height: 165,
              borderRadius: 0.5,
              shadow: '2 2 0 gray'
            }, {
              type: 'text',
              content: '名字只有七个字',
              left: 97 + 165 / 2,
              top: 622,
              fontSize: 36,
              color: 'white',
              textAlign: 'center'
            }, {
              type: 'text',
              content: '汤圆博士',
              left: width - (97 + 165 / 2),
              top: 622,
              fontSize: 36,
              color: 'white',
              textAlign: 'center'
            }, {
              type: 'image',
              url: '/images/huangguan.png',
              left: (width - 532) / 2,
              top: 238,
              width: 532,
              height: 426
            },
            {
              type: 'text',
              content: '完美解题',
              left: width / 2,
              top: 522,
              textAlign: 'center',
              color: 'white',
              font: 'bold 68px Arial'
            }, {
              type: 'image',
              url: this.data.imgUrl2,
              left: 86,
              top: 856,
              width: 429,
              height: 491,
              borderRadius: 0.05,
              shadow: '5 5 2 #dedede'
            },
            {
              type: 'image',
              url: this.data.imgUrl2,
              left: 564,
              top: 856,
              width: 429,
              height: 491,
              borderRadius: 0.05,
              shadow: '5 5 2 #dedede'
            }, {
              type: 'image',
              url: this.data.scancodeUrl,
              left: 160,
              top: 1520,
              width: 315,
              height: 315,
              borderRadius: 0.02,
              shadow: '3 3 0 gray'
            }, {
              type: 'text',
              content: '长按识别小程序立马PK',
              left: 570,
              top: 1629,
              width: 370,
              font: 'bold 52px Arial',
              lineHeight: 68,
              color: 'white'
            }, {
              type: 'text',
              content: '分享自轻近课堂',
              left: 570,
              top: 1786,
              fontSize: 41,
              color: 'white'
            }
          ]
        }
      })
    }

  }
})