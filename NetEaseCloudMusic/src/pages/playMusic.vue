<template lang="pug">
	div#playMusic
		div.bg(v-bind:style="{ backgroundImage : picUrl }")
		div.container
			div.music-switch(v-on:click='isPause = !isPause')
			div.disk
				audio#music.hide(preload='auto' v-bind:src='songUrl')
				div.song-head-default
				div.song-head-user(v-bind:class="{'animation-pause': !isPause , 'animation-rotate': !isEnd}")
					span.img-head(v-bind:style="{ backgroundImage : picUrl }")
				span.pause(v-show="isPause === false")

			div.lyrics
				h2.songs-info {{song}} -
					span.author {{author}}
				div.lrc-info
					div#lrc-list
						p.lrc-cell(v-for= "lrc in lrcList " v-bind:data-lrcTime="lrc.lrctime") {{lrc.lrcVal}}

			div.up-box
				i.up-icon

			div.comment
				h3.headline(v-show="hotCommentShow === true") 精彩评论
				section(v-show="hotCommentShow === true")
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

				h3.headline(v-show="commentShow === true") 最新评论 {{newCommentsNum}}
				section(v-show="commentShow === true")
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

				div.more-comment(v-show="commentShow === true") 查看全部{{allCommentNum}}评论

</template>

