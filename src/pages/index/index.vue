<template>
	<view>
		<view class="switch-box">
			<view class="uni-list">
				<view class="uni-list-cell uni-list-cell-pd">
					<view class="uni-list-cell-db">限制图片在裁剪框内移动</view>
					<switch checked @change="needLimitImageMoveRangeChange"/>
				</view>
				<view class="uni-list-cell uni-list-cell-pd">
					<view class="uni-list-cell-db">禁止图片缩放</view>
					<switch @change="needLockImageScaleChange"/>
				</view>
				<view class="uni-list-cell uni-list-cell-pd">
					<view class="uni-list-cell-db">锁定裁剪框宽度</view>
					<switch @change="needLockClipBoxWidthChange"/>
				</view>
				<view class="uni-list-cell uni-list-cell-pd">
					<view class="uni-list-cell-db">锁定裁剪框高度</view>
					<switch @change="needLockClipBoxHeightChange"/>
				</view>
				<view class="uni-list-cell uni-list-cell-pd">
					<view class="uni-list-cell-db">锁定裁剪框比例</view>
					<switch @change="needLockClipBoxRatioChange"/>
				</view>
			</view>
		</view>

		<photo-clip 
			ref="photoClip"
			:imageSrc="src"
			:needLimitImageMoveRange="needLimitImageMoveRange"
			:needLockImageScale="needLockImageScale"
			:needLockClipBoxWidth="needLockClipBoxWidth"
			:needLockClipBoxHeight="needLockClipBoxHeight"
			:needLockClipBoxRatio="needLockClipBoxRatio"
		/>

		<view class="operation-box">
			<view class="btn-group">
				<button @tap="rotate(-90)">左旋90</button>
				<button @tap="rotate(90)">右旋90</button>
				<button @tap="rotate(-10)">左旋10</button>
				<button @tap="rotate(10)">右旋10</button>
				<button @tap="enlarge">放大</button>				
			</view>
			<view class="btn-group">
				<button @tap="moveUp">上</button>
				<button @tap="moveDown">下</button>
				<button @tap="moveLeft">左</button>
				<button @tap="moveRight">右</button>
				<button @tap="narrow">缩小</button>
			</view>
		</view>
	</view>
</template>

<script>
import photoClip from '../../components/photo-clip/photo-cilp'

export default {
	components: {
		photoClip
	},

	data: () => ({
		needLimitImageMoveRange: true,
		needLockImageScale: false,
		needLockClipBoxWidth: false,
		needLockClipBoxHeight: false,
		needLockImageScale: false,
		
		src: 'http://127.0.0.1:8199/program/6badf3df447b272ddf6b2d8bb9e96ba2/devices/baiduboxapp-6badf3df447b272ddf6b2d8bb9e96ba2-0/tmp/156421328568779.jpeg'
	}),

	methods: {
		// switch change event
		needLimitImageMoveRangeChange ({detail: { value }}) {
			this.needLimitImageMoveRange = value
		},

		needLockImageScaleChange ({detail: { value }}) {
			this.needLockImageScale = value
		},

		needLockClipBoxWidthChange ({detail: { value }}) {
			this.needLockClipBoxWidth = value
		},

		needLockClipBoxHeightChange ({detail: { value }}) {
			this.needLockClipBoxHeight = value
		},

		needLockClipBoxRatioChange ({detail: { value }}) {
			this.needLockClipBoxRatio = value
		},

		// translate
		moveUp() {
			this.$refs.photoClip.moveH('up')
		},

		moveDown() {
			this.$refs.photoClip.moveH('down')
		},

		moveLeft() {
			this.$refs.photoClip.moveV('left')
		},

		moveRight() {
			this.$refs.photoClip.moveV('right')
		},

		enlarge() {
			this.$refs.photoClip.scaling('enlarge')
		},

		narrow() {
			this.$refs.photoClip.scaling('narrow')
		},

		rotate(deg) {
			this.$refs.photoClip.rotate(deg)
		}
	}
}
</script>

<style lang="scss">
.operation-box {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 100;
	.btn-group {
		width: 100%;
		display: flex;

		button {
			flex: 1;
			font-size: 27rpx;
			padding: 0 20rpx;
			height: 60rpx;
			min-width: 70rpx;
			margin: 8rpx 4rpx;
		}
	}
}

.switch-box {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: 100;
}

// list
.uni-list {
	position: relative;
	width: 100%;
	display: flex;
	flex-direction: column;
	color: #fff;
	font-size: 28rpx;
	background-color: rgba(0, 0, 0, 0.3);
}
.uni-list:after {
	position: absolute;
	z-index: 10;
	right: 0;
	bottom: 0;
	left: 0;
	height: 1px;
	content: '';
	background-color: #c8c7cc;
}
.uni-list::before {
	position: absolute;
	z-index: 10;
	right: 0;
	top: 0;
	left: 0;
	height: 1px;
	content: '';
	background-color: #c8c7cc;
}
.uni-list-cell {
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}
.uni-list-cell-pd {
	padding: 5upx 20upx;
}
.uni-list-cell-db {
	flex: 1;
}
.uni-list-cell::after {
	position: absolute;
  	z-index: 3;
	right: 0;
	bottom: 0;
	left: 20upx;
	height: 1px;
	content: '';
	background-color: #c8c7cc;
}
.uni-list .uni-list-cell:last-child::after {
	height: 0upx;
}
</style>
