<template>
  <div class="table-list-div">
    <div class="search-bar-div">
      <el-input size="small" v-model="accountModel.userName" placeholder="用户名"
                style="float: left;margin:0 15px 0 0;width: 200px;line-height:20px" clearable/>
      <el-input size="small" v-model="accountModel.account" placeholder="账号"
                style="float: left;margin:0 15px 0 0;width: 200px;line-height:20px" clearable/>
      <el-input size="small" v-model="accountModel.mobile" placeholder="手机号"
                style="float: left;margin:0 15px 0 0;width: 200px;line-height:20px" clearable/>
      <el-input size="small" v-model="accountModel.email" placeholder="邮箱"
                style="float: left;margin:0 40px 0 0;width: 200px;line-height:20px " clearable/>
      <el-button size="small" type="primary" @click="reset()" style="float: left">重置
      </el-button>
      <el-button size="small" type="primary" @click="searchList()" style="float: left">查找
      </el-button>
      <el-button size="small" type="primary" v-if="hasBtn(BTN_ID.CREATE_USER_PAGE_BTN)" @click="handleCreate"
                 style="float: right">
        新增用户
      </el-button>
<!--      <el-button size="small" type="primary" v-if="hasBtn(BTN_ID.ADD_USER_PAGE_BTN)" @click="handleAddOrgUser"
                 style="float: right">
        添加用户
      </el-button>-->
    </div>
    <div class="table-main-div">
      <el-table
        ref="multipleTable"
        :data="userList"
        tooltip-effect="dark"
        height="100%"
        style="width: 100%;line-height:20px">
        <!--:data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"-->
        <el-table-column
          label="序号" width="60px"
          type="index">
          <template #default="scope">
            {{scope.$index + 1 + rows * (requestPage-1)}}
          </template>
        </el-table-column>
        <el-table-column
          label="姓名"
          prop="userName"
          width="140px">
        </el-table-column>
        <el-table-column
          label="账号"
          prop="account"
          width="140px">
        </el-table-column>
        <el-table-column
          label="手机号"
          prop="mobile"
          width="120px">
        </el-table-column>
        <el-table-column
          label="邮箱"
          width="220px"
          prop="email">
        </el-table-column>
        <el-table-column
          label="在用状态"
          width="100px">
          <template #default="scope">
            {{scope.row.hasBan?'否':'是'}}
          </template>
        </el-table-column>
