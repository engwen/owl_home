<template>
  <div class="details-div">
    <el-card class="box-card edit-content">
      <div slot="header" class="clearfix">
        <span>  <label>菜单{{ menuModel.id ? '编辑' : '创建' }}</label></span>
      </div>
      <el-form ref="rulesForm" :rules="rules" :model="menuModel" label-width="200px">
        <el-form-item label="菜单名称:" prop="menuName">
          <el-input v-model="menuModel.menuName" style="width:300px" maxlength="50" clearable/>
          <label>长度1-50个字符</label>
        </el-form-item>
        <el-form-item label="菜单编码:" prop="menuCode">
          <el-input v-model="menuModel.menuCode" style="width:300px" maxlength="50" clearable :disabled="!isCreate"/>
          <label>长度5-50个字符</label>
        </el-form-item>
        <el-form-item label="菜单链接地址:">
          <el-input v-model="menuModel.menuUrl" style="width:300px" maxlength="50" clearabl/>
          <label>长度0-50个字符</label>
        </el-form-item>
        <el-form-item label="菜单页面地址:">
          <el-input v-model="menuModel.menuPageUrl" style="width:300px" maxlength="50" clearable/>
          <label>长度0-50个字符</label>
        </el-form-item>
        <el-form-item label="上级菜单名称:" prop="upMenuCode">
          <el-tree-select style="width:300px" maxlength="50" clearable
                          placeholder="上级菜单名称"
                          v-model="menuModel.upMenuCode"
                          :value="menuModel.id"
                          :lable="menuModel.upMenuName"
                          :data="menuTree"
                          :props="menuProps"
                          node-key="id"
                          ref="tree"
                          :render-after-expand="false"
                          @check="setMenuSelectedNode"
                          check-strictly
                          show-checkbox
                          default-expand-all
                          highlight-current
                          accordion
          />
          <label>请选择上级菜单</label>
        </el-form-item>
        <el-form-item label="上级菜单编码:" prop="upMenuCode">
          <el-input v-model="menuModel.upMenuCode" style="width:300px" maxlength="50" clearable
                    :disabled="true"/>
          <label>自动带出</label>
        </el-form-item>
        <el-form-item label="归属组织名称:" prop="topOrgName">
          <el-input v-model="menuModel.topOrgName" style="width:300px" maxlength="50" clearable
                    :disabled="true"/>
          <label>自动带出</label>
        </el-form-item>
        <el-form-item label="归属组织编码:" prop="topOrgCode">
          <el-input v-model="menuModel.topOrgCode" style="width:300px" maxlength="50" clearable
                    :disabled="true"/>
          <label>自动带出</label>
        </el-form-item>
        <el-form-item label="菜单等级:" prop="menuLevel">
          <el-input-number v-model="menuModel.menuLevel" style="width:300px" controls-position="right"
                           :min="miniMenuLevel"
                           :max="999">
          </el-input-number>
          <label>长度1-3个字符</label>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-right: 40px"
                     @click="handleCancel">取消
          </el-button>
          <el-button type="primary" @click="handleCreate()">{{ menuModel.id ? "更新" : "创建" }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>

</template>

<script>
import {GLOBAL_CONTENT} from "../../utils/contentConst";
import {listTreeExceptSelect, menuCreate, menuUpdate} from "../api/menu";

export default {
  name: "Create",
  data() {
    return {
      menuModel: {
        id: "",
        menuName: "",
        menuCode: "",
        menuUrl: "",
        menuPageUrl: "",
        upMenuName: "",
        upMenuCode: "",
        topOrgName: "",
        topOrgCode: "",
        level: "",
      },
      BTN_ID: GLOBAL_CONTENT.BTN_ID,
      isCreate: true,
      canSelectUpMenu: true,
      miniMenuLevel: 0,
      menuTreeDialogVisible: false,
      selectMenuTemp: "",
      menuTree: [],
      menuProps: {
        children: 'treeList',
        label: 'name'
      },
      rules: {
        // 要以数组形式展示
        menuName: [
          {required: true, message: "菜单名称不能为空", trigger: "blur"},
          {min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur"}
        ],
        // 要以数组形式展示
        menuCode: [
          {required: true, message: "菜单编码不能为空", trigger: "blur"},
          {min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur"}
        ],
        upMenuCode: [
          {min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur"}
        ],
        topOrgCode: [
          {min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur"}
        ],
      },
    }
  },

  methods: {
    handleCancel() {
      this.isCreate = true
      this.menuModel = {
        id: "",
        menuName: "",
        menuCode: "",
        topOrgName: "",
        topOrgCode: "",
        upMenuCode: "",
        level: "",
      }
      this.$router.push(GLOBAL_CONTENT.ROUTER_PATH.MENU_LIST);
    },
    handleCreate() {
      this.$refs['rulesForm'].validate(valid => {
        if (valid) {
          if (this.isCreate) {
            new Promise((resolve, reject) => {
              menuCreate(this.menuModel).then(response => {
                if (response.result) {
                  this.$message({
                    message: '创建成功',
                    type: 'success'
                  })
                  this.$router.push(GLOBAL_CONTENT.ROUTER_PATH.MENU_LIST);
                }
              }).catch(error => {
                reject(error)
              })
            })
          } else {
            new Promise((resolve, reject) => {
              menuUpdate(this.menuModel).then(response => {
                if (response.result) {
                  this.$message({
                    message: '更新成功',
                    type: 'success'
                  })
                  this.$router.push(GLOBAL_CONTENT.ROUTER_PATH.MENU_LIST);
                }
              }).catch(error => {
                reject(error)
              })
            })
          }
        }
      })
    },
    setMenuSelectedNode(data, obj) {
      // this.$refs.tree.setCheckedNodes([data])
      this.selectMenuTemp = data
      this.menuModel.upMenuCode = this.selectMenuTemp.id
      this.menuModel.upMenuName = this.selectMenuTemp.node.menuName
    },
  },
  async created() {
    let defOrg = JSON.parse(localStorage.magicAuthDefOrg)
    this.menuModel.topOrgCode = defOrg.topOrgCode
    this.menuModel.topOrgName = defOrg.topOrgName
    if (this.menuModel.topOrgCode == defOrg.orgCode) {
      this.menuModel.topOrgName = defOrg.orgName
    }

    // 取到路由带过来的参数
    if (this.$route.query.node) {
      let node = JSON.parse(this.$route.query.node)
      if (this.$route.query.isUpNode === 'y') {//新增下级菜单
        this.menuModel.upMenuCode = node.menuCode
        this.menuModel.upMenuName = node.menuName
        this.menuModel.menuLevel = node.menuLevel + 1
        this.isCreate = true
        this.canSelectUpMenu = false//从新增下级单位而来，不准许选择上级菜单
      } else {//更新
        this.menuModel = node
        this.isCreate = false
        this.canSelectUpMenu = true//准许选择上级菜单
      }
    } else {
      //新增菜单
      this.isCreate = true
      this.canSelectUpMenu = true//准许选择上级菜单
    }

    let params = {}
    // params.menuCode = this.isCreate ? "" : this.menuModel.menuCode
    params.topOrgCode = JSON.parse(localStorage.magicAuthDefOrg).orgCode
    await new Promise((resolve, reject) => {
      listTreeExceptSelect(params).then(response => {
        this.menuTree = response.resultData
      }).catch(error => {
        reject(error)
      })
    })
  },
}
</script>

<style scoped>
.details-div {
  width: 100%;
  height: calc(100%);
  background-color: #FFFFFF;
}

.edit-content {
  height: 100%;
}
</style>
