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
| -------- |  ---------- | ------------- | ---------- |------------- |-------------------- |
| left | number |px|0|否|矩形左上角的x坐标 |
| right | number |px|0|否|矩形左上角的y坐标 |
| width | number |px||是|矩形的宽度 |
| height | number |px||是|矩形的高度 |
| isFill | boolean | |true|否| 是否填充 |
| isStroke | boolean | |false|否| 是否描边 |
| color | string | |'red'|否|填充颜色 |
| lineWidth | number |px||否| 设置线条的宽度 |
| lineColor | string |px||否| 设置描边颜色 |
| lineJoin | string ||'round'|否|设置线条的交点样式 |
| lineDash | Array<number> | |0|否|设置虚线样式，需要传递一个数组,类似[10,20] |
| borderRadius | number |px|0|否| 设置圆角边框 |
| shadow | string |||否|设定阴影样式,需要传递一个字符串,类似'2 2 1 gray',必须是这种模式 |


## 绘制多边形drawPolygon ##

![](http://pj9rcpedq.bkt.clouddn.com/nicepaint2.PNG)

绘制多边形是nicepaint的核心函数,需要传递一个坐标数组,然后nicepaint会根据这些坐标点依次绘制线,最后填充,跟绘制矩形一样,isFill为true,isStroke为true就会描边,两者都存在就会先填充再描边,nicepaint的许多绘制方法都是通过绘制多边形延伸出来的，比如drawLine，drawRect等


|属性名称|类型|单位|默认值|必填| 说明 | 
| -------- |  ---------- | ------------- | ---------- |------------- |-------------------- |
| points | Array<object> |px||是|多边形顶点的坐标数组,类似[{x:10,y:10},{x:100,y:10},{x:50,y:100}] |
| isFill | boolean | |true|否| 是否填充 |
| isStroke | boolean | |false|否| 是否描边 |
| color | string | |'red'|否|填充颜色 |
| lineWidth | number |px||否| 设置线条的宽度 |
| lineColor | string |px||否| 设置描边颜色 |
| lineJoin | string ||'round'|否|设置线条的交点样式 |
| lineDash | Array<number> | |0|否|设置虚线样式，需要传递一个数组,类似[10,20] |
| borderRadius | number |px|0|否| 设置圆角边框 |
| shadow | string |||否|设定阴影样式,需要传递一个字符串,类似'2 2 1 gray',必须是这种模式 |


## 绘制图片drawImage ##

![](http://pj9rcpedq.bkt.clouddn.com/nicepaint2.PNG)


|属性名称|类型|单位|默认值|必填| 说明 | 
| -------- |  ---------- | ------------- | ---------- |------------- |-------------------- |
| url | string |||是|图片url地址，可以是本地路径，也可以是网络路径 |
| left | number | |0|否| 图像的左上角在目标 canvas 上 x 轴的位置 |
| top | number | |0|否| 图像的左上角在目标 canvas 上 y 轴的位置 |
| mode | string | |scaleToFill |否| 根据mode获取图片实际位置信息,mode不写或者写scaleToFill的话,会拉伸图片，现在可用的mode有aspectFit,aspectFill,widthFix |
| width | number | |px|是|在目标画布上绘制图像的宽度，允许对绘制的图像进行缩放 |
| height | number | |px|是|在目标画布上绘制图像的高度，允许对绘制的图像进行缩放 |
| borderRadius | number |px|0|否| 设置圆角边框 |
| shadow | string |||否|设定阴影样式,需要传递一个字符串,类似'2 2 1 gray',必须是这种模式 |


## 绘制文字drawText ##

|属性名称|类型|单位|默认值|必填| 说明 | 
| -------- |  ---------- | ------------- | ---------- |------------- |-------------------- |
| content | string |||是|文字内容 |
| left | number | |0|否| 文字位于画布的x坐标 |
| top | number | |0|否| 文字位于画布的y坐标 |
| fontSize | number |px|0|否| 文字的尺寸 |
| color | string | |'black'|否| 文字的颜色 |
| width | number | |px|是|文字的宽度，用于换行的,如果添加width，文字超出宽度时就会换行,不写width属性不会换行 |
| lineHeight | number |px|fontSize * 1.25|否| 文字的行高 |
| textAlign | string ||'left'|否| 文字对齐方式 |
| textBaseline | string ||'top'|否| 文字的行高 |
| lineHeight | number |px||否| 文字的行高 |
| fontWeight | string |||否| 文本的粗细,只有normal和bold可用 |
| shadow | string |||否|阴影,是个字符串类似'2 2 1 gray' |