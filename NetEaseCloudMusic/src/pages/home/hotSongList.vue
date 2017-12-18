<template lang="pug">
	div#hotSongList
		
		header.headline
			div.icon-head
			label.updata-head 更新日期：12月7日

		section.songList
			div.modal(v-bind:class="{hide : listShow }")
				mt-spinner.middle-main( type="triple-bounce")
			div.cell-songs(v-for="(item, index) in songList" v-bind:class="{hide : !listShow }")
					div.index-songs.red-index( v-if="index < 3" v-on:click='turnDetail(item.id)') {{index+1}}
					div.index-songs(v-else v-on:click='turnDetail(item.id)') {{index+1}}
					div.info-songs(v-on:click='turnDetail(item.id)')
						div.des-song
							label.name-song {{item.name}}
							span.title-song {{item.singerDes}}
						div.play-song
			div.cell-songs(v-bind:class="{hide : !listShow }") 查看完整榜单 >

</template>

<script>
import  { getFormatDate  } from '../../assets/js/time'
export default {
	name: 'hotSongList',
	data () {
		return {
			songList: [],//歌曲列表
			listShow: false,
			listId: ''
		}
	},
	created() {
		this.getHotMusicListId();
	},
	methods: {
		/**@augments
		 * 获取热歌榜id
		 */
		getHotMusicListId() {
			let that = this;
			var id = this.$route.params.id;
			this.$http.get('http://127.0.0.1:4000/top/list', {
				params: {
					idx: 1
				}
			})
			.then(function (response) {
				console.log(response.data.result)
				let id = response.data.result.id;
				if (id != null && id != '') {
					that.listId = id;
					that.getRemdMusic();
				}
				
			})
			.catch(function (error) {
				console.log(JSON.stringify(error));
			});
		},
		/**@augments
		 * 获取歌单歌曲列表
		 */
		getRemdMusic() {
			let that = this;
			let id = that.listId;
			this.$http.get('http://127.0.0.1:4000/playlist/detail', {
				params: {
					id: id
				}
			})
			.then(function (response) {
				console.log(response.data)
				let songsList = response.data.playlist.tracks,
					len = songsList.length > 20 ? 20 : songsList.length;
				
				for (let i = 0; i < len; i++) {
					let songs = {};
					songs.id = songsList[i].id;
					songs.name = songsList[i].name;
					songs.singerDes = songsList[i].ar[0].name + ' - ' + songsList[i].al.name;
					that.songList.push(songs);
				}

				that.listShow = true;
			})
			.catch(function (error) {
				console.log(JSON.stringify(error) + '11111');
			});
		},
		/**@augments
		 *  跳转音乐播放页
		 */
		turnDetail(id) {
			this.$router.push({ name: 'playMusic', params: { id: id }})
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#hotSongList {
	position: relative;
	padding-top: 3px;
	width: 100vw;
	height: auto;

	.songList {
		position: relative;
		min-height: 60vmin;

		.modal {
			position: absolute;;
			top: 0px;
			left: 0px;
			right: 0px;
			bottom: 0px;
			z-index: 10;
			opacity: 0.5;

			.middle-main {
				position: absolute;
				top: 50%;
				left: 50%;
				-webkit-transform: translateX(-50%) translateY(-50%);
				transform: translateX(-50%) translateY(-50%);
			}
		}
	}

	
}

.red-index {
    color: #df3436 !important;
}

.headline {
	position: relative;
	display: flex;
	display: -webkit-flex;
	justify-content: center;
	align-items: left;
	flex-direction: column;
	text-align: left;
	height: 146px;
	padding-left: 20px;
	overflow: hidden;
    background: url(../../assets/img/hotMusic.jpg) no-repeat;
    background-size: 100% 100%;

	.icon-head {
		z-index: 2;
		width: 142px;
    	height: 67px;
		background: url(../../assets/img/indexIcon.png) no-repeat;
		background-position: -24px -30px;
    	background-size: 166px 97px;
	}

	.updata-head {
		z-index: 2;
		padding-top: 10px;
		color: rgba(255,255,255,.8);
		font-size: 12px;
		-webkit-transform: scale(.91);
    	transform: scale(.91);
		-webkit-transform-origin: left top;
    	transform-origin: left top;
	}

	&:after {
		content: " ";
		background-color: rgba(0,0,0,.2);
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 1;
	}
}

.cell-songs {
		background-color: #F8F8F8;
		display: -webkit-box;
		display: flex;
		align-items: center;
		justify-content: center;

		&:last-child {
			height: 60px;
			color: #999;
		}

		.index-songs {
			flex: 1 1 auto;
			text-align: center;
			max-width: 40px;
			font-size: 17px;
			color: #999;
		}

		.info-songs {
			-webkit-box-flex: 1;
			flex: 1 1 auto;
			position: relative;
			display: -webkit-box;
			display: flex;
			text-align: left;
			border-bottom: 1px solid rgba(221,221,221,.5);

			

			.des-song {
				-webkit-box-flex: 1;
				flex: 1 1 auto;
				padding: 6px 0;
				line-height: 1.5;
				

				.name-song {
					display: block;	
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					word-break: normal;
					color: #333;
					font-size: 17px;
					font-family: 'Microsoft YaHei';
				}

				.title-song {
					display: block;	
					font-size: 12px;
					color: #888;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					word-break: normal;
				}
			}

			.play-song {
				position: absolute;
				top: 15px;
				right: 0;
				-webkit-box-align: center;
				align-items: center;
				padding: 0 10px;
				width: 25px;
				height: 25px;
				border: none;
				border-radius: none;
				outline: none;
				background-color: none;
				background-position-x: 10px;
				background-image: url(../../assets/img/play.svg);
				background-repeat: no-repeat;
				background-size: 25px 25px;
				 
			}


		}
	}
</style>
