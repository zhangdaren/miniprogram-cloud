import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		openid: "xxxxx",
		userInfo: {},
		fileID: "",
		cloudPath: "",
		imagePath: "",
	},
	mutations: {
		getOpenId(state) {
			return openid;
		},
		setOpenId(state, openid) {
			state.openid = openid;
		},
		setUserInfo(state, userInfo) {
			state.userInfo = userInfo;
		},
		setFileID(state, fileID) {
			state.fileID = fileID;
		},
		setCloudPath(state, cloudPath) {
			state.cloudPath = cloudPath;
		},
		setImagePath(state, imagePath) {
			state.imagePath = imagePath;
		},
	}
})

export default store
