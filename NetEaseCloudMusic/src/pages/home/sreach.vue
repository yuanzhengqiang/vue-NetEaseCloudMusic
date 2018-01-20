<template lang="pug">
	div#sreach
		div.box-sreach
			div.input-box-sreach
				i.icon-sreach
				input.input-sreach(placeholder='搜索歌曲、歌手、专辑' v-on:input ='getValue' v-model='sreachValue' v-on:keyup.enter="getKeywords")
				i.icon-clear(v-on:click='clearInput' v-show="clearBtnShow === false")

		div.box-history(v-show="sreachHistory === false")
			ul.list-history
				li.cell-history(v-for="item in sreachHistoryList") 
					i.icon-history
					div.name-sreach-history
						label.name-sreach(v-on:click='turnSreachRecord(item.name)') {{item.name}}
						i.icon-close(v-on:click='delCell(item.timestamp, $event)')

		div.box-suggest(v-show="sreachSuggest === false")
			h3.need-sreach 搜索“{{allSreachValue}}”

		div.box-record(v-show="sreachRecord === false")
			mt-spinner.middle( type="triple-bounce" v-show="sreachRecordListShow === false")
			section( v-show="sreachRecordListShow === true" v-infinite-scroll="getSreachRecordList" infinite-scroll-disabled="loading" infinite-scroll-distance="30")
				div.cell-songs( v-for="item in sreachRecordtList")
					div.info-songs(v-on:click='turnDetail(item.id)')
						div.des-song
							label.name-song {{item.name}}
							span.title-song {{item.singerDes}}
						div.play-song
</template>

<script>
import Vue from 'vue';
import {setStorage, getStorage, clearStorageItem} from '../../assets/js/storage'
import { InfiniteScroll } from 'mint-ui';

