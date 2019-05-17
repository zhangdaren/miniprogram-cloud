<template>
	<!--pages/deployFunctions/deployFunctions.wxml-->
	<view class="container">
		<view class="list">
			<view class="list-item"><text class="black">调用失败</text></view>
			<view class="list-item"><text class="request-text">请检查 login 云函数是否已部署</text></view>
		</view>

		<view class="guide">
			<text class="headline">部署 login 云函数</text>
			<text class="p">1. 确保已通过工具栏云开发入口开通云开发</text>
			<text class="p">2. 在 cloudfunctions/login 目录上右键上传并部署</text>
			<text class="p">3. 回到首页，重新点击获取 openid</text>
		</view>
	</view>
</template>
<script>
// pages/deployFunctions/deployFunctions.js

import { mapState } from 'vuex';

export default {
	computed: mapState(['openid']),
	data() {
		return {};
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		console.log(this.openid);
	},
	methods: {},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {}
};
</script>
<style>
@import '../../style/guide.wxss';

.black {
	color: black;
}
</style>
