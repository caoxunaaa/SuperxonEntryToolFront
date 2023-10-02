<template>
  <div id="app">
    <div v-if="frontdeskbackground">
      <navigation></navigation>
    </div>
<!--    <img src="./assets/logo.png">-->
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
import navigation from '@/components/navigation'
export default {
  name: 'App',
  components: {
    navigation
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  mounted () {
    // localStorage.setItem('backstage', 'false')
    // this.get_backstage()
    // this.setTimer()
  },
  data () {
    return {
      frontdeskbackground: true,
      isRouterAlive: true,
      backstage: 'true'
    }
  },
  // 监听路由的变化，在前台还是后台
  watch: {
    '$route': {
      handler: function (val, oldval) {
        // console.log((val.path).slice(0, 11))
        if ((val.path).slice(0, 11) === '/backstage/') {
          this.frontdeskbackground = false
          // console.log('后台')
        } else {
          this.frontdeskbackground = true
          // console.log('前台')
        }
      },
      deep: true, // 深度监听对象和对象中的属性，比如说一个对象有多个值，其中一个发生改变也会执行函数
      immediate: true // 当值第一次绑定的时候也执行函数
    }
  },
  methods: {
    // get_backstage () {
    //   if (this.backstage === localStorage.getItem('backstage')) {
    //     this.frontdeskbackground = false
    //   } else {
    //     this.frontdeskbackground = true
    //   }
    // },
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  background-color: #ffffff;
  margin-top: 0px;
  padding: 0;
  text-align: center;
}
.el-table >>> th.gutter{
  display: table-cell !important;
}
</style>
