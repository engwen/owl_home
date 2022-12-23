<template>
  <div>
    <el-sub-menu :default-openeds=[menuNode.node.id] :index="menuNode.node.id + ''" v-if="menuNode.treeList.find((it)=>it.node.menuLevel===1)">
      <template #title>
        <span>{{menuNode.node.menuName}}</span>
      </template>
      <el-menu-item-group>
        <template #title>
          <left-menu-tree :key="'leftMenu' + son.node.menuName" v-for='son in menuNode.treeList' :menuNode='son'/>
        </template>
      </el-menu-item-group>
    </el-sub-menu>
    <el-menu-item :index="menuNode.node.id + ''" v-else-if="menuNode.node.menuLevel === 1" @click="menuClick()">
      {{menuNode.node.menuName}}
    </el-menu-item>
  </div>
</template>

<script>

import {endLoading, startLoading} from "../../utils/request";

  export default {
    name: "LeftMenuTree",
    props: ['menuNode'],
    data() {
      return {}
    },
    methods: {
      menuClick() {
        startLoading()
        this.$router.push(this.menuNode.node.menuPageUrl)
        endLoading()
      }
    },
    created() {
      // this.$router.push(GLOBAL_CONTENT.ROUTER_PATH.USER_LIST);
    }
  }
</script>

<style scoped>
</style>
