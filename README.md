# NicePaint
一个用于快速绘制小程序海报的工具类

NPM名称

一个简单的画海报用的canvas组件,内置了几个方法

this.data.canvasHandle = {

'image': this.drawImage, //绘制图片

'text': this.drawText, //绘制文本

'rect': this.drawRect, //绘制长方形

'arc': this.drawArc, //绘制圆弧

'polygon': this.drawPolygon, //绘制多边形

'centerpolygon': this.drawCenterPolygon, //绘制中心多边形

'net': this.drawNet, //绘制网格   

'abilitychart': this.drawAbilityChart //绘制能力表

}

属性一般有left,right,width,height,代表元素左上角横坐标和纵坐标,元素宽度和高度,



对于绘制图片需要传递一个url参数,text需要传递个content参数



绘制圆弧和绘制中心多边形和绘制网格,都需要一个中心点x,y,代表中心点的坐标,具体使用还是看github上的使用例子，这个组件主要是我自己工作用的,有很多瑕疵，以后应该还会根据需求扩充的，主要是用于交流的