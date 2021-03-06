import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {

      if (store.getters.roles.length === 0) {
        console.log('roles====0')
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          const roles = res.body[0].roles // note: roles must be a array! such as: ['editor','develop']
          console.log('roles?', roles)
          store.dispatch('GenerateRoutes',{roles}).then(()=>{

            //console.log('addrouters', store.getters.addRouters)
            console.log('addrouters', store.getters.addRouters)
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            // next()

          }).catch(()=>{
            store.dispatch('FedLogOut').then(() => {
              Message.error('验证失败,请重新登录')
              next({ path: '/login' })
            })
          })

        }).catch(() => {
          store.dispatch('FedLogOut').then(() => {
            Message.error('验证失败,请重新登录')
            next({ path: '/login' })
          })
        })
      } else {
        console.log('====1')
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()

    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress

})
