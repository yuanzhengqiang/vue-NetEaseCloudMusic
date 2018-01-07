<template lang="pug">
	div#recommendingMusic
		h2.headline 推荐歌单
		div.content
			mt-spinner.middle( type="triple-bounce" v-show="playListShow === false")
			ul.ul-box(v-show="playListShow === true")
				li.li-box(v-for="item in playList")
					//- router-link.no-decoration( :to="{name: 'playListDetail', params: { id: item.id, name: item.name, picUrl: item.picUrl, playCount: item.playCount }}")
					span.no-decoration(v-on:click='turnListDetail(item)')
						img.img-box(v-bind:src="item.picUrl")
						p.p-box {{item.name}}
						span.span-box {{item.playCount | formatCount}}

		h2.headline 最新音乐
		div.content
			mt-spinner.middle( type="triple-bounce" v-show="songListShow === false")
			section.cell-box( v-show="songListShow === true")
				div.cell-songs( v-for="item in songList")
					div.info-songs(v-on:click='turnDetail(item.id)')
						div.des-song
							label.name-song {{item.name}}
							span.title-song {{item.artistName}}
						div.play-song

</template>

<script>
import Vue from 'vue';
import { Cell, Spinner  } from 'mint-ui';

Vue.component(Cell.name, Cell);
Vue.component(Spinner.name, Spinner);
export default {
	name: 'recommendingMusic',
	data () {
		return {
			defaultPic: '../../assets/img/noPhoto.jpg',
			playListShow: false,
			songListShow: false,
			playList: [],
			songList: []
		}
	},
	created() {
		this.getRemdMusic();
		this.getNewSong();
	},
	methods: {
		/**@augments
		 * 获取歌单列表
		 */
		getRemdMusic() {
			let that = this;
			this.$http.get('http://127.0.0.1:4000/personalized')
			.then(function (response) {
				let result = response.data.result;

				for (let i = 0; i < result.length; i++) {
					let play = {};
					play.id = result[i].id;
					play.name = result[i].name;
					play.picUrl = result[i].picUrl;
					play.playCount = result[i].playCount;
					that.playList.push(play);
				}
				
				that.playListShow = true;
			})
			.catch(function (error) {
				console.log(JSON.stringify(error));
			});
		},
		/**@augments
		 * 获取最新音乐
		 */
		getNewSong() {
			let that = this;
			this.$http.get('http://127.0.0.1:4000/personalized/newsong')
			.then(function (response) {
				let result = response.data.result;
				
				for (let i = 0; i < result.length; i++) {
					let songs = {};
					songs.id = result[i].song.id;
					songs.name = result[i].song.name;
					songs.artistName = that.getArtistsName(result[i].song.artists) + ' - ' + result[i].song.album.name;
					songs.picUrl = result[i].song.album.picUrl;
					that.songList.push(songs);
				}
				that.songListShow = true;
			})
			.catch(function (error) {
				console.log(JSON.stringify(error));
			});
		},
		/**@augments
		 * 合并歌手名
		 */
		getArtistsName(artists) {
			let name = '';
			for (let i = 0; i < artists.length; i++) {
				name += artists[i].name + ' / '
			}
			
			if (name != '') {
				name = name.substr(0, name.length-1);
			}
			return name;
		},
		/**@augments
		 *  跳转音乐播放页
		 */
		turnDetail(id) {
			this.$router.push({ name: 'playMusic', params: { id: id }})
		},
		/**@augments
		 * 跳转歌单详情页
		 */
		turnListDetail(item) {
			this.$router.push({ name: 'playListDetail', params: {  id: item.id, name: item.name, picUrl: item.picUrl, playCount: item.playCount }})
		}
	},
	filters: {
		formatCount (num) {
			if (num < 100000) {
				if (num == 0) {
					return '';
				}
				return num.toFixed(0);
			} else {
				let nums = (num / 10000).toFixed(1),
					numArr = nums.split('.');
				num = numArr[1] == "0" ?  numArr[0] : nums;

				return num + '万';
			}
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#recommendingMusic {
	margin: 0;
	padding-top: 20px;
	font-weight: normal;
}

.content {
	position: relative;
	min-height: 60vmin;

	.middle {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translateX(-50%) translateY(-50%);
	}
}

.headline {
	position: relative;
	padding-left: 9px;
	margin:  0  0 20px;
	text-align: left;
	font-size: 17px;
	height: 20px;
	line-height: 20px;
	font-family: Helvetica, sans-serif;
	font-weight: 500;

	&:after { //红色竖杠
		content: " ";
		position: absolute;
		left: 0;
		top: 50%;
		margin-top: -9px;
		width: 2px;
		height: 16px;
		background-color: #d33a31;
	}
}

.show {
	display: flex;
	display: -webkit-flex;
}


.ul-box {
	margin: 0;
	padding: 0;
	display: flex;
	display: -webkit-flex;
	justify-content: space-between;
	align-items: center;
	flex-flow: row wrap;
	width: 100%;
	height: auto;

	.li-box {
		position: relative;
		margin-bottom: 15px;
		width: 33%;
		height: auto;
		list-style-type: none;

		.img-box{
			width: 100%;
		}

		.p-box{
			margin: 0;
			padding: 3px 2px 0 6px;
			text-align: left;
			height: 30.4px;
			font-size: 13px;
			line-height: 1.2;

			//第二行溢出隐藏
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}

		.span-box{
			position: absolute;
			top: 2px;
			right: 5px;
			z-index: 3;
			padding-left: 14px;
			text-align: left;
			min-width: 20px;
			height: 15px;
			font-size: 12px;
			color: #FFF;
			overflow : hidden;
	
			background-image: url(../../assets/img/headset.svg);
			background-position: 0 bottom;
    		background-repeat: no-repeat;
			background-size: 14px 14px;
		}
		
		&:after { // 黑色阴影
			content: " ";
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 20px;
			z-index: 2;
			background-image: linear-gradient(180deg,rgba(0,0,0,.35),transparent);
		}

	}
}

.cell-songs {
		display: -webkit-box;
		display: flex;
		align-items: center;
		justify-content: center;

		.info-songs {
			-webkit-box-flex: 1;
			flex: 1 1 auto;
			position: relative;
			display: -webkit-box;
			display: flex;
			margin-left: 10px;
			text-align: left;
			border-bottom: 1px solid rgba(0,0,0,.2);

			.des-song {
				-webkit-box-flex: 1;
				flex: 1 1 auto;
				padding: 6px 0;
				line-height: 1.5;
				width: 0;

				.name-song {
					display: block;	
					overflow: hidden;
					height: 25.5px;
					text-overflow: ellipsis;
					white-space: nowrap;
					word-break: normal;
					color: #333;
					font-size: 17px;
					font-family: 'Microsoft YaHei';
				}

				.title-song {
					display: block;	
					height: 18px;
					font-size: 12px;
					color: #888;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					word-break: normal;
				}
			}

			.play-song {
				display: -webkit-box;
				display: flex;
				-webkit-box-align: center;
				align-items: center;
				padding: 0 10px;
				width: 25px;
				background-position-x: 10px;
				background-position-y: 15px;
				background-image: url(../../assets/img/play.svg);
				background-repeat: no-repeat;
				background-size: 25px 25px;
				 
			}
		}
	}

.no-decoration{
	text-decoration: none;
	color: #000;
}


</style>
