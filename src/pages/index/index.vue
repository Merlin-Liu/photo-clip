<template>
	<view>
		<photo-clip :imageSrc="src"></photo-clip>
		<!-- <image class="photo-cliper-image" src="http://127.0.0.1:8199/program/50b245db2f071773e86d8a0d1147a119/devices/baiduboxapp-50b245db2f071773e86d8a0d1147a119-0/tmp/1564045149460832.jpg" mode="aspectFill"></image> -->
	</view>
</template>

<script>
import photoClip from '../../components/photo-clip/photo-cilp'

export default {
	components: {
		photoClip
	},

	data: () => ({
		src: 'http://127.0.0.1:8199/program/50b245db2f071773e86d8a0d1147a119/devices/baiduboxapp-50b245db2f071773e86d8a0d1147a119-0/tmp/1564045149460832.jpg'
	})
}
</script>