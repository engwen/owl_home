<template>
  <el-container id="Layout">
    <el-row>
      <el-col :span="24">
        <div class="grid-content ep-bg-purple-dark"/>
      </el-col>
    </el-row>
    <el-header>
       <span
           style="float:left;margin-left: 0;font-size: 1em;font-weight: bold;color:#FFFFFF;cursor: pointer;pointer-events: none;"
       >User Management System </span>
      <el-menu class="el-menu-demo" style="float: right;width: 400px" mode="horizontal"
               background-color="#409EFF"
               text-color="#fff"
               active-text-color="#409EFF">
        <el-sub-menu index="2" style="float: right;margin:0 15px 0 0;">
          <template #title>组织：{{ selectDefOrg.orgName }}</template>
          <el-menu-item :key="'2-'+ org.id" v-for="org in orgList" :index="'2-'+ org.id" @click="changeOrg(org)">
            {{ org.orgName }}
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="5" style="float: right;margin:0 15px 0 0;">
          <template #title>{{ signiner.userName }}</template>
          <el-menu-item index="5-1" @click="signoutBtn">退出登录</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-menu
              :unique-opened="false"
              :collapse-transition="false"
              mode="vertical"
              :default-active="menuNodes[0]?menuNodes[0].node.id + '' :''"
              class="el-menu-vertical-demo"
              background-color="#545c64"
              text-color="#fff"
              @open="handleOpen"
              @close="handleClose">
            <left-menu-tree :key="menuNode.menuName" v-for='menuNode in menuNodes' :menuNode='menuNode'/>
          </el-menu>
        </el-scrollbar>
      </el-aside>

      <el-main>
        <transition name="fade" height="100%">
          <div class="right-content">
            <router-view></router-view>
          </div>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {GLOBAL_CONTENT} from "../utils/contentConst";
import LeftMenuTree from "./layout/LeftMenuTree.vue";
import {orgListByUser, signerTopOrgList} from "./api/org";
import {signout} from "./api/user";
import {menuListTreeBySigner, menuTreeList} from "./api/menu";
import {isContain} from "../utils/rule";
import {routerPush} from "../utils/request";

export default {
  name: "Layout",
  inject: ['reload'],
  data() {
    return {
      orgList: [],
      selectDefOrg: {},
      menuNodes: JSON.parse(localStorage.magicAtuhSigniner).menuNode,
      signiner: JSON.parse(localStorage.magicAtuhSigniner),
      clickMenuNodes: JSON.parse(localStorage.magicAtuhSigniner).menuNode,
    }
  },
  components: {LeftMenuTree},
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    orgListByUser(hasLink) {//初始化時，查詢用戶持有的組織信息,需要跳转到userList传入true
      this.orgList = []
      let signerOrgListStr = localStorage.magicAuthSignerOrgList
      if (signerOrgListStr) {//是否已經持有信息
        this.orgList = JSON.parse(signerOrgListStr)
        this.setDefOrg(hasLink)
      } else {
        //否則，需要獲取組織信息
        new Promise((resolve, reject) => {
          signerTopOrgList().then(response => {
            this.orgList = response.resultData
            if (!this.orgList) {
              this.$message({
                message: "未查询到归属组织信息",
                type: 'error'
              })
              return
            }
            localStorage.setItem("magicAuthSignerOrgList", JSON.stringify(this.orgList))
            this.setDefOrg(hasLink)
          }).catch(error => {
            reject(error)
          })
        });
      }
    },
    setDefOrg(hasLink) {//内部使用，用來更新當前選擇的組織
      let defOrgStr = localStorage.magicAuthDefOrg
      if (defOrgStr === undefined || defOrgStr === 'undefined' || defOrgStr === "") {
        this.selectDefOrg = this.orgList[0]
        localStorage.setItem("magicAuthDefOrg", JSON.stringify(this.selectDefOrg))
      } else {
        this.selectDefOrg = JSON.parse(defOrgStr)
      }
      if (hasLink) {
        routerPush(hasLink);
      } else {
        routerPush(GLOBAL_CONTENT.ROUTER_PATH.USER_LIST);
      }
    },
    changeOrg(data) {
      //切換組織信息
      this.selectDefOrg = data
      localStorage.setItem("magicAuthDefOrg", JSON.stringify(this.selectDefOrg))
      this.reload();
    },
    signoutBtn: function () {
      new Promise((resolve, reject) => {
        signout({
          userAccount: this.signiner.account,
        }).then(response => {
          this.$message({
            message: "退出登录",
            type: 'success'
          })
        }).catch(error => {
          reject(error)
        })
      });
      //清空保存信息
      localStorage.removeItem("magicAuthToken")
      localStorage.removeItem("magicAtuhSigniner")
      localStorage.removeItem("magicAtuhRoles")
      localStorage.removeItem("magicAuthSignerOrgList")
      localStorage.removeItem("magicAuthDefOrg")
      //跳轉登錄頁
      routerPush(GLOBAL_CONTENT.ROUTER_PATH.SIGNIN_PATH);
    },
    getMenuTree() {
      new Promise((resolve, reject) => {
        menuListTreeBySigner({
          "topOrgCode": JSON.parse(localStorage.magicAuthDefOrg).topOrgCode
        }).then(response => {
          let menuTree = response.resultData
          let signer = JSON.parse(localStorage.magicAtuhSigniner)
          this.menuNodes = signer.menuNode = menuTree
          localStorage.setItem("magicAtuhSigniner", JSON.stringify(signer))
        }).catch(error => {
          reject(error)
        })
      })
    },
  },
  listenMenuClick(menuNode) {

  },
  created() {
    if (!localStorage.magicAuthToken) {
      routerPush(GLOBAL_CONTENT.ROUTER_PATH.SIGNIN_PATH);
    }
    let signer = JSON.parse(localStorage.magicAtuhSigniner)
    if (signer.roleList.length === 1 && signer.roleList[0].roleCode === "defUser") {
      this.orgListByUser(GLOBAL_CONTENT.ROUTER_PATH.SIGNIN_INFO)
    } else {
      this.getMenuTree()
      this.orgListByUser(GLOBAL_CONTENT.ROUTER_PATH.SIGNIN_INFO)
    }
  },
}
</script>

<style scoped>

.el-header, .el-footer {
  background-color: #409EFF;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-container {
  height: 100%
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-aside {
  background-color: #545c64;
  text-align: left;
  line-height: 200px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.right-content {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.el-main {
  line-height: normal;
  text-align: left;
  padding: 10px;
}

</style>
