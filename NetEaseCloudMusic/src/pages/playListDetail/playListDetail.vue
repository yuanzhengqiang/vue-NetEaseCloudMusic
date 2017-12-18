<template lang="pug">
	div#playListDetail(v-bind:class="{hide: !listShow }")
		div.modal(v-bind:class="{hide : listShow }")
			mt-spinner.middle-main( type="triple-bounce")
		section.head
			div.bg-head(v-bind:style="{backgroundImage: playListDes.backgroundImageUrl}")
			div.lt-head
				img.img-head(v-bind:src="playListDes.headUrl")
				span.playCount {{playListDes.playCount | formatCount}}
				span.icon-head 歌单
			div.rt-head
				h2.name-head {{playListDes.playListName}}
				div.creator-head
					img.img-creator(v-bind:src="playListDes.singerUrl")
					span {{playListDes.singer}}

		section.details
			div.tag-des
				label 标签：
				span.tags(v-for= "tag in playListDes.tags ") {{tag}}
			div.intro-des
				p.intro(v-bind:class="{ 'show-3line': openFold}") {{playListDes.description}}
				span.fold(v-bind:class="{ 'open-fold': openFold, 'close-fold': closeFold }" v-on:click="changeVariable()")
		
		div.main
			h3 歌曲列表
			section
				div.cell-songs( v-for="(item, index) in songList")
					div.index-songs {{index+1}}
					div.info-songs(v-on:click='turnDetail(item.id)')
						div.des-song
							label.name-song {{item.name}}
							span.title-song {{item.singerDes}}
						div.play-song

			h3(v-bind:class="{hide: hotCommentShow }") 精彩评论
			section(v-bind:class="{hide: hotCommentShow }")
				div.cell-comment( v-for="item in hotComments")
					div.head-comment 
						img.img-head-comment(v-bind:src="item.userUrl")
					div.user-info
						div.user-info-comment
							div.user-head-comment
								label.name-comment {{item.name}}
								span.title-comment {{item.time | getFormatTime}}
							div.like-comment 
								label.like-count {{item.likeCount | formatCount}}
								span.like-icon
						div.content-comment {{item.comment}}

			h3(v-bind:class="{hide: commentShow }") 最新评论 {{newCommentsNum}}
			section(v-bind:class="{hide: commentShow }")
				div.cell-comment( v-for="item in newComments")
					div.head-comment 
						img.img-head-comment(v-bind:src="item.userUrl")
					div.user-info
						div.user-info-comment
							div.user-head-comment
								label.name-comment {{item.name}}
								span.title-comment {{item.time | getFormatTime}}
							div.like-comment 
								label.like-count {{item.likeCount | formatCount}}
								span.like-icon
						div.content-comment {{item.comment}}
</template>

<script>
import Vue from 'vue';
import { Cell, Spinner  } from 'mint-ui';
import  { getFormatDate  } from '../../assets/js/time'

