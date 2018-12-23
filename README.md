# NicePaint #
这个工具主要是自己工作的时候用于绘制海报的canvas组件，里面封装了绘制海报的基本方法,使用方法如下:

## 组件绘制基本原理 ##
nicepaint是一个canvas组件,绘制的时候需要传入一个对象数组，然后组件内部就会按顺序绘制数组里面的所有对象,然后生成一张本地图片通过triggerEvent将图片路径传递出去

## 获取nicepaint ##

获取方法，直接通过git克隆到本地，这就是个小程序项目，然后通过[微信开发工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)打开使用，单独用的话可以将nicepaint组件copy一份到自己的项目里，
按照index.js页里的使用方法使用组件即可

	git clone git@github.com:newZhaoZilong/NicePaint.git

## 一个简单的nicepaint操作实例 ##
首先新建一个小程序项目,然后copy一份nicepaint组件到components文件夹里,这时的目录是这样的:

![](http://pj9rcpedq.bkt.clouddn.com/nicepaintmulu.PNG)

index.js

	//index.js

	Page({
	  onReady() {
	    this.setData({
	      painting: {
	        width: 200, //画布的宽也是导出图片的实际宽度,单位是px
	        height: 200, //画布的高也是导出图片的实际宽度,单位是px
	        views: [{
	            type: 'rect', //绘制的元素类型为矩形
	            left: 0, //元素左上角x坐标,单位px
	            top: 0, //元素左上角y坐标,单位px
	            width: 200, //矩形的宽度,单位px
	            height: 200, //矩形的高度,单位px
	            color: 'pink', //矩形的填充颜色
	          },
	          {
	            type: 'net', //绘制的元素类型为网格
	            x: 100, //网格的中心点x坐标
	            y: 100, //网格的中心点y坐标
	            radius: 60, //网格的半径
	            isFill: false, //是否填充,false不填充
	            isStroke: true, //是否描边,true为描边
	            level: 4, //网格的层级为4
	            lines: 6, //网格的边数，6极为正六边形
	            lineWidth: 2, //描边的线宽
	            lineColor: 'red', //描边颜色,当lineColor没有设置时,默认为color
	          }
	        ]
	      }
	    })
	  },
	  getImage(e) {
	    this.setData({
	      imgUrl: e.detail.tempFilePath //导出的图片本地路径,可以展示,也可以存储到相册
	    })
	  }
	})

index.wxml

	<!--index.wxml-->
	<image src="{{imgUrl}}" style="width:500rpx;height:500rpx;"></image>
	<nicepaint painting="{{painting}}" bind:getImage="getImage"></nicepaint>

index.json

	{
	  "usingComponents": {
	    "nicepaint": "/components/nicepaint/nicepaint"
	  }
	}

绘制结果

![](http://pj9rcpedq.bkt.clouddn.com/nicepaint7.PNG)

painting的views属性需要传递一个数组,数组里添加了两个绘制对象,通过type区分,rect代表矩形,net代表网格,这样就先绘制了一个粉色的矩形，然后绘制了一个网格，后绘制的会覆盖先绘制的

## 绘制矩形 ##

![](http://pj9rcpedq.bkt.clouddn.com/nicepaint0.PNG)

left,right,width,height,borderRadius,lineWidth的单位都是px

|属性名称|类型|单位|默认值|必填| 说明 | 
| -------- |  ---------- | ---------- | ---------- |---------- |-------------------- |
| left | number |px|0|否|矩形左上角的x坐标 |
| right | number |px|0|否|矩形左上角的x坐标 |
| width | number |px|0|否|矩形左上角的x坐标 |
| height | number |px|0|否|矩形左上角的x坐标 |
| isFill | number |px|0|否|矩形左上角的x坐标 |
| isStroke | number |px|0|否|矩形左上角的x坐标 |
| lineWidth | number |px|0|否|矩形左上角的x坐标 |
| lineColor | number |px|0|否|矩形左上角的x坐标 |
| borderRadius | number |px|0|否|矩形左上角的x坐标 |
| lineJoin | number |px|0|否|矩形左上角的x坐标 |
| lineDash | number |px|0|否|矩形左上角的x坐标 |
| shadow | number |px|0|否|矩形左上角的x坐标 |