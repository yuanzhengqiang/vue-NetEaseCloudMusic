<template lang="pug">
  div(id="home")
    mt-header.header
        router-link.re-link(to="/" slot="left")
            button.head-name(icon="back")
                img.icon(src="../../assets/img/music.svg")
                span 仿网易云音乐
        mt-button.dl-btn( slot="right" v-on:click="downloadAPP") 下载APP
    mt-navbar.navbar(v-model="active")
        mt-tab-item.nav-tab(id="1") 推荐音乐
        mt-tab-item.nav-tab(id="2") 热歌榜
        mt-tab-item.nav-tab(id="3") 搜索
    mt-tab-container.main-content(v-model="active")
        mt-tab-container-item(id="1")
            recommendingMusic
        mt-tab-container-item(id="2")
            hotSongList
        mt-tab-container-item(id="3")
            sreach
</template>

<script>
import Vue from "vue";
import {
  Navbar,
  TabItem,
  Button,
  Header,
  Toast,
  TabContainer,
  TabContainerItem
} from "mint-ui";
import recommendingMusic from "@/pages/home/recommendingMusic";
import hotSongList from "@/pages/home/hotSongList";
import sreach from "@/pages/home/sreach";

Vue.component(Header.name, Header);
Vue.component(Button.name, Button);
Vue.component(Navbar.name, Navbar);
Vue.component(TabItem.name, TabItem);
Vue.component(Toast .name, Toast );
Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);
Vue.component("recommendingMusic", recommendingMusic);
Vue.component("hotSongList", hotSongList);
Vue.component("sreach", sreach);

export default {
	name: "home",
	data() {
		return {
		active: "1"
		};
	},
  methods: {
		downloadAPP() {
			Toast({
				message: '未完成',
				position: 'middle',
				duration: 3000
			});
		}
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#home{
	position: relative;
}

.header {
	$size : 30px;//变量

	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 1000;
	height: ($size * 2);

	.re-link {
		display: inline-block;
		height: 100%;
		.head-name {
			position: relative;
			line-height: $size;
			background-color: transparent;
			border: none;
			outline: none;
			color: #fff;

			.icon {
				position: absolute;
        		top: 50%;
        		transform: translateY(-50%);
				width: $size;
				height: $size;
			}
			span {
				position: relative;
				top: 2px;
				left: ($size+2);
				display: inline-block;
				font-family: STSong;
				font-size: ($size * .8);
			}
		}
	}
	.dl-btn{
		width: 80px;
		height: 30px;
		border: 1px solid #FFF;
		border-radius: 40px;
		color: #FFF;
		font-size: 15px;
	}
}

.navbar{
	position: fixed;
	top: 60px;
	left: 0;
	right: 0;
	z-index: 1000;
	margin-bottom: 3px;
	.nav-tab {
		padding: 12px 0;
	}
}

.main-content{
	position: absolute;
	top: 100px;
	left: 0;
	right: 0;
	height: auto;
}

</style>