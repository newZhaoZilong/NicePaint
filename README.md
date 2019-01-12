# 绘制展示页 #
[https://newzhaozilong.github.io/NicePaint/](https://newzhaozilong.github.io/NicePaint/)
# NicePaint #
这个工具主要是自己工作的时候用于绘制海报的canvas组件，里面封装了绘制海报的基本方法,使用方法如下:

## 组件绘制基本原理 ##
nicepaint是一个canvas组件,绘制的时候需要传入一个对象数组，然后组件内部就会按顺序绘制数组里面的所有对象,然后生成一张本地图片通过组件的triggerEvent方法将图片路径传递出去

## 获取nicepaint ##

获取方法，直接通过git克隆到本地，这就是个小程序项目，然后通过[微信开发工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)打开使用，单独用的话可以将nicepaint组件copy一份到自己的项目里，
按照index.js页里的使用方法使用组件即可

	git clone git@github.com:newZhaoZilong/NicePaint.git

## 一个简单的nicepaint操作实例 ##
首先新建一个小程序项目,然后copy一份nicepaint组件到components文件夹里,这时的目录是这样的:

![](data:image/png;base64,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)

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

left,right,width,height,borderRadius,lineWidth的单位都是px,坐标原点是左上角,x轴是从左到右,y轴是从上到下

|属性名称|类型|单位|默认值|必填| 说明 | 
| -------- |  ---------- | ------------- | ---------- |------------- |-------------------- |
| left | number |px|0|否|矩形左上角的x坐标,单位是px |
| top | number |px|0|否|矩形左上角的y坐标,单位是px |
| width | number |px||是|矩形的宽度,单位是px |
| height | number |px||是|矩形的高度,单位是px |
| isFill | boolean | |true|否| 是否填充 |
| isStroke | boolean | |false|否| 是否描边 |
| color | string | |'red'|否|填充颜色 |
| lineWidth | number |px||否| 设置线条的宽度 |
| lineColor | string |||否| 设置描边颜色 |
| lineJoin | string ||'round'|否|设置线条的交点样式 |
| lineDash | Array<number> | ||否|设置虚线样式，需要传递一个数组,类似[10,20] |
| borderRadius | number |px|0|否| 设置圆角边框,单位是px|
| shadow | string |||否|设定阴影样式,需要传递一个字符串,类似'2 2 1 gray',必须是这种模式,就是阴影的4个属性都要有|


## 绘制多边形drawPolygon ##

![](http://pj9rcpedq.bkt.clouddn.com/nicepaint2.PNG)

绘制多边形是nicepaint的核心函数,需要传递一个坐标数组,然后nicepaint会根据这些坐标点依次绘制线,最后填充,跟绘制矩形一样,isFill为true就会填充,isStroke为true就会描边,两者都存在就会先填充再描边,nicepaint的许多绘制方法都是通过绘制多边形方法延伸出来的，比如drawLine，drawRect等


|属性名称|类型|单位|默认值|必填| 说明 | 
| -------- |  ---------- | ------------- | ---------- |------------- |-------------------- |
| points | Array&lt;object&gt; |px||是|多边形顶点的坐标数组,类似[{x:10,y:10},{x:100,y:10},{x:50,y:100}],坐标的单位是px|
| isFill | boolean | |true|否| 是否填充 |
| isStroke | boolean | |false|否| 是否描边 |
| color | string | |'red'|否|填充颜色 |
| lineWidth | number |px||否| 设置线条的宽度 |
| lineColor | string |||否| 设置描边颜色 |
| lineJoin | string ||'round'|否|设置线条的交点样式 |
| lineDash | Array<number> | |0|否|设置虚线样式，需要传递一个数组,类似[10,20] |
| borderRadius | number |px|0|否| 设置圆角边框,单位是px |
| shadow | string |||否|设定阴影样式,需要传递一个字符串,类似'2 2 1 gray',必须是这种模式 |


## 绘制图片drawImage ##


|属性名称|类型|单位|默认值|必填| 说明 | 
| -------- |  ---------- | ------------- | ---------- |------------- |-------------------- |
| url | string |||是|图片url地址，可以是本地路径，也可以是网络路径 |
| left | number | |0|否| 图像的左上角的x坐标,单位是px |
| top | number | |0|否| 图像的左上角的y坐标,单位是px |
| width | number | |px|是|在目标画布上绘制图像的宽度，允许对绘制的图像进行缩放 |
| height | number | |px|是|在目标画布上绘制图像的高度，允许对绘制的图像进行缩放 |
| mode | string | |scaleToFill |否| 根据mode获取图片实际位置信息,mode不写或者写scaleToFill的话,会拉伸图片，现在可用的mode有aspectFit,aspectFill,widthFix |
| borderRadius | number |px|0|否| 设置圆角边框,单位是px |
| shadow | string |||否|设定阴影样式,需要传递一个字符串,类似'2 2 1 gray',必须是这种模式 |


## 绘制文字drawText ##

|属性名称|类型|单位|默认值|必填| 说明 | 
| -------- |  ---------- | ------------- | ---------- |------------- |-------------------- |
| content | string |||是|文字内容 |
| left | number |px|0|否| 文字位于画布的x坐标 |
| top | number |px|0|否| 文字位于画布的y坐标 |
| fontSize | number |px|0|否| 文字的尺寸 |
| color | string | |'black'|否| 文字的颜色 |
| width | number | ||否|文字的宽度，用于换行的,如果添加width，文字超出宽度时就会换行,不写width属性不会换行 |
| lineHeight | number |px|fontSize * 1.25|否| 文字的行高 |
| textAlign | string ||'left'|否| 文字对齐方式,相对于x坐标的水平对齐方式 |
| textBaseline | string ||'top'|否| 文字相对于基线位置,相对于y坐标的垂直对齐方式|
| fontWeight | string |||否| 文本的粗细,只有normal和bold可用 |
| textDecoration | string |||否|文本的修饰，默认为none，还有三种可用，分别是,underline定义文本下的一条线,overline定义文本上的一条线，lineThrough定义穿过文本的一条线|
| shadow | string |||否|阴影,是个字符串类似'2 2 1 gray' |


## 绘制圆弧或圆drawArc ##

|属性名称|类型|单位|默认值|必填| 说明 | 
| -------- |  ---------- | ------------- | ---------- |------------- |-------------------- |
| x | number |px |0|是| 圆弧中心点的x坐标 |
| y | number |px |0| 是 | 圆弧中心点的y坐标 |
| radius | number |px ||否|圆弧的半径|
| color | string | |'black'|否|填充的颜色 |
| isFill | boolean | |true|否| 是否填充 |
| isStroke | boolean | |false|否| 是否描边 |
| sA | number |弧度|0|否| 开始角度，都是相对于x轴的，顺时针为正 |
| eA | number | 弧度 |Math.PI*2|否| 结束角度 |
| isClockwise | boolean | |true|否|是否是顺时针方向，默认顺时针方向|
| lineWidth | number |px||否| 设置线条的宽度 |
| lineColor | string |||否| 设置描边颜色 |
| lineDash | Array<number> | |0|否|设置虚线样式，需要传递一个数组,类似[10,20] |
| shadow | string |||否|设定阴影样式,需要传递一个字符串,类似'2 2 1 gray',必须是这种模式 |

## 绘制线条drawLine ##

|属性名称|类型|单位|默认值|必填| 说明 | 
| -------- |  ---------- | ------------- | ---------- |------------- |-------------------- |
| left | number |px |0|是| 起点的x坐标 |
| top | number |px |0| 是 | 起点的y坐标 |
| width | number |px ||是|线条长度|
| color | string | |'black'|否|线条的颜色 |
| sA | number ||0|否| 绘制线条的角度 |
| align | string | |'left'|否| 相对于起点的位置，有三种，分别是'left','center,'right' |
| lineWidth | number |px||否| 设置线条的宽度 |
| lineDash | Array<number> | |0|否|设置虚线样式，需要传递一个数组,类似[10,20] |
| shadow | string |||否|设定阴影样式,需要传递一个字符串,类似'2 2 1 gray',必须是这种模式 |

## 绘制正多边形或圆形网格drawNet ##

|属性名称|类型|单位|默认值|必填| 说明 | 
| -------- |  ---------- | ------------- | ---------- |------------- |-------------------- |
| x | number | px||是| 网格中心点的x坐标 |
| y | number | px|| 是 | 网格中心点的y坐标 |
| radius | number |px ||是|网格的半径，无论是绘制圆形网格和多边形网格都有半径，多边形网格的顶点其实都在对应相同半径圆形的圆弧上|
| level | number | |2|是| 网格的层级，层级的数字对应网格的嵌套层数 |
| lines | number | |4|否| 绘制多边形网格时有用,代表正多边形的边数 |
| colors | Array | ||否| 颜色数组,如果此属性存在,color无效,['yellow','red','green'],指定从外层到内层的颜色 |
| isArc | boolean | |true|否| 是否绘制圆形网格,如果isArc和isPolygon都为true，则圆形网格和多边形网格都会绘制，但是如果是填充模式，多边形网格会被圆形网格覆盖 |
| isPolygon | boolean | |true|否| 是否绘制正多边形网格 |
| isVertexLine | boolean | |false|否| 是否绘制中心点到顶点的连线，圆形网格和多边形网格都可以设置 |
| isFill | boolean | |true|否| 是否填充 |
| isStroke | boolean | |false|否| 是否描边 |
| color | string | |'red'|否|填充颜色 |
| lineColor | string |||否| 设置描边颜色 |
| lineWidth | number |px||否| 设置线条的宽度 |
| lineJoin | string ||'round'|否|设置线条的交点样式 |
| lineDash | Array<number> | |0|否|设置虚线样式，需要传递一个数组,类似[10,20] |
| borderRadius | number |px|0|否| 设置圆角边框,单位是px |
| shadow | string |||否|设定阴影样式,需要传递一个字符串,类似'2 2 1 gray',必须是这种模式 |

## 绘制中心多边形drawCenterPolygon ##

有一个中心点，边数为n的多边形通过顶点与中心点的连线将多边形分成n个区域

|属性名称|类型|单位|默认值|必填| 说明 | 
| -------- |  ---------- | ------------- | ---------- |------------- |-------------------- |
| x | number | px||是| 中心点的x坐标 |
| y | number | px|| 是 | 中心点的y坐标 |
| points | Array&lt;object&gt; |||是|顶点的坐标数组，可以传一个颜色属性，代表每个区域的颜色[{x:10,y:10,color:'red'},{x:100,y:10,color:'green'},{x:50,y:200,color:'blue'}]|
| border | Object | ||否| 是否在中心多边形外围添加一个统一的边框，对象中的属性与绘制多边形需要添加的属性一样,除了isFill,isStroke,points是固定值之外,其他属性都可添加修改，其实内部就是调用drawPolygon方法画了一个边框|
| isFill | boolean | |true|否| 是否填充 |
| isStroke | boolean | |false|否| 是否描边 |
| color | string | |'red'|否|填充颜色 |
| lineWidth | number |px||否| 设置线条的宽度 |
| lineColor | string |||否| 设置描边颜色 |
| lineJoin | string ||'round'|否|设置线条的交点样式 |
| lineDash | Array<number> | |0|否|设置虚线样式，需要传递一个数组,类似[10,20] |
| borderRadius | number |px|0|否| 设置圆角边框,单位是px |
| shadow | string |||否|设定阴影样式,需要传递一个字符串,类似'2 2 1 gray',必须是这种模式 |

## 绘制能力表drawAbilityChart ##
绘制能力表,需要传入中心点坐标,能力值的对象数组scores,每个对象有一个score能力值属性,color对应的颜色,例如[{score:80,color:'red'},{score:70,color:'red'}],
绘制能力表的基本步骤是
1.绘制网格,
2.绘制中心多边形或多边形,
3.绘制多边形的顶点，为圆点

|属性名称|类型|单位|默认值|必填| 说明 | 
| -------- |  ---------- | ------------- | ---------- |------------- |-------------------- |
| x | number | px||是| 中心点的x坐标 |
| y | number | px|| 是 | 中心点的y坐标 |
| radius | number |px ||是|网格的半径，无论是绘制圆形网格和多边形网格都有半径，多边形网格的顶点其实都在对应相同半径圆形的圆弧上|
| scores | Array ||| 是 |能力值数组，需要填写score属性，代表每个区域的能力值，能力值满分为100,需要根据能力值和半径绘制计算出多边形顶点坐标, [{score:80,color:'red'},{score:70,color:'red'}] |
| isCenter | boolean ||true|否|是否需要中心点，为false的话，就直接画个普通多边形,而不是中心多边形|
| vertexColors | Array | || 否 | 顶点的颜色数组，不写话的会根据scores里的color设置 |
| net | Object | || 否 | 网格配置对象，与绘制网格drawNet所需传的参数完全一样，但是不需要传递x,y,radius属性|
| polygon | Object | |{}| 是 | 中心多边形配置对象,与绘制绘制中心多边形drawCenterPolygon所需传的参数完全一样,但是不需要传递x,y,points属性，因为poits已经根据radius和scores属性计算出来 |
| vertex | Object | |{}| 是 | 顶点配置对象,与绘制圆弧drawArc所需传的参数完全一样 |

## 编写自定义方法 ##
可能nicepaint最好的一点就是容易扩充吧，在组件的ready方法里创建了一个注册对象，用于注册绘制类型和对应的处理函数

    //注册绘制方法，type类型=>对应处理方法,每新添加一个类型方法都要
    //在这里注册一下，这样写的好处调用方法的时候不需要进行条件判断
    this.data.canvasHandle = {
      'image': this.drawImage, //绘制图片
      'text': this.drawText, //绘制文本
      'rect': this.drawRect, //绘制长方形
      'line': this.drawLine,//绘制线段
      'arc': this.drawArc, //绘制圆弧,基本方法
      'polygon': this.drawPolygon, //绘制多边形，基本方法（核心）
      'centerpolygon': this.drawCenterPolygon, //绘制中心多边形
      'net': this.drawNet, //绘制网格   
      'abilitychart': this.drawAbilityChart //绘制能力表
    }
    
所以如果想要添加自己的新类型绘制方法，可以编写一个绘制函数，类似drawImage这种，绘制函数接收一个对象参数，
写完绘制函数后记得在上面的this.data.canvasHandle对象里注册一下，就可以使用了，nicepaint会把views数组里对应类型的对象当作参数传递到对应的类型处理函数里并执行

## 关键提示 ##
每个元素可以添加一个views属性，这样的话views里的元素就是当前元素的子元素，其坐标原点位于父元素的左上角位置,相当于相对定位的概念,

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
## 组件总结 ##

这个组件就是个 个人项目用于沟通交流的，肯定会有很多瑕疵，有什么问题可以加我微信一起探讨zhaoqingshan1101

