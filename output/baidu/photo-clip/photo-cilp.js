(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/photo-clip/photo-cilp"],{"00eb":function(t,i,e){"use strict";var o=e("e9e2"),a=e.n(o);a.a},"45c7":function(t,i,e){"use strict";(function(t){function e(t,i){return n(t)||a(t,i)||o()}function o(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function a(t,i){var e=[],o=!0,a=!1,n=void 0;try{for(var h,s=t[Symbol.iterator]();!(o=(h=s.next()).done);o=!0)if(e.push(h.value),i&&e.length===i)break}catch(l){a=!0,n=l}finally{try{o||null==s["return"]||s["return"]()}finally{if(a)throw n}}return e}function n(t){if(Array.isArray(t))return t}Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var h={data:function(){return{imageWidth:0,imageHeight:0,scale:this.initialScale,angle:this.initialAngle,imageCenterPoint:{x:t.getSystemInfoSync().windowWidth/2,y:t.getSystemInfoSync().windowHeight/2},clipBoxWidth:this.initialClipBoxWidth,clipBoxHeight:this.initialClipBoxHeight,clipBoxTop:this.initialClipBoxTop,clipBoxLeft:this.initialClipBoxLeft,canvasContext:null,canvasWidth:200,canvasHeight:200,systemInfo:t.getSystemInfoSync(),imageTouchStartPosition:[],clipBoxTouchStartPosition:{},FORBID_IMAGE_TOUCH:!1,FORBID_IMAGE_ADIMATION:!1}},props:{show:{type:Boolean,default:!1},imageSrc:{type:String},initialClipBoxWidth:{type:Number,default:250},initialClipBoxHeight:{type:Number,default:300},initialClipBoxTop:{type:Number,default:0},initialClipBoxLeft:{type:Number,default:0},initialScale:{type:Number,default:1},initialAngle:{type:Number,default:0},exportIamgeScale:{type:Number,default:3},needLimitImageMoveRange:{type:Boolean,default:!0},needLockClipBoxRatio:{type:Boolean,default:!1},needLockClipBoxWidth:{type:Boolean,default:!1},needLockClipBoxHeight:{type:Boolean,default:!1},needLockImageScale:{type:Boolean,default:!1},needLockImageRotate:{type:Boolean,default:!1}},computed:{imageTranslateX:{get:function(){return this.imageCenterPoint.x-this.imageWidth/2},set:function(t){this.imageCenterPoint.x=t+this.imageWidth/2}},imageTranslateY:{get:function(){return this.imageCenterPoint.y-this.imageHeight/2},set:function(t){this.imageCenterPoint.y=t+this.imageHeight/2}},scaledImageWidth:function(){return this.imageWidth*this.scale},scaledImageHeight:function(){return this.imageHeight*this.scale},scaledImageTranslateX:function(){return this.imageCenterPoint.x-this.scaledImageWidth/2},scaledImageTranslateY:function(){return this.imageCenterPoint.y-this.scaledImageHeight/2},clipBoxPoint:function(){var t=this.clipBoxLeft,i=this.clipBoxTop,e=this.clipBoxWidth,o=this.clipBoxHeight,a=15,n=t+e,h=i+o,s={top:i-a,right:t+a,bottom:i+a,left:t-a},l={top:i-a,right:n+a,bottom:i+a,left:n-a},c={top:h-a,right:t+a,bottom:h+a,left:t-a},g={top:h-a,right:n+a,bottom:h+a,left:n-a};return{leftTopPoint:s,leftBottomPoint:c,rightTopPoint:l,rightBottomPoint:g}}},watch:{imageSrc:function(){this.initImage()},needLimitImageMoveRange:function(t){t&&(this.limitImageScale(),this.limitImagePosition())},angle:function(){this.setClipBoxAndImageCenter()}},methods:{initClipBox:function(){var t=this.systemInfo,i=t.windowWidth,e=t.windowHeight;this.clipBoxWidth>i&&(this.clipBoxWidth=i),this.clipBoxHeight>e&&(this.clipBoxHeight=e),this.clipBoxLeft=(i-this.clipBoxWidth)/2,this.clipBoxTop=(e-this.clipBoxHeight)/2},initImage:function(){t.getImageInfo({src:this.imageSrc,success:this.initImageSize})},initImageSize:function(t){var i,e,o=t.width,a=t.height,n=this.clipBoxWidth,h=this.clipBoxHeight,s=n/h,l=o/a;l<s?(i=n,e=n*(a/o)):(i=h*(o/a),e=h),this.imageWidth=i,this.imageHeight=e,this.needLimitImageMoveRange&&this.limitImagePosition(),this.$emit("completed")},setClipBoxAndImageCenter:function(){var t=this.systemInfo,i=t.windowWidth,e=t.windowHeight,o=this.clipBoxWidth,a=this.clipBoxHeight,n=this.imageTranslateX,h=this.imageTranslateY,s=(i-o)/2,l=(e-a)/2;this.imageTranslateX=n-(this.clipBoxLeft-s),this.clipBoxLeft=s,this.imageTranslateY=h-(this.clipBoxTop-l),this.clipBoxTop=l},initCanvas:function(){this.canvasContext=t.createCanvasContext("image-cropper",this)},imageTouchStart:function(t){var i=t.touches;if(!this.FORBID_IMAGE_TOUCH&&(this.FORBID_IMAGE_ADIMATION=!0,1===i.length)){var o=e(i,1),a=o[0],n=a.clientX,h=a.clientY,s=this.imageCenterPoint;this.imageTouchStartPosition[0]={x:n,y:h,cx:s.x,cy:s.y}}},imageTouchMove:function(t){var i=t.touches;if(!this.FORBID_IMAGE_TOUCH&&1===i.length){var o=e(i,1),a=o[0],n=a.clientX,h=a.clientY,s=this.imageTouchStartPosition[0],l=s.x,c=s.y,g=s.cx,r=s.cy,m=n-l,p=h-c,u=g+m,d=r+p;this.needLimitImageMoveRange?this.limitImagePosition(u,d):this.imageCenterPoint={x:u,y:d}}},imageTouchEnd:function(){this.FORBID_IMAGE_ADIMATION=!1},clipBoxTouchStart:function(t){var i,o=t.touches,a=e(o,1),n=a[0],h=n.clientX,s=n.clientY,l=this.clipBoxPoint,c=l.leftTopPoint,g=l.leftBottomPoint,r=l.rightTopPoint,m=l.rightBottomPoint;if(c.left<h&&h<c.right&&c.top<s&&s<c.bottom)i="leftTop";else if(r.left<h&&h<r.right&&r.top<s&&s<r.bottom)i="rightTop";else if(g.left<h&&h<g.right&&g.top<s&&s<g.bottom)i="leftBottom";else{if(!(m.left<h&&h<m.right&&m.top<s&&s<m.bottom))return this.clipBoxTouchStartPosition.touchPoint=null;i="rightBottom"}this.clipBoxTouchStartPosition={x:h,y:s,touchPoint:i,left:this.clipBoxLeft,top:this.clipBoxTop,width:this.clipBoxWidth,height:this.clipBoxHeight},this.FORBID_IMAGE_TOUCH=!0,this.FORBID_IMAGE_ADIMATION=!0},clipBoxTouchMove:function(t){var i=t.touches;if(this.clipBoxTouchStartPosition.touchPoint){var o=e(i,1),a=o[0],n=a.clientX,h=a.clientY,s=this.clipBoxWidth,l=this.clipBoxHeight,c=this.clipBoxLeft,g=this.clipBoxTop,r=this.needLockClipBoxWidth,m=this.needLockClipBoxHeight,p=this.needLockClipBoxRatio,u=this.clipBoxTouchStartPosition,d=u.x,f=u.y,x=u.touchPoint,B=u.left,I=u.top,v=u.width,T=u.height,C=n-d,y=h-f;if("leftTop"===x&&(s=v-C,l=T-y,c=B+C,g=I+y),"rightTop"===x&&(s=v+C,l=T-y,g=I+y),"leftBottom"===x&&(s=v-C,l=T+y,c=B+C),"rightBottom"===x&&(s=v+C,l=T+y),p){var P=this.clipBoxWidth/this.clipBoxHeight;l=s/P}r&&!p||(this.clipBoxWidth=s,this.clipBoxLeft=c),m&&!p||(this.clipBoxHeight=l,this.clipBoxTop=g),this.needLimitImageMoveRange&&(this.limitImageScale(),this.limitImagePosition())}},clipBoxTouchEnd:function(){this.FORBID_IMAGE_TOUCH=!1,this.FORBID_IMAGE_ADIMATION=!1},limitImageScale:function(t){var i=this.clipBoxWidth,e=this.clipBoxHeight,o=this.imageWidth,a=this.imageHeight,n=this.angle;void 0===t&&(t=this.scale),1===Math.abs(n/90%2)&&(o=a,a=this.imageWidth);var h=o*t,s=a*t;h<i&&(t=i/o),s<e&&(t=Math.max(t,e/a)),this.scale=t},limitImagePosition:function(t,i){var e=this.clipBoxTop,o=this.clipBoxLeft,a=this.clipBoxWidth,n=this.clipBoxHeight,h=this.imageCenterPoint,s=(this.imageWidth,this.imageHeight),l=this.scaledImageWidth,c=this.scaledImageHeight,g=(this.scale,this.angle);void 0===t&&(t=h.x),void 0===i&&(i=h.y);var r=o+a,m=e+n;1===Math.abs(g/90%2)&&(s,s=this.imageWidth,l=c,c=this.scaledImageWidth);var p=o+l/2,u=r-l/2;p<t?t=p:u>t&&(t=u);var d=e+c/2,f=m-c/2;d<i?i=d:f>i&&(i=f),this.imageCenterPoint={x:t,y:i}},previewImage:function(t){var i=t.detail?t.detail.x:t.touches[0].clientX,e=t.detail?t.detail.y:t.touches[0].clientY,o=this.clipBoxLeft,a=this.clipBoxTop,n=this.clipBoxWidth,h=this.clipBoxHeight,s=o+n,l=a+h;o<=i&&i<=s&&a<=e&&e<=l&&this.drawImage(this.drawImageCallBack)},drawImage:function(t){var i=this,e=this.clipBoxLeft,o=this.clipBoxTop,a=this.clipBoxWidth,n=this.clipBoxHeight,h=this.imageSrc,s=this.imageCenterPoint,l=(this.imageWidth,this.imageHeight,this.scaledImageWidth),c=this.scaledImageHeight,g=(this.scaledImageTranslateX,this.scaledImageTranslateY,this.exportIamgeScale),r=this.angle;this.canvasWidth=a,this.canvasHeight=n;var m=(s.x-e)*g,p=(s.y-o)*g,u=l*g,d=c*g;this.canvasContext.save(),this.canvasContext.translate(m,p),this.canvasContext.rotate(r*Math.PI/180),this.canvasContext.drawImage(h,-u/2,-d/2,u,d),this.canvasContext.draw(!1,setTimeout(function(){t(),i.canvasContext.restore(),i.canvasContext.clearRect(-u/2,-d/2,u,d)},500))},drawImageCallBack:function(){var i=this.clipBoxWidth,e=this.clipBoxHeight,o=this.exportIamgeScale,a=i*o,n=e*o;t.canvasToTempFilePath({width:a,height:n,destWidth:a,destHeight:n,fileType:"jpg",canvasId:"image-cropper",success:function(i){t.previewImage({current:i.tempFilePath,urls:[i.tempFilePath]})}},this)},moveV:function(t){var i=this.imageCenterPoint.x+("left"===t?-3:3);this.needLimitImageMoveRange&&this.limitImagePosition(i)},moveH:function(t){var i=this.imageCenterPoint.y+("up"===t?-3:3);this.needLimitImageMoveRange&&this.limitImagePosition(void 0,i)},scaling:function(t){if(!this.needLockImageScale){var i=this.scale+("enlarge"===t?.02:-.02);this.needLimitImageMoveRange&&this.limitImageScale(i)}},rotate:function(t){this.needLockImageRotate||(this.angle=(this.angle+t)%360,this.limitImageScale(),this.limitImagePosition())}},onReady:function(){this.initClipBox(),this.initCanvas()}};i.default=h}).call(this,e("d15d")["default"])},"5fb5":function(t,i,e){"use strict";var o=function(){var t=this,i=t.$createElement;t._self._c},a=[];e.d(i,"a",function(){return o}),e.d(i,"b",function(){return a})},aa2b:function(t,i,e){"use strict";e.r(i);var o=e("45c7"),a=e.n(o);for(var n in o)"default"!==n&&function(t){e.d(i,t,function(){return o[t]})}(n);i["default"]=a.a},afb4:function(t,i,e){"use strict";e.r(i);var o=e("5fb5"),a=e("aa2b");for(var n in a)"default"!==n&&function(t){e.d(i,t,function(){return a[t]})}(n);e("00eb");var h=e("6691"),s=Object(h["a"])(a["default"],o["a"],o["b"],!1,null,null,null);i["default"]=s.exports},e9e2:function(t,i,e){}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/photo-clip/photo-cilp-create-component',
    {
        'components/photo-clip/photo-cilp-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('d15d')['createComponent'](__webpack_require__("afb4"))
        })
    },
    [['components/photo-clip/photo-cilp-create-component']]
]);                
