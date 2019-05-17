<!--pages/storageConsole/storageConsole.wxml-->
<template>
	<view class="container">
		<view class="list">
			<view class="list-item" @tap="testCgi"><text class="black">上传成功</text></view>
			<view class="list-item">
				<text class="request-text">文件 ID：{{ fileID }}</text>
			</view>
			<view class="list-item">
				<text class="request-text">云文件路径：{{ cloudPath }}</text>
			</view>
			<view class="list-item"><image class="image1" :src="imagePath" mode="aspectFit"></image></view>
		</view>

		<view class="guide">
			<!-- <image class="image1" src="{{imagePath}}" mode="aspectFit"></image> -->
			<text class="headline">云开发控制台中管理文件</text>
			<text class="p">1. 打开云开发控制台</text>
			<image class="image1" src="../../static/console-entrance.png" mode="aspectFit"></image>
			<text class="p">2. 切换到文件管理标签页</text>
			<text class="p">3. 可查看文件列表、管理权限</text>
			<text class="p">4. 详细的教程和 API 文件，可点击调试器中打印的链接查看</text>
		</view>
	</view>
</template>
<script>
import { mapState } from 'vuex';

export default {
	computed: mapState(['openid']),
	data() {
		return { fileID: '', cloudPath: '', imagePath: '' };
	},
	onLoad: function(options) {
// 		const { fileID, cloudPath, imagePath } = app.globalData;
// 
// 		this.setData({
// 			fileID,
// 			cloudPath,
// 			imagePath
// 		});

		console.group('文件存储文档');
		console.log('https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/storage.html');
		console.groupEnd();
	},
	methods: {
		setData: function(obj) {
			let that = this;
			let keys = [];
			let val, data;
			Object.keys(obj).forEach(function(key) {
				keys = key.split('.');
				val = obj[key];
				data = that.$data;
				keys.forEach(function(key2, index) {
					if (index + 1 == keys.length) {
						that.$set(data, key2, val);
					} else {
						if (!data[key2]) {
							that.$set(data, key2, {});
						}
					}
					data = data[key2];
				});
			});
		}
	}
};
</script>
<style>
/* pages/storageConsole/storageConsole.wxss */

@import '../../style/guide.wxss';

.black {
	color: black;
}
</style>
