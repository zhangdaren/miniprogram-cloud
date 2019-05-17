<template>
	<view class="container">
		<form class="list" @submit="submitTemplateMessageForm" report-submit>
			<button class="list-item" form-type="submit"><text>发送模板消息</text></button>
			<view class="list-item" v-if="templateMessageResult">
				<text class="request-text">调用结果：{{ templateMessageResult }}</text>
			</view>
		</form>

		<view class="guide">
			<text class="headline">测试须知</text>
			<text class="p">1. 需在手机上预览测试，工具中无效</text>
			<text class="p">2. 需上传 cloudfunctions 目录下的 openapi 云函数</text>
			<text class="p">3. 调用成功后返回到微信主界面查看收到的模板消息</text>
		</view>

		<view class="list">
			<view class="list-item" @tap="onGetWXACode"><text>获取小程序码</text></view>
			<view class="list-item" v-if="wxacodeResult">
				<text class="request-text">{{ wxacodeResult }}</text>
				<text class="request-text" v-if="showClearWXACodeCache" @tap="clearWXACodeCache">清除缓存</text>
			</view>
		</view>

		<view class="guide">
			<text class="headline">测试须知</text>
			<text class="p">1. 需上传 cloudfunctions 目录下的 openapi 云函数</text>
			<text class="p">2. 云函数中获取图片后会上传至存储空间并返回至小程序使用和缓存</text>
			<text class="p">3. 云存储需设置为公有读</text>
		</view>

		<view class="guide"><image :src="wxacodeSrc" mode="aspectFit"></image></view>
	</view>
</template>
<script>
Page({
	data: {
		templateMessageResult: '',
		wxacodeSrc: '',
		wxacodeResult: '',
		showClearWXACodeCache: false
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
		},
		submitTemplateMessageForm(e) {
			this.setData({
				templateMessageResult: ''
			});

			wx.cloud.callFunction({
				name: 'openapi',
				data: {
					action: 'sendTemplateMessage',
					formId: e.detail.formId
				},
				success: res => {
					console.warn('[云函数] [openapi] templateMessage.send 调用成功：', res);
					wx.showModal({
						title: '发送成功',
						content: '请返回微信主界面查看',
						showCancel: false
					});
					wx.showToast({
						title: '发送成功，请返回微信主界面查看'
					});
					this.setData({
						templateMessageResult: JSON.stringify(res.result)
					});
				},
				fail: err => {
					wx.showToast({
						icon: 'none',
						title: '调用失败'
					});
					console.error('[云函数] [openapi] templateMessage.send 调用失败：', err);
				}
			});
		},

		onGetWXACode() {
			this.setData({
				wxacodeSrc: '',
				wxacodeResult: '',
				showClearWXACodeCache: false
			});

			// 此处为演示，将使用 localStorage 缓存，正常开发中文件 ID 应存在数据库中
			const fileID = wx.getStorageSync('wxacodeCloudID');

			if (fileID) {
				// 有云文件 ID 缓存，直接使用该 ID
				// 如需清除缓存，选择菜单栏中的 “工具 -> 清除缓存 -> 清除数据缓存”，或在 Storage 面板中删掉相应的 key
				this.setData({
					wxacodeSrc: fileID,
					wxacodeResult: `从本地缓存中取得了小程序码的云文件 ID`,
					showClearWXACodeCache: true
				});
				console.log(`从本地缓存中取得了小程序码的云文件 ID：${fileID}`);
			} else {
				wx.cloud.callFunction({
					name: 'openapi',
					data: {
						action: 'getWXACode'
					},
					success: res => {
						console.warn('[云函数] [openapi] wxacode.get 调用成功：', res);
						wx.showToast({
							title: '调用成功'
						});
						this.setData({
							wxacodeSrc: res.result,
							wxacodeResult: `云函数获取二维码成功`,
							showClearWXACodeCache: true
						});
						wx.setStorageSync('wxacodeCloudID', res.result);
					},
					fail: err => {
						wx.showToast({
							icon: 'none',
							title: '调用失败'
						});
						console.error('[云函数] [openapi] wxacode.get 调用失败：', err);
					}
				});
			}
		},

		clearWXACodeCache() {
			wx.removeStorageSync('wxacodeCloudID');

			this.setData({
				wxacodeSrc: '',
				wxacodeResult: '',
				showClearWXACodeCache: false
			});

			wx.showToast({
				title: '清除成功'
			});
		}
	}
});
</script>
<style>
@import '../../style/guide.wxss';

.black {
	color: black;
}
</style>
