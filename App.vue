<script>
export default {
	onLaunch: function() {
		console.log('App Launch');
		if (!wx.cloud) {
			console.error('请使用 2.2.3 或以上的基础库以使用云能力');
		} else {
			wx.cloud.init({
				traceUser: true
			});
		}
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style>
/*每个页面公共css */
/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
@import './common/uni.css';

.flexBox {
	display: flex;
}

.flex-center {
	align-items: center;
	justify-content: center;
}

.flexItem {
	flex: 1;
}

.uni-input {
	border: 1upx solid #ccc;
}
</style>
