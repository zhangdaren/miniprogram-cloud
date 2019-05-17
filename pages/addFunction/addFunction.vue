<template>
	<!--pages/addFunction/addFunction.wxml-->
	<view class="container">
		<view class="list">
			<view class="list-item" @tap="testFunction"><text>测试云函数</text></view>
			<view class="list-item"><text class="request-text">期望输出：{"sum":3}</text></view>
			<view class="list-item" v-if="result">
				<text class="request-text">调用结果：{{ result }}</text>
			</view>
		</view>

		<view class="guide">
			<text class="headline">新增云函数</text>
			<text class="p">1. 在云函数根目录 cloudfunctions 上右键选择新建云函数，命名为 sum</text>
			<text class="p">2. 在创建的 cloudfunctions/sum/index.js 文件中添加如下代码</text>
			<image class="image1" src="../../static/code-func-sum.png" mode="aspectFit"></image>
			<button class="copyBtn" v-if="canIUseClipboard" @tap="copyCode">复制代码</button>
			<text class="p">3. 在 cloudfunctions/sum 目录上右键上传并部署</text>
			<text class="p">4. 点击测试云函数测试</text>
			<text class="p">5. 打开云开发云函数管理页，选择 sum 云函数</text>
			<text class="p">6. 查看 sum 的调用日志</text>
			<text class="p">进阶：可在云函数中使用 wx-server-sdk 操作数据库，文件存储和调用其他云函数，详见文档</text>
		</view>
	</view>
</template>
<script>
const code = `// 云函数入口函数
exports.main = (event, context) => {
  console.log(event)
  console.log(context)
  return {
    sum: event.a + event.b
  }
}`;

import { mapState, mapMutations } from 'vuex';

export default {
	computed: mapState(['openid', 'userInfo']),
	data() {
		return {
			result: '',
			canIUseClipboard: wx.canIUse('setClipboardData')
		};
	},
	onLoad: function(options) {
		console.log("addfunct");
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
		copyCode: function() {
			wx.setClipboardData({
				data: code,
				success: function() {
					wx.showToast({
						title: '复制成功'
					});
				}
			});
		},
		testFunction() {
			wx.cloud.callFunction({
				name: 'sum',
				data: {
					a: 1,
					b: 2
				},
				success: res => {
					wx.showToast({
						title: '调用成功'
					});
					this.setData({
						result: JSON.stringify(res.result)
					});
				},
				fail: err => {
					wx.showToast({
						icon: 'none',
						title: '调用失败'
					});
					console.error('[云函数] [sum] 调用失败：', err);
				}
			});
		}
	}
};
</script>

<style>
@import '../../style/guide.wxss';
</style>
