<template>
    <view class="photo-cliper">
        <view class="photo-cliper-main" @touchstart="clipBoxTouchStart" @touchmove="clipBoxTouchMove" @touchend="clipBoxTouchEnd" @tap="previewImage">
            <view class="photo-cliper-content">
                <view class="clip-box-top shallow-background" :style="{height: `${clipBoxTop}px`}"></view>
                <view class="clip-box-wrap">
                    <view class="clip-box-left shallow-background" :style="{width: `${clipBoxLeft}px`}"></view>
                    <view
                        class="clip-box"
                        :style="{
                            width: `${clipBoxWidth}px`,
                            height: `${clipBoxHeight}px`
                        }"
                    >
                        <view class="clip-box-border border-top-left"></view>
                        <view class="clip-box-border border-left-top"></view>
                        <view class="clip-box-border border-top-right"></view>
                        <view class="clip-box-border border-right-top"></view>
                        <view class="clip-box-border border-left-bottom"></view>
                        <view class="clip-box-border border-bottom-left"></view>
                        <view class="clip-box-border border-right-bottom"></view>
                        <view class="clip-box-border border-bottom-right"></view>
                    </view>
                    <view class="clip-box-right shallow-background"></view>
                </view>
                <view class="clip-box-bottom shallow-background"></view>
            </view>
            <image
                class="photo-cliper-image"
                :src="imageSrc"
                :style="{
                    width: `${imageWidth}px`,
                    height: `${imageHeight}px`,
                    transform: `translate3d(${imageTranslateX}px, ${imageTranslateY}px, 0) scale(${scale}) rotate(${angle}deg)`
                }"
                @touchstart="imageTouchStart"
                @touchmove="imageTouchMove"
            ></image>
        </view>
        <canvas
            :style="{
                width: `${canvasWidth * exportIamgeScale}px`,
                height: `${canvasHeight * exportIamgeScale}px`
            }"
            canvas-id="image-cropper"
        >
        </canvas>
    </view>
</template>

