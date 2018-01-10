import Vue from 'vue'
import Router from 'vue-router'
import home from '@/pages/home/home'
import recommendingMusic from '@/pages/home/recommendingMusic'
import hotSongList from '@/pages/home/hotSongList'
import sreach from '@/pages/home/sreach'
import playMusic from '@/pages/playMusic'
import playListDetail from '@/pages/playListDetail/playListDetail'

Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [
		{
		path: '/',
		name: 'home',
		component: home,
		meta: {
			keepAlive: true
		},
			children: [
				{
					path: '/recommendingMusic',
					name: 'recommendingMusic',
					component: recommendingMusic,
					meta: {
						keepAlive: true
					}
				},
				{
					path: '/hotSongList',
					name: 'hotSongList',
					component: hotSongList,
					meta: {
						keepAlive: true
					}
				},
				{
					path: '/sreach',
					name: 'sreach',
					component: sreach,
					meta: {
						keepAlive: false
					}
				}
			]
		},
		{
			path: '/playMusic&id=:id',
			name: 'playMusic',
			component: playMusic,
			meta: {
				keepAlive: false
			}
		},
		{
			path: '/playListDetail&id=:id',
			name: 'playListDetail',
			component: playListDetail,
			meta: {
				keepAlive: true
			}
		}
	]
})