<script>
import  { getFormatDate  } from '../assets/js/time'
export default {
	name: 'playMusic',
	data () {
		return {
			picUrl: '', // url(背景图)
			song: '', // 歌曲名
			author: '', // 歌手名
			lrcList: [], //歌词list
			songUrl: '', // 歌曲地址
			isPause: false, // 是否暂停
			isEnd: false, // 是否播放完毕
			setLrcShowStyle: {},
			hotCommentShow: false,
			commentShow: false,
			hotComments: [],//精彩评论
			newComments: [],//最新评论
			allCommentNum: '',
			newCommentsNum: ''
		}
	},
	created() {
		let id = this.$route.params.id;
		this.songUrl = `http://music.163.com/song/media/outer/url?id=${id}.mp3`;
		this.getSongDetail();
		this.getLyricDetail();
		this.getUserComment();
	},
	methods: {
    	returnPage() {
     		this.$router.push({ path: '/'})
    	},
		/**@augments
		* 获取音乐歌曲信息
		*/
		getSongDetail() {
			let that = this,
				id = this.$route.params.id;
			this.$http.get('http://127.0.0.1:4000/song/detail', {
				params: {
					ids: id
				}
			})
			.then(function (response) {
				let result = response.data.songs;
				that.picUrl = 'url(' + result[0].al.picUrl + ')';
				that.headUrl = result[0].al.picUrl;
				that.song = result[0].name;
				that.author = result[0].ar[0].name;
			})
			.catch(function (error) {
				console.log(JSON.stringify(error));
			});
		},
		/**@augments
		* 获取音乐歌词信息
		*/
		getLyricDetail() {
			let that = this,
				id = this.$route.params.id;
			this.$http.get('http://127.0.0.1:4000/lyric', {
				params: {
					id: id
				}
			})
			.then(function (response) {

				let result = response.data.lrc;
				if (result != '') {
					let lrcArr = result.lyric.split("\n"),
						lrcList = [],
						lrcTimeArrList = [];
					for (let i = 0; i < lrcArr.length-1; i++) {
						let lrc = {}; // 歌词和时间秒数
						lrcArr[i].replace(/^(\[\d+\:\d+\.{1}\d+\])?/g, function(){
							let time = arguments[0],
								timeArr = time.replace('[', '').replace(']', '').replace('.', ':').split(':'),
								min = timeArr[0] | 0, // 分
								sec = timeArr[1] | 0, // 秒
								msec = timeArr[2] | 0, // 毫秒
								realMin = min * 60 + sec + '.' + msec; // 计算总秒数
								lrc.lrctime = realMin;

						});
						lrc.lrcVal = lrcArr[i].replace(/^(\[\d+\:\d+\.{1}\d+\])?/g, '');
						if (lrc.lrcVal != '') {
							lrcTimeArrList.push(lrc.lrctime);
							lrcList.push(lrc);
						}
					}
					that.lrcList = lrcList;
					that.lrcTimeList = lrcTimeArrList;
				}
				that.isPause = true;
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
			this.$http.get('http://127.0.0.1:4000/comment/music', {
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
				that.allCommentNum = response.data.total + '条';

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
				}
				that.hotCommentShow = true;
				

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
				}
				that.commentShow = true;
				
			})
			.catch(function (error) {
				console.log(JSON.stringify(error));
			});
		}
	},
	beforeDestroy() {
		clearInterval(this.setLrcShowStyle);
	},
	watch: {
		isPause: function(val) {
			var audio = document.querySelector("#music"),
				lrcTimeLists = this.lrcTimeList;
			if (val) {
				audio.play();
				this.isEnd = false;
				if (lrcTimeLists.length > 0) {
					let that = this;
					this.setLrcShowStyle = setInterval(function() {
						for (let i = 0; i < lrcTimeLists.length; i++) {
							let audio = document.querySelector("#music");
							
							let currentTime = audio.currentTime || 0, // 当前时间
								ended = audio.ended, // 是否结束
								showTimeD = lrcTimeLists[i] - currentTime;
								
							if (ended) {
								that.isEnd = true;
							}

							if (showTimeD < 0.2) {
								let num = 0;
								if (i > 1) {
									num = (i - 1) * 32;
								}
								if (document.querySelectorAll('.highlightlrc').length == 1) {
									document.querySelectorAll('.highlightlrc')[0].classList.remove('highlightlrc');
								}

								document.querySelectorAll('.lrc-cell')[i].classList.add('highlightlrc');
								document.querySelector('#lrc-list').style.transform = `translateY(-${num}px)`;
							}
						}
					}, 100);
				}
			} else {
				audio.pause();
				clearInterval(this.setLrcShowStyle);
			}
		},
		isEnd: function(val) {
			if (val) {
				this.isPause = false;
				document.querySelectorAll('.highlightlrc')[0].classList.remove('highlightlrc');
				document.getElementById('lrc-list').removeAttribute("style");
			}
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
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#playMusic {
	position: absolute;
	width: 100%;
	height: 100%;
	overflow: hidden;

	.bg {
		position: absolute;
		top: -20px;
		left: 0;
		right: 0;
		overflow: hidden;
		z-index: -1;
		transition: opacity .3s linear;
		width: 100%;
		height: 100%;
		background-position: 50%;
		background-repeat: no-repeat;
		background-size: auto 100%;
		-webkit-transform: scale(1.5);
		transform: scale(1.5);
		-webkit-transform-origin: center top;
		transform-origin: center top;

		-moz-filter: blur(15px);
		-webkit-filter: blur(15px);
		-o-filter: blur(15px);
		-ms-filter: blur(15px);
		filter: blur(15px);
		filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=4, MakeShadow=false);

		&::after {
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			top: 0;
			content: " ";
			background-color: rgba(0,0,0,.55);
		}
	}
}

.container {
	position: absolute;
    top: 0;
    bottom:0;
    width: 100%;
    height: auto;
    overflow-x: hidden;
    overflow-y: auto;

	&::-webkit-scrollbar {display:none}

	&::before {
		content: "";
		position: absolute;
		top: 12px;
		left: 10px;
		display: block;
		width: 100px;
		height: 17px;
		background: url(../assets/img/logo.png) no-repeat;
		background-size: 100px auto;
	}

	&::after {
		content: "";
		position: absolute;
		top: 0;
		left: 50%;
		-webkit-transform: translateX(-15px);
		transform: translateX(-15px);
		display: block;
		width: 100px;
		height: 137px;
		background: url(../assets/img/needle.png) no-repeat;
		background-size: 100px auto;
	}
}
.music-switch {
	position: absolute;
    top: 0;
	z-index: 10;
    height: 100vh;
    width: 100%;
}

.disk {
		position: relative;
		margin: 70px auto 0;
		width: 80vw;
		height: 80vw;
		max-width: 350px;
		max-height: 350px;

		&::before {
			content: " ";
			display: block;
			width: 100%;
			height: 100%;
			max-width: 350px;
    		max-height: 350px;
			z-index: 2;
			background: url(../assets/img/disc.png) no-repeat;
			background-size: contain;
			background-image: url(../assets/img/disc-ip6.png);
		}

		.song-head-default {
			position: absolute;
			top: 50%;
			left: 50%;
			-webkit-transform: translateX(-50%) translateY(-50%);
			transform: translateX(-50%) translateY(-50%);
			z-index: 3;
			width: 50vw;
			height: 50vw;
			max-width: 218px;
    		max-height: 218px;
			border-radius: 50%;
			overflow: hidden;
			background: url(../assets/img/disc_default.png) no-repeat;
			background-size: contain;


		}

		.song-head-user {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			width: 100%;
			height: 100%;
			max-width: 350px;
    		max-height: 350px;
			background: url(../assets/img/disc_light-ip6.png) no-repeat;
    		background-size: contain;
			z-index: 3;


			.img-head {
				position: absolute;
				top: 50%;
				left: 50%;
				-webkit-transform: translateX(-50%) translateY(-50%);
				transform: translateX(-50%) translateY(-50%);
				width: 50vw;
				height: 50vw;
				max-width: 218px;
    			max-height: 218px;
				border-radius: 50%;
				background-size: 100%;

			}
		}

		.animation-rotate {
			-webkit-animation: rotate 20s infinite linear;
    		animation: rotate 20s infinite linear;
		}

		.animation-pause {
			animation-play-state:paused;
		}

		.pause {
			position: absolute;
			top: 50%;
			left: 50%;
			-webkit-transform: translateX(-50%) translateY(-50%);
			transform: translateX(-50%) translateY(-50%);
			z-index: 4;
			width: 56px;
			height: 56px;
			background: url(../assets/img/player.png) no-repeat;
			background-size: contain;
		}

	}

.lyrics {
	margin: 25px 35px 0;
	height: 150px;

	.songs-info {
		text-align: center;
		font-size: 18px;
		height: 20px;
		line-height: 20px;
		color: #fefefe;
		font-weight: 400;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;

		.author {
			font-size: 15px;
			color: hsla(0,0%,100%,.6);
		}
	}

	.lrc-info {
		margin-top: 15px;
		height: 90px;
		text-align: center;
		overflow: hidden;
	}
}

#lrc-list {
	font-size: 16px;
	color: hsla(0,0%,100%,.6);
	transition: -webkit-transform .3s ease-out;
	transition: transform .3s ease-out;

	.lrc-cell {
		padding-bottom: 8px;
		line-height: 24px;
    	height: 24px;
	}
}

