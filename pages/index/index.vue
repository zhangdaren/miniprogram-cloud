<template>
	<!--index.wxml-->
	<view class="container">
		<!-- 用户 openid -->
		<view class="userinfo">
			<button open-type="getPhoneNumber" @getuserinfo="onGetUserInfo" class="userinfo-avatar" :style="'background-image: url(' + avatarUrl + ')'"></button>
			<view><button class="userinfo-nickname" @tap="onGetOpenid">点击获取 openid</button></view>
		</view>

		<!-- 上传图片 -->
		<view class="uploader">
			<view class="uploader-text" @tap="doUpload"><text>上传图片</text></view>
			<view class="uploader-container" v-if="imgUrl"><image class="uploader-image" :src="imgUrl" mode="aspectFit" @tap="previewImg"></image></view>
		</view>

		<!-- 操作数据库 -->
		<view class="uploader">
			<navigator url="../databaseGuide/databaseGuide" open-type="navigate" class="uploader-text"><text>前端操作数据库</text></navigator>
		</view>

		<!-- 新建云函数 -->
		<view class="uploader">
			<navigator url="../addFunction/addFunction" open-type="navigate" class="uploader-text"><text>快速新建云函数</text></navigator>
		</view>

		<!-- 云调用 -->
		<view class="uploader">
			<navigator url="../openapi/openapi" open-type="navigate" class="uploader-text"><text>云调用</text></navigator>
		</view>

		<view v-if="!canIUse && showShouquan" style="height:100vh;width:100vw;opacity:.5;position:absolute;top:0"></view>
		<view v-if="!canIUse && showShouquan" style="color:#333333;position:absolute;top:340rpx;width:70vw;left:9vw;padding:6vw">
			<view style="font-size:42rpx">微信授权</view>
			<view style="font-size:30rpx;font-weight:bold;text-align:center;padding:20rpx;border-bottom:1px solid #e9e9e9">....网络科技申请获取以下权限：</view>
			<view style="font-size:26rpx;text-align:center;margin:30rpx 30rpx 70rpx 30rpx"><text>获得你的公开信息（昵称、头像等）</text></view>
			<view style="font-size:28rpx;float:right;margin-top:10rpx">
				<text
					v-if="!canIUse && showShouquan"
					@tap="hidthis"
					style="color:#999999;margin-left:60rpx;height:60rpx;line-height:60rpx;font-size:30rpx;border:none;position:absolute;top:300rpx;left:300rpx"
				>
					拒绝
				</text>
				<button
					v-if="!canIUse"
					open-type="getUserInfo"
					@getuserinfo="bindGetUserInfo"
					style="color:#31B531;margin-left:60rpx;height:60rpx;line-height:60rpx;font-size:30rpx;border:none;position:absolute;top:300rpx;left:400rpx"
				>
					允许
				</button>
			</view>
			<!-- userInfo:getApp().globalData.userInfo -->
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
	computed: mapState(['openid', 'userInfo']),
	data() {
		return {
			avatarUrl: '../../static/user-unlogin.png',
			logged: false,
			takeSession: false,
			requestResult: '',
			canIUse: wx.canIUse('button.open-type.getUserInfo'),
			showShouquan: true
		};
	},
	onLoad() {
		console.log('--onload, ', this.$store);
		wx.getSetting({
			success: function(res) {
				console.log(res.authSetting['scope.userInfo']);
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称
					wx.getUserInfo({
						success: function(res) {
							console.log(res);
							//getApp().globalData.userInfo = res.userInfo; //将授权信息传递给全局变量
						}
					});
				}
			}
		});
		console.log(wx.cloud);
		if (!wx.cloud) {
			wx.redirectTo({
				url: '../chooseLib/chooseLib'
			});
			return;
		}

		// 获取用户信息
		wx.getSetting({
			success: res => {
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					wx.getUserInfo({
						success: res => {
							this.setData({
								avatarUrl: res.userInfo.avatarUrl
							});
							this.setUserInfo(res.userInfo);
						}
					});
				}
			}
		});
	},
	methods: {
		...mapMutations(['setOpenId', 'setUserInfo', 'setFileID', 'setCloudPath', 'setImagePath']),
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
		onGetUserInfo: function(e) {
			//获取用户授权
			// getApp().globalData.userInfo = e.detail.userInfo; //将授权信息传递给全局变量

			this.setUserInfo(e.detail.userInfo);

			console.log(getApp().globalData.userInfo);

			if (!this.logged && e.detail.userInfo) {
				this.setData({
					logged: true,
					avatarUrl: e.detail.userInfo.avatarUrl
				});
			}
		},

		onGetOpenid: function() {
			// 调用云函数
			wx.cloud.callFunction({
				name: 'login',
				data: {},
				success: res => {
					console.log('[云函数] [login] user openid: ', res.result.openid);
					// app.globalData.openid = res.result.openid;
					this.setOpenId(res.result.openid);
					wx.navigateTo({
						url: '../userConsole/userConsole'
					});
				},
				fail: err => {
					console.error('[云函数] [login] 调用失败', err);
					wx.navigateTo({
						url: '../deployFunctions/deployFunctions'
					});
				}
			});
		},

		// 上传图片
		doUpload: function() {
			// 选择图片
			wx.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: function(res) {
					wx.showLoading({
						title: '上传中'
					});

					const filePath = res.tempFilePaths[0];

					// 上传图片
					const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0];
					wx.cloud.uploadFile({
						cloudPath,
						filePath,
						success: res => {
							console.log('[上传文件] 成功：', res);

							// app.globalData.fileID = res.fileID;
							// app.globalData.cloudPath = cloudPath;
							// app.globalData.imagePath = filePath;

							wx.navigateTo({
								url: '../storageConsole/storageConsole'
							});
						},
						fail: e => {
							console.error('[上传文件] 失败：', e);
							wx.showToast({
								icon: 'none',
								title: '上传失败'
							});
						},
						complete: () => {
							wx.hideLoading();
						}
					});
				},
				fail: e => {
					console.error(e);
				}
			});
		}
	}
};
</script>