<script>
export default {
    data () {
        return {
            imageWidth: 0,
            imageHeight: 0,
            scale: this.initialScale,
            angle: this.initialAngle,
            imageCenterPoint: {
                x: uni.getSystemInfoSync().windowWidth / 2,
                y: uni.getSystemInfoSync().windowHeight / 2
            },

            clipBoxWidth: this.initialClipBoxWidth,
            clipBoxHeight: this.initialClipBoxHeight,
            clipBoxTop: this.initialClipBoxTop,
            clipBoxLeft: this.initialClipBoxLeft,
            canvasContext: null,
            canvasWidth: 200,
            canvasHeight: 200,
            systemInfo: uni.getSystemInfoSync(),

            imageTouchStartPosition: [],
            clipBoxTouchStartPosition: {},
            FORBID_IAMGE_TOUCH: false
        }
    },

    props: {
        imageSrc: {
            type: String
        },
        initialClipBoxWidth: {
            type: Number,
            default: 250
        },
        initialClipBoxHeight: {
            type: Number,
            default: 300
        },
        initialClipBoxTop: {
            type: Number,
            default: 0,
        },
        initialClipBoxLeft: {
            type: Number,
            default: 0
        },
        // 图片缩放比
        initialScale: {
            type: Number,
            default: 1
        },
        initialAngle: {
            type: Number,
            default: 0
        },
        // 导出的图片相对于裁剪框的缩放比
        exportIamgeScale: {
            type: Number,
            default: 3
        },
        // 限制图片只能在裁剪框内拖动
        needLimitImageMoveRange: {
            type: Boolean,
            default: true
        }
    },

    computed: {
        imageTranslateX: {
            get() {
                return this.imageCenterPoint.x - (this.imageWidth / 2)
            },
            set(imageTranslateX) {
                this.imageCenterPoint.x =  imageTranslateX  + (this.imageWidth / 2)
            }
        },

        imageTranslateY: {
            get() {
                return this.imageCenterPoint.y - (this.imageHeight / 2)
            },
            set(imageTranslateY) {
                this.imageCenterPoint.y =  imageTranslateY  + (this.imageHeight / 2)
            }
        },

        // 裁剪框四个角的坐标，用于裁剪框的拖拽
        clipBoxPoint() {
            const { clipBoxLeft, clipBoxTop, clipBoxWidth, clipBoxHeight } = this,
                POINT_WIDTH = 15
            const clipRight = clipBoxLeft + clipBoxWidth,
                clipBottom = clipBoxTop + clipBoxHeight

            const leftTopPoint = { 
                top: clipBoxTop - POINT_WIDTH,
                right: clipBoxLeft + POINT_WIDTH,
                bottom: clipBoxTop + POINT_WIDTH,
                left: clipBoxLeft - POINT_WIDTH
            }
            const rightTopPoint = { 
                top: clipBoxTop - POINT_WIDTH,
                right: clipRight + POINT_WIDTH,
                bottom: clipBoxTop + POINT_WIDTH,
                left: clipRight - POINT_WIDTH
            }
            const leftBottomPoint = { 
                top: clipBottom - POINT_WIDTH,
                right: clipBoxLeft + POINT_WIDTH,
                bottom: clipBottom + POINT_WIDTH,
                left: clipBoxLeft - POINT_WIDTH
            }
            const rightBottomPoint = { 
                top: clipBottom - POINT_WIDTH,
                right: clipRight + POINT_WIDTH,
                bottom: clipBottom + POINT_WIDTH,
                left: clipRight - POINT_WIDTH
            }

            return { leftTopPoint, leftBottomPoint, rightTopPoint, rightBottomPoint }
        }
    },

    onReady () {
        this.initClipBox()
        this.initImage()
        this.initCanvas()
    },

    methods: {
        initClipBox() {
            const { windowWidth, windowHeight } = this.systemInfo

            // 若裁剪框宽度度超过设备宽度，为设备宽度
            if (this.clipBoxWidth > windowWidth) {
                this.clipBoxWidth = windowWidth
            }
            // 若裁剪框宽度度超过设备高度，为设备高度
            if (this.clipBoxHeight > windowHeight) {
                this.clipBoxHeight = windowHeight
            }
            // 设置裁剪框为居中状态
            this.clipBoxLeft = (windowWidth - this.clipBoxWidth) / 2
            this.clipBoxTop = (windowHeight - this.clipBoxHeight) / 2
        },

        initImage() {
            uni.getImageInfo({
                src: this.imageSrc,
                success: this.initImageSize
            })
        },

        initImageSize({ width: imageOriginWidth, height: imageOriginHeight }) {
            const { clipBoxWidth, clipBoxHeight } = this
            const clipBoxAspectRatio = clipBoxWidth / clipBoxHeight
            const imageOriginAspectRatio = imageOriginWidth / imageOriginHeight

            let imageWidth, imageHeight
            // 默认图片最短的边长度设置为裁剪框相应边的边长
            if (imageOriginAspectRatio < clipBoxAspectRatio) {
                imageWidth = clipBoxWidth
                imageHeight = clipBoxWidth * (imageOriginHeight / imageOriginWidth)
            } else {
                imageWidth = clipBoxHeight * (imageOriginWidth / imageOriginHeight)
                imageHeight = clipBoxHeight
            }
            
            this.imageWidth = imageWidth
            this.imageHeight = imageHeight
        },

        initCanvas() {
            this.canvasContext = uni.createCanvasContext('image-cropper')
        },

        imageTouchStart({touches}) {
            if (this.FORBID_IAMGE_TOUCH) return

            // 单指拖动
            if (touches.length === 1) {
                const [{ clientX: x, clientY: y }] = touches
                const { imageTranslateX: translateX, imageTranslateY: translateY } = this

                this.imageTouchStartPosition[0] = { x, y, translateX, translateY }
            }
            // 双指放大
            else {}
        },

        imageTouchMove({touches}) {
            if (this.FORBID_IAMGE_TOUCH) return

            // 单指拖动
            if (touches.length === 1) {
                const [{ clientX, clientY }] = touches
                const { x, y, translateX, translateY } = this.imageTouchStartPosition[0]

                const deltaX = clientX - x
                const deltaY = clientY - y
                let imageTranslateX = translateX + deltaX
                let imageTranslateY = translateY + deltaY
                
                if (this.needLimitImageMoveRange) {
                    const result = this.limitImageTransform(imageTranslateX, imageTranslateY)
                    imageTranslateX = result.translateX
                    imageTranslateY = result.translateY
                }

                this.imageTranslateX = imageTranslateX
                this.imageTranslateY = imageTranslateY
            }
            // 双指放大
            else {}
        },

        clipBoxTouchStart({touches}) {
            const [{ clientX: x, clientY: y }] = touches
            const { leftTopPoint, leftBottomPoint, rightTopPoint, rightBottomPoint } = this.clipBoxPoint

            let touchPoint
            // 触摸裁剪框左上角
            if ((leftTopPoint.left < x && x < leftTopPoint.right ) && (leftTopPoint.top < y && y < leftTopPoint.bottom)) {
                touchPoint = 'leftTop'
            }
            // 触摸裁剪框右上角
            else if ((rightTopPoint.left < x && x < rightTopPoint.right ) && (rightTopPoint.top < y && y < rightTopPoint.bottom)) {
                touchPoint = 'rightTop'
            }
            // 触摸裁剪框左下角
            else if ((leftBottomPoint.left < x && x < leftBottomPoint.right ) && (leftBottomPoint.top < y && y < leftBottomPoint.bottom)) {
                touchPoint = 'leftBottom'
            }
            // 触摸裁剪框右下角
            else if ((rightBottomPoint.left < x && x < rightBottomPoint.right ) && (rightBottomPoint.top < y && y < rightBottomPoint.bottom)) {
                touchPoint = 'rightBottom'
            }
            // 触摸到其他区域不生效
            else {
                return this.clipBoxTouchStartPosition.touchPoint = null
            }

            this.clipBoxTouchStartPosition = { 
                x, y, touchPoint, 
                left: this.clipBoxLeft,
                top: this.clipBoxTop,
                width: this.clipBoxWidth,
                height: this.clipBoxHeight 
            }

            this.FORBID_IAMGE_TOUCH = true
        },

        clipBoxTouchMove({touches}) {
            // 触摸到其他区域不生效
            if (!this.clipBoxTouchStartPosition.touchPoint) return

            const [{ clientX, clientY }] = touches
            const { x, y, touchPoint, left, top, width, height } = this.clipBoxTouchStartPosition

            const deltaX = clientX - x
            const deltaY = clientY - y

            if (touchPoint === 'leftTop') {
                this.clipBoxWidth = width - deltaX
                this.clipBoxHeight = height - deltaY

                // 裁剪框宽高增加，则裁剪框left、top则减小，反之同理
                this.clipBoxLeft = left + deltaX
                this.clipBoxTop = top + deltaY
            }
            if (touchPoint === 'rightTop') {
                this.clipBoxWidth = width + deltaX
                this.clipBoxHeight = height - deltaY

                this.clipBoxTop = top + deltaY
            }
            if (touchPoint === 'leftBottom') {
                this.clipBoxWidth = width - deltaX
                this.clipBoxHeight = height + deltaY

                this.clipBoxLeft = left + deltaX
            }
            if (touchPoint === 'rightBottom') {
                this.clipBoxWidth = width + deltaX
                this.clipBoxHeight = height + deltaY
            }
        },

        clipBoxTouchEnd() {
            this.FORBID_IAMGE_TOUCH = false
        },

        limitImageTransform(translateX, translateY) {
            const { clipBoxTop, clipBoxLeft, clipBoxWidth, clipBoxHeight, imageWidth, imageHeight } = this

            if (translateX > clipBoxLeft) {
                translateX = clipBoxLeft
            }
            else if (translateX < (clipBoxLeft + clipBoxWidth - imageWidth)) {
                translateX = clipBoxLeft + clipBoxWidth - imageWidth
            }

            if (translateY > clipBoxTop) {
                translateY = clipBoxTop
            }
            else if (translateY < (clipBoxTop + clipBoxHeight - imageHeight)) {
                translateY = clipBoxTop + clipBoxHeight - imageHeight
            }

            return { translateX, translateY }
        },

        previewImage(event) {
            const x = event.detail ? event.detail.x : event.touches[0].clientX
            const y = event.detail ? event.detail.y : event.touches[0].clientY
            const { clipBoxLeft, clipBoxTop, clipBoxWidth, clipBoxHeight } = this
            const clipBoxRight = clipBoxLeft + clipBoxWidth
            const clipBoxBottom = clipBoxTop + clipBoxHeight
            
            // 点击裁剪框区域
            if ((clipBoxLeft <= x && x <= clipBoxRight) && (clipBoxTop <= y && y <= clipBoxBottom)) {
                this.drawImage(this.drawImageCallBack)
            }            
        },

        drawImage(drawImageCallBack) {
            const { clipBoxLeft, clipBoxTop, clipBoxWidth, clipBoxHeight, imageSrc, imageWidth, imageHeight, scale, exportIamgeScale, imageCenterPoint } = this
            this.canvasWidth = clipBoxWidth
            this.canvasHeight = clipBoxHeight

            const scaledImageWidth = imageWidth * scale
            const scaledImageHeight = imageHeight * scale
            // 裁剪框左上角距离缩放后的图片的左上角的xy值
            // ⚠️：缩放后的imageTranslateX、Y需要用图片中心点减去缩放后图片的宽高，所以this.imageTranslateX、Y不再适用
            const scaledImageTranslateX = imageCenterPoint.x - (scaledImageWidth / 2)
            const scaledImageTranslateY = imageCenterPoint.y - (scaledImageHeight / 2)

            const x = Math.round( (clipBoxLeft - scaledImageTranslateX) * exportIamgeScale )
            const y = Math.round( (clipBoxTop - scaledImageTranslateY) * exportIamgeScale )
            const drawImageWidth = scaledImageWidth * exportIamgeScale
            const drawImageHeight = scaledImageHeight * exportIamgeScale

            this.canvasContext.drawImage(imageSrc, -x, -y, drawImageWidth, drawImageHeight)
            this.canvasContext.draw(false, setTimeout(() => {
                drawImageCallBack()
            }, 500))
        },

        drawImageCallBack() {
            const { clipBoxWidth, clipBoxHeight, exportIamgeScale } = this
            const width = clipBoxWidth * exportIamgeScale
            const height = clipBoxHeight * exportIamgeScale

            uni.canvasToTempFilePath({
                width,
                height,
                destWidth: width,
                destHeight: height,
                fileType: 'jpg',
                canvasId: 'image-cropper',
                success: res => {
                    uni.previewImage({
                        current: res.tempFilePath,
                        urls: [res.tempFilePath]
                    })
                }
            })
        },

        // 以下用于父组件使用
        moveV(direction) {
            this.imageTranslateX += (direction === 'left') ? -3 : 3
        },

        moveH(direction) {
            this.imageTranslateY += (direction === 'up') ? -3 : 3
        },

        scaling(opeation) {
            this.scale += (opeation === 'enlarge') ? 0.02 : -0.02
        },

        rotate() {
            this.angle = (this.angle + 90) % 360
        }
    }
}
</script>

