<template>
    <view class="photo-cliper">
        <view class="photo-cliper-main" @touchstart="clipBoxTouchStart" @touchmove="clipBoxTouchMove" @touchend="clipBoxTouchEnd">
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
                mode="aspectFill"
                :src="imageSrc"
                :style="{
                    width: `${imageWidth}px`,
                    height: `${imageHeight}px`,
                    transform: `translate3d(${imageTranslateX}px, ${imageTranslateY}px, 0)`
                }"
                @touchstart="imageTouchStart"
                @touchmove="imageTouchMove"
            ></image>
        </view>
        <canvas
            :style="{
                width: `${clipBoxWidth}px`,
                height: `${clipBoxHeight}px`
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

            imageTouchStartPosition: [
                {x: 0, y: 0},
            ],
            clipBoxTouchStartPosition: {
                x: 0, y: 0
            },
            FORBID_TOUCH_MOVE: false
        }
    },

    props: {
        imageSrc: {
            type: String
        },
        // imageWidth: {
        //     type: Number
        // },
        // imageHeight: {
        //     type: Number
        // },
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
        scale: {
            type: Number,
            default: 1
        },
        // 导出的图片相对于裁剪框的缩放比
        exportIamgeScale: {
            type: Number,
            default: 3
        },
        // 限制图片只能在裁剪框内拖动
        needLimitImageMoveRange: {
            type: Boolean,
            default: false
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
                imageHeight = clipBoxHeight * (imageOriginHeight / imageOriginWidth)
            } else {
                imageWidth = clipBoxWidth * (imageOriginWidth / imageOriginHeight)
                imageHeight = clipBoxHeight
            }
            
            this.imageWidth = imageWidth
            this.imageHeight = imageHeight
        },

        initCanvas() {
            this.canvasWidth = this.clipBoxWidth
            this.canvasHeight = this.clipBoxHeight
            this.canvasContext = uni.createCanvasContext('image-cropper')
        },

        imageTouchStart({touches}) {
            // 单指拖动
            if (touches.length === 1) {
                const [{ clientX: x, clientY: y }] = touches
                const { imageTranslateX: translateX, imageTranslateY: translateY } = this

                this.imageTouchStartPosition = { x, y, translateX, translateY }
            }
            // 双指放大
            else {

            }
        },

        imageTouchMove({touches}) {
            if (this.FORBID_TOUCH_MOVE) return

            // 单指拖动
            if (touches.length === 1) {
                const [{ clientX, clientY }] = touches
                const { x, y, translateX, translateY } = this.imageTouchStartPosition

                const deltaX = clientX - x
                const deltaY = clientY - y
                let imageTranslateX = translateX + deltaX
                let imageTranslateY = translateY + deltaY
                
                if (this.needLimitImageMoveRange) {
                    const result = this.limitImageTranslate(imageTranslateX, imageTranslateY)
                    imageTranslateX = result.translateX
                    imageTranslateY = result.translateY
                }

                this.imageTranslateX = imageTranslateX
                this.imageTranslateY = imageTranslateY
            }
            // 双指放大
            else {

            }
        },

        limitImageTranslate(translateX, translateY) {
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
            // 触摸非剪裁框四角
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

            this.FORBID_TOUCH_MOVE = true
        },

        clipBoxTouchMove({touches}) {
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

                // nothing
            }
        },

        clipBoxTouchEnd() {
            this.FORBID_TOUCH_MOVE = false
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
}
.clip-box-border {
    position: absolute;
    background:white;
    pointer-events:auto;

    &.border-top-left {
        top: -5rpx;
        left: -5rpx;
        width: 33rpx;
        height: 5rpx;
    }
    &.border-left-top {
        top: -5rpx;
        left: -5rpx;
        width: 5rpx;
        height: 33rpx;
    }
    &.border-top-right {
        top: -5rpx;
        right: -5rpx;
        width: 33rpx;
        height: 5rpx;
    }
    &.border-right-top {
        top: -5rpx;
        right: -5rpx;
        width: 5rpx;
        height: 33rpx;
    }
    &.border-bottom-left {
        bottom: -5rpx;
        left: -5rpx;
        width: 33rpx;
        height: 5rpx;
    }
    &.border-left-bottom {
        bottom: -5rpx;
        left: -5rpx;
        width: 5rpx;
        height: 33rpx;
    }
    &.border-bottom-right {
        bottom: -5rpx;
        right: -5rpx;
        width: 33rpx;
        height: 5rpx;
    }
    &.border-right-bottom {
        bottom: -5rpx;
        right: -5rpx;
        width: 5rpx;
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
