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
      children: [
        {
          path: '/recommendingMusic',
          name: 'recommendingMusic',
          component: recommendingMusic
        },
        {
          path: '/hotSongList',
          name: 'hotSongList',
          component: hotSongList
        },
        {
          path: '/sreach',
          name: 'sreach',
          component: sreach
        }
      ]
    },
    {
      path: '/playMusic&id=:id',
      name: 'playMusic',
      component: playMusic
    },
    {
      path: '/playListDetail&id=:id',
      name: 'playListDetail',
      component: playListDetail
    }
  ]
})