Vue.use(InfiniteScroll);
export default {
	name: 'sreach',
	data () {
		return {
			sreachValue: '', //输入框的
			allSreachValue: '', //带中文输入法的待输入的
			clearBtnShow: true,
			sreachHistoryList: [],
			sreachSuggestList: [],
			sreachRecordtList: [],
			sreachHistory: false, //搜索历史页是否隐藏
			sreachSuggest: true, //搜索建议页是否隐藏
			sreachRecord: true, //搜索记录页是否隐藏
			sreachRecordListShow: false, //搜索记录页是否加载完
			sreachRecordListPageNum: 0 //搜索页数（当前第几页）
		}
	},
	created () {
		this.getCellHistory('sreachHistory');
	},
	methods: {
		/**@augments
		 * 获取搜索记录内容
		 */
		getSreachRecordList() {
			let $sreach = document.querySelector('#sreach');
			if ($sreach.parentNode.style.display == 'none') { // 判断是否当前的tab页
				return;
			}
			let that = this,
				keywords = this.allSreachValue,
				offset = this.sreachRecordListPageNum * 30;
				this.sreachRecordListPageNum++;
			this.$http.get('http://127.0.0.1:4000/search', {
				params: {
					keywords: keywords,
					offset: offset
				}
			})
			.then(function (response) {
				let result = response.data.result;
				let songsList =  result.songs;
				for (let i = 0; i < songsList.length; i++) {
					let songs = {};
					songs.id = songsList[i].id;
					songs.name = songsList[i].name;
					songs.singerDes = songsList[i].artists[0].name + ' - ' + songsList[i].album.name;
					that.sreachRecordtList.push(songs);
				}

				that.sreachRecordListShow = true;
			})
			.catch(function (error) {
				console.log(JSON.stringify(error));
			});
		},
		/**@augments
		 * 
		 */
		turnSreachRecord(val) {
			this.sreachRecordListPageNum = 0;
			this.sreachRecordtList = [];
			this.allSreachValue = val;
			this.getSreachRecordList();
			this.sreachSuggest = true;
			this.sreachHistory = true;
			this.sreachRecord = false;
			this.sreachValue = val;
			this.clearBtnShow = false;
		},
		/**@augments
		 *  跳转音乐播放页
		 */
		turnDetail(id) {
			this.$router.push({ name: 'playMusic', params: { id: id }})
		},
		/**@augments
		 * 获取搜索关键字并存入搜索历史
		 */
		getKeywords() {
			var name = {name: this.allSreachValue}
			setStorage('sreachHistory', name);
			this.getSreachRecordList();
			this.getCellHistory('sreachHistory');
			this.sreachSuggest = true;
			this.sreachHistory = true;
			this.sreachRecord = false;
		},
		/**@augments
		 * 获取搜索历史
		 */
		getCellHistory(name) {
			this.sreachHistoryList = getStorage(name);
		},
		/**@augments
		 * 获取搜索输入框内容
		 */
		getValue(event) {
			let oldval = this.sreachValue;
			if (event.isTrusted && event.inputType == 'insertCompositionText' && event.data != null) {
				this.allSreachValue = oldval + event.data;
			} else {
				this.allSreachValue = oldval;
			}

			this.sreachRecordtList = [];
			this.sreachHistory = true;
			this.sreachRecord = true;
			this.sreachSuggest = false;

			this.clearBtnShow = this.allSreachValue == '' ? true : false;
			if (this.allSreachValue == '') {
				this.sreachSuggest = true;
				this.sreachRecord = true;
				this.sreachHistory = false;
			}


		},
		/**@augments
		 * 清空搜索框数据
		 */
		clearInput() {
			this.sreachValue = '';
			this.clearBtnShow = true;

			this.sreachSuggest = true;
			this.sreachRecord = true;
			this.sreachHistory = false;
		},
		/**@augments
		 * 删除搜索记录并从搜索历史中清除
		 */
		delCell(timestamp, event) {
			let newEvent = event.toElement.parentNode.parentNode;
			newEvent.parentNode.removeChild(newEvent);
			clearStorageItem('sreachHistory', timestamp)
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#sreach {
	padding-top: 3px;
}

.box-sreach {
	padding: 15px 10px;
	border-top: .5px solid rgba(0,0,0,.2);
	border-bottom: .5px solid rgba(0,0,0,.2);

	.input-box-sreach {
		position: relative;
		width: 100%;
		height: 30px;
		padding: 0 30px;
		box-sizing: border-box;
		background: #ebecec;
		border-radius: 30px;

		.icon-sreach {
			position: absolute;
			left: 0;
			top: 9px;
			margin: 0 8px;
			vertical-align: middle;
			width: 13px;
    		height: 13px;
			background-image: url(../../assets/img/sreach.svg);
			background-repeat: no-repeat;
			background-size: 13px 13px;

		}

		.input-sreach {
			width: 100%;
			height: 30px;
			line-height: 18px;
			background: transparent;
			font-size: 14px;
			color: #333;
			border: none;
			outline: none;

			&::-webkit-input-placeholder {
				position: relative;
				top: .5px;
				font-size: 14px;
    			color: #c9c9c9;
			}

			&::-moz-placeholder {
				position: relative;
				top: .5px;
				font-size: 14px;
    			color: #c9c9c9;
			}
		}

		.icon-clear {
			position: absolute;
			right: 0;
			top: 7.5px;
			margin: 0 8px;
			vertical-align: middle;
			width: 15px;
    		height: 15px;
			background-image: url(../../assets/img/clearInput.svg);
			background-repeat: no-repeat;
			background-size: 15px 15px;
		}
	}
}

.box-history {
	width: 100%;
	height: auto;

	.list-history {
		margin: 0;
    	padding: 0;
		list-style: none;

		.cell-history {
			display: -webkit-box;
			display: flex;
			-webkit-box-align: center;
			align-items: center;
			height: 45px;

			.icon-history {
				margin: 0 10px;
				display: inline-block;
				vertical-align: middle;
				width: 20px;
				height: 20px;
				background-image: url(../../assets/img/history.svg);
				background-size: 100%;
				background-repeat: no-repeat;
			}

			.name-sreach-history {
				-webkit-box-flex: 1;
				flex: 1;
				display: -webkit-box;
				display: flex;
				width: 1%;
				-webkit-box-align: center;
				align-items: center;
				height: 45px;
				border-bottom: 1px solid rgba(0,0,0,.2);

				.name-sreach {
					-webkit-box-flex: 1;
					flex: 1;
					height: 45px;
    				line-height: 45px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					word-break: normal;
				}

				.icon-close {
					margin: 0 10px;
					display: inline-block;
					vertical-align: middle;
					width: 15px;
					height: 15px;
					background-image: url(../../assets/img/closeDel.svg);
					background-size: 100%;
					background-repeat: no-repeat;
				}
			}
		}
	}
}

.box-suggest {
	width: 100%;
	height: auto;

	.need-sreach {
		height: 50px;
		margin-left: 10px;
    	padding-right: 10px;
		font-size: 15px;
		line-height: 50px;
		color: #507daf;
		font-weight: 400;
		border-bottom: 1px solid rgba(0,0,0,.2);

		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		word-break: normal;
	}

	.list-suggest {
		margin: 0;
    	padding: 0;
		list-style: none;

		.cell-suggest {
			display: -webkit-box;
			display: flex;
			-webkit-box-align: center;
			align-items: center;
			height: 45px;

			.icon-suggest {
				margin: 0 7px 0 10px;
				display: inline-block;
				vertical-align: middle;
				width: 15px;
				height: 15px;
				background-image: url(../../assets/img/sreach.svg);
				background-size: 100%;
				background-repeat: no-repeat;
			}

			.name-sreach-suggest {
				-webkit-box-flex: 1;
				flex: 1;
				display: -webkit-box;
				display: flex;
				width: 1%;
				-webkit-box-align: center;
				align-items: center;
				height: 45px;
				border-bottom: 1px solid rgba(0,0,0,.2);

				.name-sreach {
					-webkit-box-flex: 1;
					flex: 1;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					word-break: normal;
				}
			}
		}
	}
}

.box-record {
	position: relative;
	width: 100%;
	height: auto;
	min-height: 50vh;

	.middle {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translateX(-50%) translateY(-50%);
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
					color: #507daf;
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
}

</style>
