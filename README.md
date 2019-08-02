# photo-clip

## 功能强大的微信小程序、百度小程序的图片裁剪组件

* 功能强大
* 组件化支持，使用简单
* 支持导出图片配置
* 点击裁剪框中间预览裁剪结果
* 支持微信小程序、百度小程序
* 后续可能支持H5、支付宝小程序
* 基于uni-app
* 使用Vue语法，可扩展到Vue项目

## 源码

代码都是uni-app编译后的，拿到对应平台的代码，不同平台使用方式不同

[微信小程序代码](/output/baidu/photo-clip)

[百度小程序代码](/output/weixin/photo-clip)

## Props

| props | type | default | desc | require |
| ----- |:-----:|:------:|:----:|:-----:|
| show | Boolean | false | 同v-show（uni-app不支持v-show）| false |
| imageSrc| String| '' | 图片src | true |
| initialClipBoxWidth | Number| 250 | 裁剪框宽度（px） | false |
| initialClipBoxHeight | Number| 300 | 裁剪框高度（px） | false |
| initialClipBoxLeft | Number| 0 | 裁剪框相对屏幕左上角left（px） | false |
| initialClipBoxTop | Number| 0 | 裁剪框相对屏幕左上角top（px） | false |
| initialScale | Number| 1 | 图片缩放比 | false |
| initialAngle | Number| 0 | 图片旋转角度（deg） | false |
| exportIamgeScale | Number| 3 | 导出的图片相对于裁剪框的缩放比 | false |
| needLimitImageMoveRange | Boolean | true | 限制图片只能在裁剪框内拖动 | false |
| needLockClipBoxRatio | Boolean | false | 锁定裁剪框比例 | false |
| needLockClipBoxWidth | Boolean | false | 锁定裁剪框宽 | false |
| needLockClipBoxHeight | Boolean | false | 锁定裁剪框高 | false |
| needLockImageScale | Boolean | false | 禁止图片缩放 | false |
| needLockImageRotate | Boolean | false | 禁止图片旋转 | false |

## Methods

| Methods | args | desc |
| --------|:------:|:------:|
| setClipBoxAndImageCenter | - | 初始化图片和裁剪框位置，为居中状态 |
| moveV | direction(left、right) | 图片水平方向移动3px |
| moveH | direction(top、bottom) | 图片竖直方向移动3px |
| scaling | opeation(enlarge、narrow) | 图片缩放0.02 |
| rotate | deg | 图片旋转 |