Vue.component(Cell.name, Cell);
Vue.component(Spinner.name, Spinner);
export default {
	name: "playListDetail",
	data() {
		return {
			msg: "歌单详情",
			playListDes: {},//歌单信息
			songList: [],//歌曲列表
			hotComments: [],//精彩评论
			newComments: [],//最新评论
			newCommentsNum: '',
			openFold: true,
			closeFold: false,
			hotCommentShow: false,
			commentShow: false,
			listShow: false
		};
	},
	created() {
		this.getRemdMusic();
	},
	methods: {
		/**
		 * 获取歌单歌曲列表
		 */
		getRemdMusic() {
			let that = this;
			var id = this.$route.params.id;
			this.$http.get('http://127.0.0.1:4000/playlist/detail', {
				params: {
					id: id
				}
			})
			.then(function (response) {
				let result = response.data.playlist;
				console.log(result)
				that.playListDes.playListName = result.name;
				that.playListDes.description = '简介：' + result.description;
				that.playListDes.playCount = result.playCount;
				that.playListDes.tags = result.tags;
				that.playListDes.singer = result.creator.nickname;
				that.playListDes.headUrl = result.coverImgUrl;
				that.playListDes.singerUrl = result.creator.avatarUrl;
				that.playListDes.backgroundImageUrl = 'url('+result.coverImgUrl+')';

				let songsList =  result.tracks;
				for (let i = 0; i < songsList.length; i++) {
					let songs = {};
					songs.id = songsList[i].id;
					songs.name = songsList[i].name;
					songs.singerDes = songsList[i].ar[0].name + ' - ' + songsList[i].al.name;
					that.songList.push(songs);
				}

				that.listShow = true;

				that.getUserComment();
			})
			.catch(function (error) {
				console.log(JSON.stringify(error));
			});
		},
		/**@augments
		 * 获取用户评论
		 */
		getUserComment () {
			let that = this,
				id = this.$route.params.id;
			this.$http.get('http://127.0.0.1:4000/comment/playlist', {
				params: {
					id: id
				}
			})
			.then(function (response) {
				let hotCommentList = response.data.hotComments,
					commentList = response.data.comments,
					hotCommentListCount = hotCommentList.length,
					commentListCount = commentList.length;
				that.newCommentsNum = ' (' + commentListCount + ')';


				if (hotCommentListCount > 0) {
					for (let i = 0; i < hotCommentListCount; i++) {
						let hotComment = {};
						hotComment.userId = hotCommentList[i].user.userId;
						hotComment.name = hotCommentList[i].user.nickname;
						hotComment.userUrl = hotCommentList[i].user.avatarUrl;
						hotComment.likeCount = hotCommentList[i].likedCount;
						hotComment.comment = hotCommentList[i].content;
						hotComment.time = hotCommentList[i].time;
						that.hotComments.push(hotComment);
					}
				} else {
					that.hotCommentShow = true;
				}

				if (commentListCount > 0) {
					for (let i = 0; i < commentListCount; i++) {
						let comment = {};
						comment.userId = commentList[i].user.userId;
						comment.name = commentList[i].user.nickname;
						comment.userUrl = commentList[i].user.avatarUrl;
						comment.likeCount = commentList[i].likedCount;
						comment.comment = commentList[i].content;
						comment.time = commentList[i].time;
						that.newComments.push(comment);
					}
				} else {
					that.commentShow = true;
				}
			})
			.catch(function (error) {
				console.log(JSON.stringify(error));
			});
		},
		/**@augments
		 * 展开收起状态去返
		 */
		changeVariable() {
			this.openFold = !this.openFold;
			this.closeFold = !this.closeFold;
		},
		/**@augments
		 *  跳转音乐播放页
		 */
		turnDetail(id) {
			this.$router.push({ name: 'playMusic', params: { id: id }})
		}
	},
	filters: {
		formatCount (num) {
			if (num < 100000) {
				if (num == 0) {
					return '';
				}
				return num;
			} else {
				let nums = (num / 10000).toFixed(1),
					numArr = nums.split('.');
				num = numArr[1] == "0" ?  numArr[0] : nums;

				return num + '万';
			}
		},
		getFormatTime (time) {
			return getFormatDate(time);
		}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#playListDetail {
	position: relative;
	width: 100vw;
	height: auto;

	.modal {
		position: fixed;
		top: 0px;
		left: 0px;
		right: 0px;
		bottom: 0px;
		z-index: 10;
		opacity: 0.5;
		background-color: #000;

		.middle-main {
			position: absolute;
			top: 50%;
			left: 50%;
			-webkit-transform: translateX(-50%) translateY(-50%);
			transform: translateX(-50%) translateY(-50%);
		}
	}
}



.head {
	position: relative;
	display: -webkit-box;
    display: flex;
    padding: 30px 10px 30px 15px;
	overflow: hidden;
	text-align: left;

	.bg-head{
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
    	z-index: 1;
		background-repeat: no-repeat;
		background-size: cover;
		background-position: 50%;
		-webkit-filter: blur(20px);
		filter: blur(20px);
		-webkit-transform: scale(1.5);
		transform: scale(1.5);

		&:after {
			content: " ";
			background-color: rgba(0,0,0,.25);
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			z-index: 1;
		}
	}
	
	
	.lt-head {
		position: relative;
    	z-index: 2;
		display: inline-block;
		width: 126px;
		height: 126px;
		background-color: #e2e2e3;
		
		.img-head{
			width: 100%;
   			height: 100%;
		}

		.playCount{
			position: absolute;
			top: 0;
			right: 2px;
			z-index: 3;
			padding-left: 16px;
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

		.icon-head {
			position: absolute;
			z-index: 3;
			top: 10px;
			left: 0;
			padding: 0 8px;
			height: 17px;
			color: #fff;
			font-size: 9px;
			text-align: center;
			line-height: 17px;
			background-color: rgba(217,48,48,.8);
			border-top-right-radius: 17px;
			border-bottom-right-radius: 17px;
		}

		&:after { // 黑色阴影
			content: " ";
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 18px;
			z-index: 2;
			background-image: linear-gradient(90deg,transparent,rgba(0,0,0,.2));
		}
	}

	.rt-head {
		position: relative;
    	z-index: 2;
		-webkit-box-flex: 1;
		flex: 1;
		margin-left: 16px;

		.name-head {
			padding-top: 1px;
			font-size: 17px;
			line-height: 1.3;
			color: #fefefe;
			font-weight: normal;
			height: 45px;
			display: -webkit-box;
    		-webkit-box-pack: center;

			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}

		.creator-head {
			position: relative;
			margin-top: 20px;
			color: hsla(0,0%,100%,.7);
			font-size: 14px;

			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 1;
			-webkit-box-orient: vertical;
			
			.img-creator{
				display: inline-block;
				width: 30px;
				height: 30px;
				border-radius: 50%;
				vertical-align: middle;
				margin-right: 5px;
			}
		}
		
	}
}

.details {
	position: relative;
    margin: 0 10px 0 15px;
    padding-top: 10px;
    line-height: 19px;
	color: #666;
	
	.tag-des {
		text-align: left;
		line-height: 20px;
		font-size: 14px;

		.tags {
			margin-right: 10px;
			padding: 4px 7.5px;
			border: .1px solid rgba(0,0,0,.3);
			border-radius: 9999px;
			font-size: 12px;
		}
	}

	.intro-des {
		position: relative;
		
		.intro {
			margin-top: 10px;
			margin-bottom: 20px;
		}

		.show-3line {
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;
		}

		.fold {
			position: absolute;
			right: 0;
			bottom: -16px;

			width: 15px;
			height: 15px;
			
			background-size: 15px 15px; 
		}

		.open-fold {
			background-image: url(../../assets/img/open.svg);
		}

		.close-fold {
			background-image: url(../../assets/img/close.svg);
		}
	}
}

.main {

	h3 {
		height: 23px;
		line-height: 23px;
		padding: 0 10px;
		font-size: 12px;
		font-weight: 400;
		color: #666;
		background-color: #eeeff0;
	}


	.cell-songs {
		background-color: #F8F8F8;
		display: -webkit-box;
		display: flex;
		align-items: center;
		justify-content: center;

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

	.cell-comment {
		background-color: #F8F8F8;
		display: -webkit-box;
		display: flex;
		align-items: top;
		justify-content: center;

		.head-comment {
			flex: 50px;
			max-width: 50px;
			padding-top: 10px;
			text-align: center;

			.img-head-comment {
				border-radius: 50%;
				width: 30px;
				height: 30px;
			}
		}

		.user-info {
			flex: 1;
			padding-right: 10px;
    		padding-bottom: 10px;
			border-bottom: 1px solid rgba(221,221,221,.5);

			.user-info-comment {
				position: relative;
				display: -webkit-box;
				display: flex;
				text-align: left;

				.user-head-comment {
					flex: 1 1 auto;
					padding: 6px 0;
					line-height: 1.5;
					//border-bottom: 1px solid rgba(221,221,221,.5);;

					.name-comment {
						display: block;	
						font-size: 14px;
						color: #666;
						line-height: 20px;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						font-family: 'Microsoft YaHei';
					}

					.title-comment {
						display: block;	
						font-size: 9px;
						color: #999;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						word-break: normal;
					}
				}

				.like-comment {
					height: auto;
					width: auto;
					padding: 6px 0;
					flex: 60px;
					max-width: 60px;
					text-align: right;

					.like-count {
						font-size: 11px;
						color: #999;
						margin-right: 2px;
					}

					.like-icon {
						display: inline-block;
						vertical-align: bottom;
						width: 20px;
						height: 20px;
						background-image: url(../../assets/img/like.svg);
						background-repeat: no-repeat;
						background-size: 20px 20px;
						outline-color: transparent;
						color: transparent;
					}
					
				}
			}
		}
	}
}


</style>