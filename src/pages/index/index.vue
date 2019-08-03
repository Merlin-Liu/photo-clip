<template>
	<view>
		<uni-collapse class="switch-box" v-if="showCliper">
			<uni-collapse-item title="限制裁剪操作">
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
						<view class="uni-list-cell-db">禁止图片旋转</view>
						<switch @change="needLockImageRotateChange"/>
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
			</uni-collapse-item>
		</uni-collapse>

		<photo-clip 
			ref="photoClip"
			:show="showCliper"
			:imageSrc="imageSrc"
			:needLimitImageMoveRange="needLimitImageMoveRange"
			:needLockImageScale="needLockImageScale"
			:needLockImageRotate="needLockImageRotate"
			:needLockClipBoxWidth="needLockClipBoxWidth"
			:needLockClipBoxHeight="needLockClipBoxHeight"
			:needLockClipBoxRatio="needLockClipBoxRatio"
			@completed="cliperLoadComplet"
		/>

		<view class="upload-box" v-if="!showCliper">
			<p>💯</p>
			<p>小程序图片裁剪组件</p>
			<p>目前支持微信和百度小程序</p>
			<p>上传图片查看功能</p>
			<button type="primary" @tap="uploadImage">点击上传图片</button>
		</view>

		<view class="operation-box" v-if="showCliper">
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
			<button @tap="back">返回</button>
		</view>
	</view>
</template>

<script>
import { uniCollapse, uniCollapseItem } from '@dcloudio/uni-ui'
import photoClip from '../../components/photo-clip/photo-cilp'

export default {
	components: {
		photoClip,
		uniCollapse,
		uniCollapseItem
	},

	data: () => ({
		imageSrc: '',
		needLimitImageMoveRange: true,
		needLockImageScale: false,
		needLockImageRotate: false,
		needLockClipBoxWidth: false,
		needLockClipBoxHeight: false,
		needLockClipBoxRatio: false,
		
		showCliper: false
	}),

	methods: {
		uploadImage() {
			uni.chooseImage({
				count: 1,
				success: res => {
					uni.showLoading({title: 'loading'})
					const result = res.tempFilePaths[0]
					// 微信
					if (typeof result === 'string') {
						this.imageSrc = result
					}
					// 百度
					else {
						this.imageSrc = result.path
					}
				}
			})
		},

		cliperLoadComplet() {
			setTimeout(() => {
				this.showCliper = true
				uni.hideLoading()
			}, 1000)
		},

		back() {
			this.imageSrc = ''
			this.showCliper = false
		},

		// switch change event
		needLimitImageMoveRangeChange ({detail: { value }}) {
			this.needLimitImageMoveRange = value
		},

		needLockImageScaleChange ({detail: { value }}) {
			this.needLockImageScale = value
		},

		needLockImageRotateChange ({detail: { value }}) {
			this.needLockImageRotate = value
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
.upload-box {
	margin: 80px 10px;
	text-align: center;
}

.operation-box {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 100;
	-webkit-transform: translateZ(0);
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
	> button {
		font-size: 27rpx;
		padding: 0 20rpx;
		height: 60rpx;
		min-width: 70rpx;
		margin: 8rpx 4rpx;
		margin-top: 0;
	}
}

.switch-box {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 100;

	.uni-collapse {
		background-color: rgba(0, 0, 0, 0);
		color: #fff;
		.uni-collapse-cell__content, .uni-collapse-cell--open, .uni-collapse-cell--hover {
			background-color: rgba(0, 0, 0, 0);
		}
	}
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