<style lang="scss">
.photo-cliper {
    background:rgba(14, 13, 13, .8);
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;

    .photo-cliper-main {
        width: 100%;
        height: 100%;

        .photo-cliper-content {
            position: relative;
            display: flex;
            flex-direction:column;
            width: 100%;
            height: 100%;
            z-index: 20;
            pointer-events: none;

            .clip-box-top {
                width: 100%;
                height: 100px;
            }
            
            .clip-box-wrap {
                display: flex;
                width: 100%;

                .clip-box {
                    position: relative;
                    box-sizing: border-box;
                    border: 1px solid red;
                }

                .clip-box-right {
                    flex: auto;
                }
            }

            .clip-box-bottom {
                flex: auto;
            }
        }

        .photo-cliper-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 400px;
            height: 400px;
            z-index: 10;
        }
    }
    
    canvas {
        position:fixed;
        z-index:10;
        top:-200%;
        pointer-events:none;
    }
}
.clip-box-border {
    position: absolute;
    background:white;
    pointer-events:auto;

    &.border-top-left {
        top: -3px;
        left: -3px;
        width: 33rpx;
        height: 3px;
    }
    &.border-left-top {
        top: -3px;
        left: -3px;
        width: 3px;
        height: 33rpx;
    }
    &.border-top-right {
        top: -3px;
        right: -3px;
        width: 33rpx;
        height: 3px;
    }
    &.border-right-top {
        top: -3px;
        right: -3px;
        width: 3px;
        height: 33rpx;
    }
    &.border-bottom-left {
        bottom: -3px;
        left: -3px;
        width: 33rpx;
        height: 3px;
    }
    &.border-left-bottom {
        bottom: -3px;
        left: -3px;
        width: 3px;
        height: 33rpx;
    }
    &.border-bottom-right {
        bottom: -3px;
        right: -3px;
        width: 33rpx;
        height: 3px;
    }
    &.border-right-bottom {
        bottom: -3px;
        right: -3px;
        width: 3px;
        height: 33rpx;
    }
}
.shallow-background {
    background-color: rgba(0, 0, 0, 0.45);
}
.deep-background {
    background-color: rgba(0, 0, 0, 0.8);
}
</style>
