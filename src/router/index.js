import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import AssembleMaterialCheckSystem from '@/components/assemble/AssembleMaterialCheckSystem'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/assemble',
      component: AssembleMaterialCheckSystem,
      children: [
        {path: 'assemble_material_check_system', component: AssembleMaterialCheckSystem}
      ]
    }
  ]
})
