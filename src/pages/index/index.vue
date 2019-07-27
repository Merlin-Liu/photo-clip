<template>
	<view>
		<photo-clip :imageSrc="src"></photo-clip>
	</view>
</template>

<script>
import photoClip from '../../components/photo-clip/photo-cilp'

export default {
	components: {
		photoClip
	},

	data: () => ({
		src: 'http://127.0.0.1:8199/program/6badf3df447b272ddf6b2d8bb9e96ba2/devices/baiduboxapp-6badf3df447b272ddf6b2d8bb9e96ba2-0/tmp/156421328568779.jpeg'
	})
}
</script>