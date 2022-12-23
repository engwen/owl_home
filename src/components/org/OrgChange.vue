<template>
  <div class="details-div">
    <el-card class="box-card edit-content">
      <div slot="header" class="clearfix">
        <span> <label>组织{{ orgModel.id ? '编辑' : '创建' }}</label></span>
      </div>
      <div class="text item">
        <el-form ref="rulesForm" :rules="rules" :model="orgModel" label-width="200px">
          <el-form-item label="组织名称:" prop="orgName">
            <el-input v-model="orgModel.orgName" style="width:300px" maxlength="50" clearable/>
            <label>长度1-50个字符</label>
          </el-form-item>
          <el-form-item label="组织编码:" prop="orgCode">
            <el-input v-model="orgModel.orgCode" style="width:300px" maxlength="50" clearable :disabled="!isCreate"/>
            <label>长度2-50个字符</label>
          </el-form-item>
          <el-form-item label="上级组织名称:" prop="upOrgCode">
            <el-tree-select style="width:300px" maxlength="50" clearable
                            placeholder="上级组织名称"
                            v-model="orgModel.upOrgCode"
                            :data="orgTree"
                            node-key="id"
                            ref="tree"
                            :props="defaultProps"
                            :render-after-expand="false"
                            @check="setSelectedNode"
                            check-strictly
                            show-checkbox
                            default-expand-all
                            highlight-current
                            accordion
            />
            <label>请选择上级组织</label>
          </el-form-item>
          <el-form-item label="上级组织编码:" prop="upOrgCode">
            <el-input v-model="orgModel.upOrgCode" style="width:300px" maxlength="50" clearable
                      :disabled="true"/>
            <label>自动带出</label>
          </el-form-item>
          <el-form-item label="顶级组织名称:" prop="topOrgName">
            <el-input v-model="orgModel.topOrgName" style="width:300px" maxlength="50" clearable
                      :disabled="true"/>
            <label>自动带出</label>
          </el-form-item>
          <el-form-item label="顶级组织编码:" prop="topOrgCode">
            <el-input v-model="orgModel.topOrgCode" style="width:300px" maxlength="50" clearable
                      :disabled="true"/>
            <label>自动带出</label>
          </el-form-item>
          <el-form-item label="组织等级:" prop="level">
            <el-input-number v-model="orgModel.orgLevel" style="width:300px" controls-position="right"
                             :min="miniOrgLevel"
                             :max="999">
            </el-input-number>
            <label>长度1-3个字符</label>
          </el-form-item>
          <el-form-item>
            <el-button style="margin-right: 40px"
                       @click="handleCancel">取消
            </el-button>
            <el-button type="primary" @click="handleCreate()"> {{ orgModel.id ? "更新" : "创建" }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import {GLOBAL_CONTENT} from "../../utils/contentConst";
import {listTreeExceptSelect, orgCreate, orgTreeList, orgUpdate} from "../api/org";
import {isContain, RULE_VALIDATE} from "../../utils/rule";

export default {
  name: "Create",
  data() {
    return {
      orgModel: {
        id: "",
        orgName: "",
        orgCode: "",
        upOrgName: "",
        topOrgName: "",
        topOrgCode: "",
        upOrgCode: "",
        level: "",
      },
      BTN_ID: GLOBAL_CONTENT.BTN_ID,
      isCreate: true,
      canSelectUpOrg: true,
      miniOrgLevel: 0,
      dialogVisible: false,
      orgTree: [],
      defaultProps: {
        children: 'treeList',
        label: 'name'
      },
      rules: {
        // 要以数组形式展示
        orgName: [
          {min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur"}
        ],
        // 要以数组形式展示
        orgCode: [
          {required: true, message: "组织编码不能为空", trigger: "blur"},
          {min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur"}
        ],
        upOrgCode: [
          {min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur"}
        ],
        topOrgCode: [
          {min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur"}
        ],
      },
    }
  },
  inject: ['reload'],
  methods: {
    handleCancel() {
      this.isCreate = true
      this.orgModel = {
        id: "",
        orgName: "",
        orgCode: "",
        topOrgName: "",
        topOrgCode: "",
        upOrgCode: "",
        level: "",
      }
      this.$router.push(GLOBAL_CONTENT.ROUTER_PATH.ORG_LIST);
    },
    handleCreate() {
      this.$refs['rulesForm'].validate(valid => {
        if (valid) {
          if (this.isCreate) {
            if (!this.orgModel.topOrgCode && this.orgModel.orgLevel === 0) {
              this.orgModel.topOrgCode = this.orgModel.orgCode
            }
            new Promise((resolve, reject) => {
              orgCreate(this.orgModel).then(response => {
                if (response.result) {
                  this.$message({
                    message: '创建成功',
                    type: 'success'
                  })
                  localStorage.setItem("magicAuthSignerOrgList", "")
                  // this.reload();
                  this.$router.push(GLOBAL_CONTENT.ROUTER_PATH.ORG_LIST);
                }
              }).catch(error => {
                reject(error)
              })
            })
          } else {
            new Promise((resolve, reject) => {
              orgUpdate(this.orgModel).then(response => {
                if (response.result) {
                  this.$message({
                    message: '更新成功',
                    type: 'success'
                  })
                  this.$router.push(GLOBAL_CONTENT.ROUTER_PATH.ORG_LIST);
                }
              }).catch(error => {
                reject(error)
              })
            })
          }
        }
      })
    },
    setSelectedNode(data, obj) {
      this.orgModel.upOrgCode = data.id
      this.orgModel.upOrgName = data.node.orgName
      this.orgModel.topOrgCode = data.node.topOrgCode
      let defOrg = JSON.parse(localStorage.magicAuthDefOrg)
      if (defOrg.topOrgCode == defOrg.orgCode && !data.node.topOrgName) {
        this.orgModel.topOrgName = defOrg.orgName
      } else {
        this.orgModel.topOrgName = data.node.topOrgName
      }
      this.orgModel.orgLevel = data.node.orgLevel + 1
    },
  },
  created() {
    // 取到路由带过来的参数
    if (this.$route.query.node) {
      let node = JSON.parse(this.$route.query.node)
      if (this.$route.query.isUpNode === 'y') {//新增下级组织
        this.orgModel.upOrgCode = node.orgCode
        this.orgModel.upOrgName = node.orgName
        this.orgModel.orgLevel = node.orgLevel + 1
        this.isCreate = true
        this.canSelectUpOrg = false//从新增下级单位而来，不准许选择上级组织
      } else {//更新
        this.orgModel = node
        this.isCreate = false
        this.canSelectUpOrg = true//准许选择上级组织
      }
    } else {
      //检查用户是不是超级管理员
      let signinerRoles = []
      signinerRoles = JSON.parse(localStorage.magicAtuhRoles)
      if (isContain(signinerRoles, "admin")) {
        //新增组织
        this.isCreate = true
        this.canSelectUpOrg = true//准许选择上级组织
        this.miniOrgLevel = 0
      }
    }

    let defOrg = JSON.parse(localStorage.magicAuthDefOrg)
    this.orgModel.topOrgCode = defOrg.topOrgCode
    this.orgModel.topOrgName = defOrg.topOrgName
    if (defOrg.topOrgCode == defOrg.orgCode && !defOrg.topOrgName) {
      this.orgModel.topOrgName = defOrg.orgName
    }

    new Promise((resolve, reject) => {
      listTreeExceptSelect(this.isCreate ? {} : {
        // "orgCode": this.orgModel.orgCode,
        "topOrgCode": this.orgModel.topOrgCode
      }).then(response => {
        this.orgTree = response.resultData
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
