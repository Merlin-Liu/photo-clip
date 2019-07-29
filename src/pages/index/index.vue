<template>
	<view>
		<photo-clip ref="photoClip" :imageSrc="src" :needLimitImageMoveRange="limitMove"></photo-clip>
		<view class="operation-box">
			<view class="switch-group">
				<text>限制移动</text><switch checked @change="limitMoveChange"/>
			</view>
			<view class="btn-group">
				<button @tap="moveUp">上</button>
				<button @tap="moveDown">下</button>
				<button @tap="moveLeft">左</button>
				<button @tap="moveRight">右</button>
				<button @tap="enlarge">放大</button>
				<button @tap="narrow">缩小</button>
				<button @tap="rotate">旋转</button>
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
		limitMove: true,
		src: 'http://127.0.0.1:8199/program/6badf3df447b272ddf6b2d8bb9e96ba2/devices/baiduboxapp-6badf3df447b272ddf6b2d8bb9e96ba2-0/tmp/156421328568779.jpeg'
	}),

	methods: {
		limitMoveChange ({detail: { value }}) {
			this.limitMove = value
		},

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

		rotate() {
			this.$refs.photoClip.rotate()
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

	.switch-group {
		display: flex;
		align-items: center;
		height: 60rpx;
		font-size: 27rpx;
		color: #fff;
		line-height: 60rpx;
	}

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
</style>
