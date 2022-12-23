<template>
  <div class="details-div">
    <el-card class="box-card content-main" :body-style="{ padding: '0',height:'calc(100% - 40px)' }">
      <div slot="header" class="clearfix">
        <span> <label>添加组织用户</label></span>
      </div>
      <div class="text item content-main">
        <el-row style="height: 100%">
          <el-col :span="8" style="height: 100%">
            <el-card :body-style="{ padding: '20px',height:'100%' }" class="content-main">
              <div slot="header" class="clearfix">
                <span> <label>选择组织</label></span>
              </div>
              <el-tree
                :data="orgList"
                show-checkbox
                node-key="id"
                ref="orgTree"
                default-expand-all
                highlight-current
                :accordion="true"
                :check-strictly="true"
                :props="orgProps"
                @check="setOrgSelectedNode"
              >
              </el-tree>
            </el-card>
          </el-col>
          <el-col :span="16" style="height: 100%">
            <el-card style="height: 50%" :body-style="{height:'calc(100% - 100px)'}">
              <div slot="header" class="clearfix">
                <span> <label>当前组织用户</label></span>
                <div style="float: right">
                  <el-input v-model="hasAddUser.userName" placeholder="用户名" size="small"
                            style="float: left;margin:0 15px 0 0;width: 100px;line-height:10px" clearable/>
                  <el-input v-model="hasAddUser.account" placeholder="账号" size="small"
                            style="float: left;margin:0 15px 0 0;width: 100px;line-height:10px" clearable/>
                  <el-input v-model="hasAddUser.mobile" placeholder="手机号" size="small"
                            style="float: left;margin:0 15px 0 0;width: 100px;line-height:10px" clearable/>
                  <el-input v-model="hasAddUser.email" placeholder="邮箱" size="small"
                            style="float: left;margin:0 40px 0 0;width: 100px;line-height:10px " clearable/>
                  <el-button size="small" type="success" @click="getHasOrgUserList" style="float: left">查找
                  </el-button>
                  <el-button size="small" type="danger" @click="toggleSelection()">批量移除</el-button>
                </div>
              </div>
              <el-table
                ref="multipleTable"
                :data="hasAddList"
                tooltip-effect="dark"
                style="width: 100%;"
                max-height=250
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  prop="userName"
                  label="姓名"
                  width="120">
                </el-table-column>
                <el-table-column
                  prop="account"
                  label="账号"
                  width="120">
                </el-table-column>
                <el-table-column
                  prop="orgName"
                  label="挂靠组织"
                  width="250">
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template #default="scope">
                    <el-button
                      v-if="hasBtn(BTN_ID.EDIT_USER_PAGE_BTN)"
                      size="small"
                      :disabled="!scope.row.status"
                      @click="handleRemoveUserOrg(scope.$index, scope.row)">移除
                    </el-button>
                    <el-button
                      v-if="hasBtn(BTN_ID.EDIT_USER_PAGE_BTN)"
                      size="small"
                      :disabled="!scope.row.status"
                      @click="handleChangeUserOrg(scope.$index, scope.row)">更换组织
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
            <el-card style="height: 50%" :body-style="{height:'calc(100% - 100px)' }">
              <div slot="header" class="clearfix">
                <span> <label>可添加组织用户</label></span>
                <div style="float: right;">
                  <el-input v-model="canAddUser.userName" placeholder="用户名" size="small"
                            style="float: left;margin:0 15px 0 0;width: 100px;line-height:10px" clearable/>
                  <el-input v-model="canAddUser.account" placeholder="账号" size="small"
                            style="float: left;margin:0 15px 0 0;width: 100px;line-height:10px" clearable/>
                  <el-input v-model="canAddUser.mobile" placeholder="手机号" size="small"
                            style="float: left;margin:0 15px 0 0;width: 100px;line-height:10px" clearable/>
                  <el-input v-model="canAddUser.email" placeholder="邮箱" size="small"
                            style="float: left;margin:0 40px 0 0;width: 100px;line-height:10px " clearable/>
                  <el-button size="small" type="success" style="float: left">查找
                  </el-button>
                  <el-button size="small" type="primary" @click="toggleSelection()">批量添加</el-button>
                </div>
              </div>
              <el-table
                ref="multipleTable"
                :data="canAddList"
                tooltip-effect="dark"
                style="width: 100%"
                max-height=250
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  prop="userName"
                  label="姓名"
                  width="120">
                </el-table-column>
                <el-table-column
                  prop="account"
                  label="账号"
                  width="120">
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template #default="scope">
                    <el-button
                      v-if="hasBtn(BTN_ID.EDIT_USER_PAGE_BTN)"
                      size="small"
                      :disabled="!scope.row.status"
                      @click="handleAddUserOrg(scope.$index, scope.row)">添加
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>


    <el-dialog
      v-model="dialogVisible"
      width="50%"
      center
      :showClose="false"
      :before-close="handleSelectOrgUserCancel">
      <div>
        <span> <label>变更用户归属组织</label></span>
        <el-button style="float: right;" size="small" type="primary" @click="handleCancel">返回</el-button>
      </div>
      <el-divider></el-divider>
      <el-tree
        :data="orgTree"
        show-checkbox
        node-key="id"
        ref="tree"
        default-expand-all
        highlight-current
        :accordion="true"
        :props="defaultProps"
        :check-strictly="true"
        @check="setSelectedNode"
      >
      </el-tree>
      <el-divider></el-divider>
      <span slot="footer" class="dialog-footer">
          <el-button style="margin-right: 40px"
                     @click="handleSelectOrgUserCancel">取消
          </el-button>
          <el-button type="primary" @click="handleSelectOrgUser()">确认
          </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {GLOBAL_CONTENT} from "../../utils/contentConst";
  import {
    addOrgUser,
    listTreeExceptSelect,
    orgCreate,
    orgTreeList,
    orgUpdate,
    removeOrgUser,
    updateUserList
  } from "../api/org";
  import {isContain, RULE_VALIDATE} from "../../utils/rule";
  import {listByAddOrgUser, listByOrgUser} from "../api/user";

  export default {
    name: "AddUser",
    data() {
      return {
        orgNode: {
          id: "",
          orgName: "",
          orgCode: "",
          upOrgName: "",
          topOrgName: "",
          topOrgCode: "",
          upOrgCode: "",
          level: "",
        },
        selectOrgTemp: {},
        orgList: [],
        orgProps: {
          children: 'treeList',
          label: 'name'
        },
        hasAddList: [],
        canAddList: [],
        hasAddUser: {
          userName: "",
          account: "",
          mobile: "",
          email: "",
        },
        canAddUser: {
          userName: "",
          account: "",
          mobile: "",
          email: "",
        },
        dialogVisible: false,
        changOrgUserTemp: {
          userAccount: "",
          orgCode: "",
          topOrgCode: "",
        },
        orgTree: [],
        defaultProps: {
          children: 'treeList',
          label: 'name'
        },

        BTN_ID: GLOBAL_CONTENT.BTN_ID,
      }
    },

    methods: {
      hasBtn: function (btnId) {
        return true;
      },
      handleCancel() {
        this.orgNode = {}
        this.$router.push(GLOBAL_CONTENT.ROUTER_PATH.ORG_LIST);
      },

      /**
       * 获取组织树
       */
      getOrgTree() {
        new Promise((resolve, reject) => {
          orgTreeList({
            topOrgCode: JSON.parse(localStorage.magicAuthDefOrg).topOrgCode,
          }).then(response => {
            this.orgList = response.resultData
          }).catch(error => {
            reject(error)
          })
        })
      },
      //选中树节点
      setOrgSelectedNode(data, obj) {
        this.$refs.orgTree.setCheckedNodes([data])
        this.selectOrgTemp = data.node
        this.listByAddOrgUser()
      },
      //查询当前组织人员关系
      listByAddOrgUser() {
        let params = {
          topOrgCode: this.selectOrgTemp.topOrgCode,
          orgCode: this.selectOrgTemp.topOrgCode === this.selectOrgTemp.orgCode ? "" : this.selectOrgTemp.orgCode
        }
        new Promise((resolve, reject) => {
          listByAddOrgUser(params).then(response => {
            this.hasAddList = response.resultData.hasAddList
            this.canAddList = response.resultData.canAddList
          }).catch(error => {
            reject(error)
          })
        })
      },
      //为组织树添加人员
      handleAddUserOrg(index, row) {
        let params = {
          userAccount: row.account,
          orgCode: this.selectOrgTemp.orgCode,
          topOrgCode: this.selectOrgTemp.topOrgCode
        }
        new Promise((resolve, reject) => {
          addOrgUser(params).then(response => {
            if (response.result) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
            }
            this.listByAddOrgUser()
          }).catch(error => {
            reject(error)
          })
        })
      },
      //移除人员
      handleRemoveUserOrg(index, row) {
        let params = {
          topOrgCode: this.selectOrgTemp.topOrgCode,
          userAccount: row.account,
        }
        new Promise((resolve, reject) => {
          removeOrgUser(params).then(response => {
            if (response.result) {
              this.$message({
                message: '移除成功',
                type: 'success'
              })
            }
            this.listByAddOrgUser()
          }).catch(error => {
            reject(error)
          })
        })
      },
      //更换人员组织
      handleChangeUserOrg(index, row) {
        this.dialogVisible = true;
        this.changOrgUserTemp.userAccount = row.account
        new Promise((resolve, reject) => {
          listTreeExceptSelect({
            "topOrgCode": row.topOrgCode
          }).then(response => {
            this.orgTree = response.resultData
          }).catch(error => {
            reject(error)
          })
        })
      },
      //查询已经存在的人员
      getHasOrgUserList() {
        let params = this.hasAddUser
        params.topOrgCode = this.selectOrgTemp.topOrgCode
        params.orgCode = this.selectOrgTemp.topOrgCode === this.selectOrgTemp.orgCode ? "" : this.selectOrgTemp.orgCode
        new Promise((resolve, reject) => {
          listByAddOrgUser(params).then(response => {
            this.hasAddList = response.resultData.hasAddList
          }).catch(error => {
            reject(error)
          })
        })
      },
      toggleSelection(rows) {
        if (rows) {
          let params = {
            model: null,
            modelList: []
          }
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
            let model = {
              userAccount: row.account,
              orgCode: this.selectOrgTemp.orgCode,
              topOrgCode: this.selectOrgTemp.topOrgCode
            }
            params.modelList.push(model)
          });
          alert(JSON.stringify(params))

          new Promise((resolve, reject) => {
            updateUserList(params).then(response => {
              if (response.result) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
              }
              this.listByAddOrgUser()
            }).catch(error => {
              reject(error)
            })
          })
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },


      selectOrgDialog() {
        this.dialogVisible = true;
        new Promise((resolve, reject) => {
          listTreeExceptSelect(this.isCreate ? {} : {"orgCode": this.orgNode.orgCode}).then(response => {
            this.orgTree = response.resultData
          }).catch(error => {
            reject(error)
          })
        })
      },
      handleSelectOrgUser() {
        new Promise((resolve, reject) => {
          addOrgUser(this.changOrgUserTemp).then(response => {
            if (response.result) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
            }
            this.listByAddOrgUser()
          }).catch(error => {
            reject(error)
          })
        })
        this.dialogVisible = false;
      },
      handleSelectOrgUserCancel() {
        this.changOrgUserTemp = {
          userAccount: "",
          orgCode: "",
          topOrgCode: "",
        }
        this.dialogVisible = false;
      },
      setSelectedNode(data, obj) {
        this.$refs.tree.setCheckedNodes([data])
        this.changOrgUserTemp.topOrgCode = data.node.topOrgCode
        this.changOrgUserTemp.orgCode = data.node.orgCode
      },
    },
    created() {
      //检查用户是不是超级管理员
      let signinerRoles = []
      signinerRoles = JSON.parse(localStorage.magicAtuhRoles)
      this.getOrgTree();
    },
  }
</script>

<style scoped>
  .details-div {
    width: 100%;
    height: calc(100%);
    background-color: #FFFFFF;
  }

  .content-main {
    height: 100%;
    margin: 0;
  }
</style>