<style lang="scss">
/**index.wxss**/

page {
	background: #f6f6f6;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
}

.userinfo,
.uploader,
.tunnel {
	margin-top: 40rpx;
	height: 140rpx;
	width: 100%;
	background: #fff;
	border: 1px solid rgba(0, 0, 0, 0.1);
	border-left: none;
	border-right: none;
	display: flex;
	flex-direction: row;
	align-items: center;
	transition: all 300ms ease;
}

.userinfo-avatar {
	width: 100rpx;
	height: 100rpx;
	margin: 20rpx;
	border-radius: 50%;
	background-size: cover;
	background-color: white;
}

.userinfo-avatar:after {
	border: none;
}

.userinfo-nickname {
	font-size: 32rpx;
	color: #007aff;
	background-color: white;
	background-size: cover;
}

.userinfo-nickname::after {
	border: none;
}

.uploader,
.tunnel {
	height: auto;
	padding: 0 0 0 40rpx;
	flex-direction: column;
	align-items: flex-start;
	box-sizing: border-box;
}

.uploader-text,
.tunnel-text {
	width: 100%;
	line-height: 52px;
	font-size: 34rpx;
	color: #007aff;
}

.uploader-container {
	width: 100%;
	height: 400rpx;
	padding: 20rpx 20rpx 20rpx 0;
	display: flex;
	align-content: center;
	justify-content: center;
	box-sizing: border-box;
	border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.uploader-image {
	width: 100%;
	height: 360rpx;
}

.tunnel {
	padding: 0 0 0 40rpx;
}

.tunnel-text {
	position: relative;
	color: #222;
	display: flex;
	flex-direction: row;
	align-content: center;
	justify-content: space-between;
	box-sizing: border-box;
	border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.tunnel-text:first-child {
	border-top: none;
}

.tunnel-switch {
	position: absolute;
	right: 20rpx;
	top: -2rpx;
}

.disable {
	color: #888;
}

.service {
	position: fixed;
	right: 40rpx;
	bottom: 40rpx;
	width: 140rpx;
	height: 140rpx;
	border-radius: 50%;
	background: linear-gradient(#007aff, #0063ce);
	box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
	display: flex;
	align-content: center;
	justify-content: center;
	transition: all 300ms ease;
}

.service-button {
	position: absolute;
	top: 40rpx;
}

.service:active {
	box-shadow: none;
}

.request-text {
	padding: 20rpx 0;
	font-size: 24rpx;
	line-height: 36rpx;
	word-break: break-all;
}
</style>