.highlightlrc {
	color: rgb(255, 255, 255);
}

.up-box {
	position: absolute;
    bottom: 0;
    left: 50%;
	transform: translateX(-50%);
    height: 30px;
    padding-top: 10px;
    text-align: center;

	.up-icon {
		display: inline-block;
		width: 17px;
		height: 12px;
		background-repeat: no-repeat;
		background-size: 17px auto;
		background-image: url(../assets/img/upward.png);
		background-position: 0 0;

		-webkit-animation: shining 1.2s steps(1) infinite;
    	animation: shining 1.2s steps(1) infinite;
	}

}

.comment {
	position: absolute;
    top: 0;
    margin-top: 100vh;
}

.headline {
	position: relative;
	padding-left: 10px;
	text-align: left;
	line-height: 25px;
    color: #fff;
    font-size: 16px;
    background-color: transparent;
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

.cell-comment {
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
		border-bottom: 1px solid hsla(0,0%,100%,.1);

		.user-info-comment {
			position: relative;
			display: -webkit-box;
			display: flex;
			text-align: left;

			.user-head-comment {
				flex: 1 1 auto;
				padding: 6px 0;
				line-height: 1.5;

				.name-comment {
					display: block;
					font-size: 14px;
					color: hsla(0,0%,100%,.7);
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
					background-image: url(../assets/img/like.svg);
					background-repeat: no-repeat;
					background-size: 20px 20px;
					outline-color: transparent;
					color: transparent;
				}

			}
		}
	}
}

.content-comment {
	color: #FFF;
    font-size: 15px;
    line-height: 22px;
    margin-top: 5px;
}

.more-comment {
	padding: 18px 0;
    font-size: 14px;
    color: #999;
    text-align: center;
    line-height: 1;
}


@-webkit-keyframes rotate {
	from {
		-webkit-transform:rotate(0deg)
	}
	to {
		-webkit-transform:rotate(360deg)
	}
}
@-webkit-keyframes shining {
	0% {
		background-position: 0 0;
	}
	15% {
		background-position: 0 -12px;
	}
	30% {
		background-position: 0 -24px;
	}
	45% {
		background-position: 0 -36px;
	}
	60% {
		background-position: 0 -48px;
	}
	75% {
		background-position: 0 -60px;
	}
	90% {
		background-position: 0 -72px;
	}
	100% {
		background-position: 0 -84px;
	}
}
.white {
	color: white;
}

</style>
