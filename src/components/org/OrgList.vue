<template>
  <div class="table-list-div">
    <div class="search-bar-div">
      <el-button size="small" type="primary" v-if="hasBtn(BTN_ID.CREATE_ORG_PAGE_BTN)" @click="handleCreateOrg" style="float: right">
        新增组织
      </el-button>
<!--      <el-button
        v-if="hasBtn(BTN_ID.DELETE_ORG_BTN)"
        style="float: right;margin-right: 20px"
        size="small" type="primary"
        @click="handleAddDownUser">添加组织用户
      </el-button>-->
    </div>
    <div class="table-main-div">
      <el-table
        ref="multipleTable"
        :data="orgList"
        tooltip-effect="dark"
        height="100%"
        default-expand-all
        style="width: 100%;line-height:20px"
        row-key="id"
        :tree-props="{children: 'treeList'}"
      >
        <!--:data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"-->
        <el-table-column
          label="序号" width="60px"
          type="index">
          <template #default="scope">
            {{scope.$index + 1 + rows * (requestPage-1)}}
          </template>
        </el-table-column>
        <el-table-column
          label="组织名称"
          prop="node.orgName"
          width="250px">
        </el-table-column>
        <el-table-column
          label="组织编码"
          prop="node.orgCode"
          width="180px">
        </el-table-column>
        <el-table-column
          label="组织等级"
          prop="node.orgLevel"
          width="180px">
        </el-table-column>
<!--        <el-table-column
          label="上级组织编码"
          prop="node.upOrgCode"
          width="180px">
        </el-table-column>-->
        <el-table-column
          label="顶级组织名称"
          prop="node.topOrgName"
          width="150px">
        </el-table-column>
<!--        <el-table-column
          label="顶级组织编码"
          prop="node.topOrgCode"
          width="180px">
        </el-table-column>-->
        <el-table-column
          label="在用状态"
          width="80px">
          <template #default="scope">
            {{scope.row.node.hasBan?'否':'是'}}
          </template>
        </el-table-column>
        <el-table-column
          label="是否删除"
          width="80px">
          <template #default="scope">
            {{scope.row.node.status?'否':'是'}}
          </template>
        </el-table-column>
        <el-table-column
          label="新增时间"
          sortable
          prop="createTime"
          width="160px">
          <template #default="scope">
            {{scope.row.node.createTime}}
          </template>
        </el-table-column>
        <el-table-column
          label="最后更新时间"
          sortable
          prop="updateTime"
          width="160px">
          <template #default="scope">
            {{scope.row.node.updateTime}}
          </template>
        </el-table-column>
        <el-table-column
          min-width="320px"
          fixed="right"
          label="操作">
          <template #default="scope">
            <el-button
              v-if="hasBtn(BTN_ID.DELETE_ORG_BTN)"
              size="small"
              type="primary"
              :disabled="!scope.row.node.status"
              @click="handleAddDownOrg(scope.$index, scope.row)">新增下级
            </el-button>
            <el-button
              v-if="hasBtn(BTN_ID.EDIT_ORG_PAGE_BTN)"
              size="small"
              :disabled="!scope.row.node.status"
              @click="handleEditOrg(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              v-if="hasBtn(BTN_ID.BAN_OR_LEAVE_ORG_BTN)"
              size="small"
              type="warning"
              :disabled="!scope.row.node.status"
              @click="handleBan(scope.$index, scope.row)">{{scope.row.node.hasBan?'启用':'禁用'}}
            </el-button>
            <el-button
              v-if="hasBtn(BTN_ID.DELETE_ORG_BTN)"
              size="small"
              type="danger"
              :disabled="!scope.row.node.status"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {GLOBAL_CONTENT} from '../../utils/contentConst'
  import {orgBanOrLeave, orgDelete, orgList, orgTreeList} from "../api/org";
  import {isContain} from "../../utils/rule";
  import {routerPush} from "../../utils/request";


  export default {
    name: "OrgList",
    data() {
      return {
        orgList: [],
        requestPage: 1,
        rows: 10,
        sum: 0,
        editOrgModel: {
          id: "",
          orgName: "",
          orgCode: "",
          topOrgName: "",
          topOrgCode: "",
          upOrgCode: "",
          upOrgName: "",
          level: "",
        },
        BTN_ID: GLOBAL_CONTENT.BTN_ID
      }
    },
    computed: {},
    methods: {
      hasBtn: function (btnId) {
        return true;
      },
      handleCreateOrg() {
        routerPush(GLOBAL_CONTENT.ROUTER_PATH.ORG_CREATE)
      },
      handleEditOrg(index, row) {
        routerPush({path: GLOBAL_CONTENT.ROUTER_PATH.ORG_CREATE, query: {node: JSON.stringify(row.node), isUpNode: "n"}});
      },
      handleAddDownOrg(index, row) {
        routerPush({path: GLOBAL_CONTENT.ROUTER_PATH.ORG_CREATE, query: {node: JSON.stringify(row.node), isUpNode: "y"}});
      },
      handleBan(index, row) {
        let params = {
          id: row.node.id,
          hasBan: !row.node.hasBan
        }
        new Promise((resolve, reject) => {
          orgBanOrLeave(params).then(response => {
            if (response.result) {
              this.$message({
                message: row.node.hasBan ? '启用成功' : '禁用成功',
                type: 'success'
              })
              row.node.hasBan = !row.node.hasBan;
            }
          }).catch(error => {
            reject(error)
          })
        })
      },
      handleDelete(index, row) {
        console.log(index, row);
        let params = {
          id: row.node.id
        }
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          new Promise((resolve, reject) => {
            orgDelete(params).then(response => {
              if (response.result) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                })
                this.handleCurrentChange();
              }
            }).catch(error => {
              reject(error)
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      handleSizeChange(val) {
        this.rows = val
        this.searchList()
      },
      handleCurrentChange() {
        let params = {}
        params.topOrgCode = JSON.parse(localStorage.magicAuthDefOrg).orgCode
        //检查用户是不是超级管理员
        // let signinerRoles = []
        // signinerRoles = JSON.parse(localStorage.magicAtuhRoles)
        // if (isContain(signinerRoles, "admin")) {
        //   params = {}
        // }
        new Promise((resolve, reject) => {
          orgTreeList(params).then(response => {
            this.orgList = response.resultData
          }).catch(error => {
            reject(error)
          })
        })
      },
      searchList() {
        this.handleCurrentChange()
      },
      handleClose(done) {
        done();
      },
    },
    created() {
      this.searchList();
    },
    components: {
      // OrgOrg: OrgOrg
    }
  }
</script>

<style scoped>
  .table-list-div {
    width: 100%;
    height: calc(100%);
    background-color: #FFFFFF;
  }

  .search-bar-div {
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 20px;
    height: 20px;
    /*    background-color: #42b983;*/
  }

  .table-main-div {
    height: calc(100% - 170px);
    margin: 20px;
    /* background-color: #42b983;*/
  }

  .page-bar-div {
    height: 30px;
    line-height: 30px;
    /*background-color: #0a99e3;*/
    width: 100%;
  }

  .pageBar {
    height: 30px;
    line-height: 30px;
    right: 2%;
    position: absolute;
    /*margin-bottom: 0px;*/
  }
</style>
