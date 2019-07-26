<template>
    <view>
        <canvas
            tyle="width: {{clipBoxWidth}}px; height: {{clipBoxHeight}}px;"
            canvas-id="image-cropper"
        >
        </canvas>
    </view>
</template>

<script>
export default {
    data: () => ({
        clipBoxWidth: this.initialClipBoxWidth,
        clipBoxHeight: this.initialClipBoxHeight,
        clipBoxTop: this.initialClipBoxTop,
        clipBoxLeft: this.initialClipBoxLeft,
        canvasContext: null,
        canvasWidth: 200,
        canvasHeight: 200,
        systemInfo: uni.getSystemInfoSync()
    }),

    props: {
        imageSrc: {
            type: String
        },
        imageWidth: {
            type: Number
        },
        imageHeight: {
            type: Number
        },
        initialClipBoxWidth: {
            type: Number,
            default: 200
        },
        initialClipBoxHeight: {
            type: Number,
            default: 200
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
    },

    onLoad () {
    },

    methods: {
        initCanvas() {
            this.canvasWidth = this.clipBoxWidth
            this.canvasHeight = this.clipBoxHeight
            this.canvasContext = uni.createCanvasContext('image-cropper')
        },

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
            this.clipBoxTop = (windowHeight - this.windowHeight) / 2
        },

        imageTouchStart({touches}) {
            // 单指拖动
            if (touches.length === 1) {

            }
            // 双指放大
            else {

            }
        },

        draw() {
            if (!this.imageSrc) return 
        },

        canvasDraw() {
        }
    }
}
</script>

<style>
</style>