<!--        <el-table-column
          label="是否被删除"
          width="100px">
          <template #default="scope">
            {{scope.row.status?'否':'是'}}
          </template>
        </el-table-column>-->
        <el-table-column
          label="新增时间"
          sortable
          width="160px"
          prop="createTime">
          <template #default="scope">
            {{scope.row.createTime}}
          </template>
        </el-table-column>
        <el-table-column
          label="最后更新时间"
          sortable
          width="160px"
          prop="updateTime">
          <template #default="scope">
            {{scope.row.updateTime}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right">
          <template #default="scope">
            <el-button
              v-if="hasBtn(BTN_ID.EDIT_USER_PAGE_BTN)"
              size="small"
              :disabled="!scope.row.status"
              @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              v-if="hasBtn(BTN_ID.EDIT_USER_PAGE_BTN)"
              size="small"
              :disabled="!scope.row.status"
              @click="handleUserRole(scope.$index, scope.row)">角色
            </el-button>
            <el-button
                v-if="hasBtn(BTN_ID.REST_USER_PASS_BTN)"
                size="small"
                :disabled="!scope.row.status"
                @click="handleResetPass(scope.$index, scope.row)">重置密码
            </el-button>
            <el-button
              v-if="hasBtn(BTN_ID.BAN_OR_LEAVE_USER_BTN)"
              size="small"
              type="warning"
              :disabled="!scope.row.status"
              @click="handleBan(scope.$index, scope.row)">{{scope.row.hasBan?'启用':'禁用'}}
            </el-button>
            <el-button
              v-if="hasBtn(BTN_ID.DELETE_USER_BTN)"
              size="small"
              type="danger"
              :disabled="!scope.row.status"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
            <el-button
              v-if="hasBtn(BTN_ID.DELETE_USER_BTN)"
              size="small"
              type="danger"
              :disabled="!scope.row.status"
              @click="handleDeleteOrgUser(scope.$index, scope.row)">移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-bar-div">
      <el-pagination background
                     class="pageBar"
                     @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
                     layout="total, sizes, prev, pager, next, jumper"
                     :current-page="requestPage"
                     :page-size="rows"
                     :page-sizes="[10, 14, 20, 50, 100, 200]"
                     :total="sum">
      </el-pagination>
    </div>
    <el-dialog
      v-model="showUserRoleDialog"
      width="50%"
      :before-close="dialogHandleClose"
      center
      :showClose="false">
      <div>
        <span>  <label>用户：{{selectUser.userName}}</label> </span>
        <el-button style="float: right;" size="small" @click="dialogHandleClose">取消</el-button>
      </div>
      <el-divider></el-divider>
      <el-checkbox-group v-model="userRoleIdList">
        <el-checkbox v-for="model in roleList" :key="'userRole'+ model.id" :label="model.id"
                     @change="addOrRemove(model)">{{model.roleName}}
        </el-checkbox>
      </el-checkbox-group>
    </el-dialog>

  </div>
</template>

<script>
  import {GLOBAL_CONTENT} from '../../utils/contentConst'
  import {
    userDelete,
    userList,
    userBanOrLeave,
    userRoleAdd,
    userRoleRemove,
    listByOrgUser,
    resetPassword
  } from "../api/user";
  import {roleList, roleListByUserId} from "../api/role";
  import {isContain} from "../../utils/rule";
  import {removeOrgUser} from "../api/org";
  import {routerPush} from "../../utils/request";


  export default {
    name: "UserList",
    data() {
      return {
        userList: [],
        requestPage: 1,
        rows: 10,
        sum: 0,
        accountModel: {
          userName: "",
          account: "",
          mobile: "",
          email: "",
          hasBan: "",
          status: "",
          topOrgCode: "",
          orgCode: ""
        },
        selectUser: {},
        roleList: [],
        userRoleIdList: [],
        userRoleIdOldList: [],
        showUserRoleDialog: false,
        BTN_ID: GLOBAL_CONTENT.BTN_ID
      }
    },
    computed: {},
    methods: {
      hasBtn: function (btnId) {
        return true;
      },
      handleCreate() {
        routerPush(GLOBAL_CONTENT.ROUTER_PATH.USER_CREATE);
      },
      handleEdit(index, row) {
        routerPush({path: GLOBAL_CONTENT.ROUTER_PATH.USER_CREATE, query: row});
      },
      handleBan(index, row) {
        let params = {
          id: row.id,
          hasBan: !row.hasBan
        }
        new Promise((resolve, reject) => {
          userBanOrLeave(params).then(response => {
            if (response.result) {
              this.$message({
                message: row.hasBan ? '启用成功' : '禁用成功',
                type: 'success'
              })
              row.hasBan = !row.hasBan;
            }
          }).catch(error => {
            reject(error)
          })
        })
      },
      handleDelete(index, row) {
        console.log(index, row);
        let params = {
          id: row.id
        }
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          new Promise((resolve, reject) => {
            userDelete(params).then(response => {
              if (response.result) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                })
                this.handleCurrentChange(this.requestPage);
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

      handleDeleteOrgUser(index, row) {
        let params = {
          topOrgCode: JSON.parse(localStorage.magicAuthDefOrg).orgCode,
          userAccount: row.account,
        }
        this.$confirm('是否确认移除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          new Promise((resolve, reject) => {
            removeOrgUser(params).then(response => {
              if (response.result) {
                this.$message({
                  message: '移除成功',
                  type: 'success'
                })
              }
              this.handleCurrentChange(this.requestPage);
            }).catch(error => {
              reject(error)
            })
          })
        })
      },
      handleUserRole(index, row) {
        this.showUserRoleDialog = true;
        this.selectUser = row;
        let params = {
          id: row.id
        }
        new Promise((resolve, reject) => {
          roleListByUserId(params).then(response => {
            response.resultData.forEach(it => {
              this.userRoleIdList.push(it.id)
              this.userRoleIdOldList.push(it.id)
            })

          }).catch(error => {
            reject(error)
          })
        })
      },
      handleResetPass(index, row) {
        let params = {
          orgCode: row.orgCode,
          topOrgCode: row.topOrgCode,
          userAccount: row.account,
        }
        this.$confirm('是否确认重置密码?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          new Promise((resolve, reject) => {
            resetPassword(params).then(response => {
              if (response.result) {
                this.$message({
                  message: '重置成功',
                  type: 'success'
                })
              }
              this.handleCurrentChange(this.requestPage);
            }).catch(error => {
              reject(error)
            })
          })
        })
      },
      addOrRemove(model) {
        let param = {
          userAccount: this.selectUser.account,
          roleCode: model.roleCode,
          topOrgCode: JSON.parse(localStorage.magicAuthDefOrg).orgCode
        }
        if (isContain(this.userRoleIdOldList, model.id)) {
          new Promise((resolve, reject) => {
            userRoleRemove(param).then(response => {
              if (response.result) {
                this.userRoleIdOldList = this.userRoleIdList
                this.$message({
                  message: '移除角色成功',
                  type: 'success'
                })
              }
            }).catch(error => {
              this.userRoleIdList = this.userRoleIdOldList
              reject(error)
            })
          })
        } else {
          new Promise((resolve, reject) => {
            userRoleAdd(param).then(response => {
              if (response.result) {
                this.userRoleIdOldList = this.userRoleIdList
                this.$message({
                  message: '添加角色成功',
                  type: 'success'
                })
              }
            }).catch(error => {
              this.userRoleIdList = this.userRoleIdOldList
              reject(error)
            })
          })
        }
      },
      dialogHandleClose() {
        this.selectUser = {}
        this.userRoleIdList = []
        this.userRoleIdOldList = []
        this.showUserRoleDialog = false
      },
      handleSizeChange(val) {
        this.rows = val
        this.searchList()
      },
      handleCurrentChange(val) {
        this.accountModel.topOrgCode = JSON.parse(localStorage.magicAuthDefOrg).orgCode
        let requestParams = {
          requestPage: val,
          rows: this.rows,
          model: this.accountModel,
        };
        new Promise((resolve, reject) => {
          listByOrgUser(requestParams).then(response => {
            this.userList = response.resultData
            this.sum = response.sum
            this.requestPage = response.requestPage
          }).catch(error => {
            reject(error)
          })
        })
      },
      searchList() {
        this.handleCurrentChange(1)
      },
      reset() {
        this.accountModel = {
          userName: "",
          account: "",
          mobile: "",
          email: "",
          hasBan: "",
          status: "",
        }
      },
      handleClose(done) {
        done();
      },
    },
    created() {
      this.searchList();
      let params = {
        getAll: true,
        model: {topOrgCode: JSON.parse(localStorage.magicAuthDefOrg).orgCode}
      }
      new Promise((resolve, reject) => {
        roleList(params).then(response => {
          this.roleList = response.resultData
        }).catch(error => {
          reject(error)
        })
      })
    },
    components: {
      // UserRole: UserRole
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
