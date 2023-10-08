<template>
  <div id="Navigation">
    <el-menu
      :default-active="activeIndex"
      :router="true"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item  index="assemble_material_check_system"><router-link tag="li" :to="{path:'/assemble/assemble_material_check_system'}">装配物料BOM核对系统</router-link></el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
  data () {
    return {
      activeIndex: '1',
      logged: false,
      backstage: false,
      username: '',
      timer: ''
      // proscenium: true
    }
  },
  mounted () {
    this.proscenium = true
  },
  methods: {
    handleSelect (key, keyPath) {
      this.activeIndex = key
    }
  }
}
</script>

<style>
  #Navigation {
    margin-bottom: 20px;
  }
  .atooltip {
  background:rgba(255, 255, 255, 0.5) !important;
  font-size: 1px !important;
  max-height: 10px !important;
  max-width:200px !important;
  }
  /* .atooltip{
    background:red !important
  } */
</style>
