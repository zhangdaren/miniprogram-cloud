<template>
	<!--pages/chooseLib/chooseLib.wxml-->
<view class="container">

  <view class="list">
    <view class="list-item">
      <text class="black">初始化失败</text>
    </view>
    <view class="list-item">
      <text class="request-text">请使用 2.2.3 或以上的基础库以使用云能力</text>
    </view>
  </view>

</view>
</template>
<script>

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
	@import "../../style/guide.wxss";
	
	.black {
	  color: black;
	}
</style>