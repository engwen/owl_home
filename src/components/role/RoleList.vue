<template>
  <div class="table-list-div">
    <div class="search-bar-div">
      <el-input size="small" v-model="roleModel.roleName" placeholder="角色名称"
                style="float: left;margin:0 15px 0 0;width: 200px;line-height:20px" clearable/>
      <el-input size="small" v-model="roleModel.roleCode" placeholder="角色编码"
                style="float: left;margin:0 15px 0 0;width: 200px;line-height:20px" clearable/>
      <el-button size="small" type="primary" @click="reset()" style="float: left">重置
      </el-button>
      <el-button size="small" type="primary" @click="searchList()" style="float: left">查找
      </el-button>
      <el-button size="small" type="primary" v-if="hasBtn(BTN_ID.CREATE_USER_PAGE_BTN)" @click="handleCreate"
                 style="float: right">
        新增角色
      </el-button>
    </div>
    <div class="table-main-div">
      <el-table
        ref="multipleTable"
        :data="roleList"
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
          label="角色名称"
          prop="roleName"
          width="220px">
        </el-table-column>
        <el-table-column
          label="角色编码"
          prop="roleCode"
          width="320px">
        </el-table-column>
        <el-table-column
          min-width="320px"
          fixed="right"
          label="操作">
          <template #default="scope">
            <el-button
              v-if="hasBtn(BTN_ID.EDIT_USER_PAGE_BTN)"
              size="small"
              @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              v-if="hasBtn(BTN_ID.EDIT_USER_PAGE_BTN)"
              size="small"
              @click="handleRoleMenu(scope.$index, scope.row)">菜单
            </el-button>
            <el-button
              size="small"
              @click="handleRolePermission(scope.$index, scope.row)">接口权限
            </el-button>
            <el-button
              v-if="hasBtn(BTN_ID.DELETE_USER_BTN)"
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
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
      v-model="editRoleDialogVisible"
      width="50%"
      :before-close="dialogHandleClose"
      center
      :showClose="false">
      <div>
        <span>
          <label>角色{{editRoleModel.id?'编辑':'新增'}}</label>
        </span>
        <el-button style="float: right;" size="small" @click="dialogHandleClose">取消</el-button>
      </div>
      <el-divider></el-divider>
      <el-form ref="rulesForm" :rules="rules" :model="editRoleModel" label-width="200px">
        <el-form-item label="角色名称:" prop="roleName">
          <el-input v-model="editRoleModel.roleName" style="width:300px" maxlength="50" clearable/>
          <label>长度1-20个字符</label>
        </el-form-item>
        <el-form-item label="角色编码:" prop="roleCode">
          <el-input v-model="editRoleModel.roleCode" style="width:300px" maxlength="50" clearable/>
          <label>长度1-50个字符</label>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <span slot="footer" class="dialog-footer">
        <el-button style="margin-right: 40px"
                   @click="dialogHandleClose">取消
        </el-button>
        <el-button type="primary" @click="handleEditRole()"> {{editRoleModel.id?"更新":"新增"}}
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-model="editRoleMenuDialogVisible"
      width="50%"
      :before-close="dialogHandleClose"
      center
      :showClose="false">
      <div>
        <span>
          <label>角色菜单编辑</label>
        </span>
        <el-button style="float: right;" size="small" @click="dialogHandleClose">取消</el-button>
      </div>
      <el-divider></el-divider>
      <el-tree
        :data="menuTree"
        show-checkbox
        node-key="id"
        ref="menuTree"
        highlight-current
        :accordion="true"
        :props="defaultProps"
        :check-strictly="true"
        :default-checked-keys="roleMenuList"
      >
      </el-tree>
      <el-divider></el-divider>
      <span slot="footer" class="dialog-footer">
        <el-button style="margin-right: 40px"
                   @click="dialogHandleClose">取消
        </el-button>
        <el-button type="primary" @click="handleEditRoleMenu()">更新
        </el-button>
      </span>
    </el-dialog>


    <el-dialog
      v-model="editRolePermissionDialogVisible"
      width="1100px"
      :before-close="dialogHandleClose"
      center
      :showClose="false">
      <div>
        <span>
          <label>角色权限编辑</label>
        </span>
        <el-button style="float: right;" size="small" @click="dialogHandleClose">取消</el-button>
      </div>
      <el-divider></el-divider>
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllPermission">全选
      </el-checkbox>
      <div></div>
      <el-checkbox-group style="margin: 15px 0;max-height: 500px;overflow-y: auto"
                         v-model="rolePermissionList" @change="handleCheckedPermissionChange">
        <el-checkbox v-for="permission in permissionList" :label="permission" :key="permission.id">
          <el-col :span="8" style="width: 200px">{{permission.permissionUrl}}</el-col>
        </el-checkbox>
      </el-checkbox-group>
      <el-divider></el-divider>
      <span slot="footer" class="dialog-footer">
        <el-button style="margin-right: 40px"
                   @click="dialogHandleClose">取消
        </el-button>
        <el-button type="primary" @click="handleCheckAddRolePermission()">更新
        </el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
  import {GLOBAL_CONTENT} from '../../utils/contentConst'
  import {
    roleDelete,
    roleList,
    roleCreate,
    roleUpdate, roleAddMenuList, roleAddPermissionList
  } from "../api/role";
  import {isContain, RULE_VALIDATE} from "../../utils/rule";
  import {idListByRole, menuTreeList} from "../api/menu";
  import {permissionList, permissionListByRoleId} from "../api/permission";


  export default {
    name: "RoleList",
    data() {
      return {
        roleList: [],
        requestPage: 1,
        rows: 10,
        sum: 0,
        roleModel: {
          roleName: "",
          roleCode: "",
          topOrgCode: JSON.parse(localStorage.magicAuthDefOrg).orgCode
        },
        editRoleModel: {
          id: '',
          roleName: "",
          roleCode: "",
          topOrgCode: JSON.parse(localStorage.magicAuthDefOrg).orgCode
        },
        editRoleDialogVisible: false,

        roleMenuList: [],
        menuTree: [],
        editRoleMenuDialogVisible: false,
        defaultProps: {
          children: 'treeList',
          label: 'name'
        },


        checkAll: false,
        isIndeterminate: true,

        permissionModel: {
          id: "",
          permissionUrl: "",
        },
        permissionList: [],
        rolePermissionList: [],
        editRolePermissionDialogVisible: false,

        BTN_ID: GLOBAL_CONTENT.BTN_ID,
        rules: {
          // 要以数组形式展示
          roleName: [
            {required: true, message: "角色名称不能为空", trigger: "blur"},
            {min: 1, max: 20, message: "长度在 6 到 30 个字符", trigger: "blur"}
          ],
          // 要以数组形式展示
          roleCode: [
            {required: true, message: "角色编码不能为空", trigger: "blur"},
            {min: 1, max: 50, message: "长度在 2 到 30 个字符", trigger: "blur"}
          ],
        }
      }
    },
    computed: {},
    methods: {
      hasBtn: function (btnId) {
        return true;
      },
      handleCreate() {
        this.editRoleDialogVisible = true
      },
      handleEdit(index, row) {
        this.editRoleModel = row
        this.editRoleDialogVisible = true
      },
      handleRolePermission(index, row) {
        this.editRoleModel = row
        this.editRolePermissionDialogVisible = true
        new Promise((resolve, reject) => {
          permissionListByRoleId({id: row.id}).then(response => {
            this.rolePermissionList = []
            response.resultData.forEach(it => {
              this.permissionList.forEach(permission => {
                if (it.id === permission.id) {
                  this.rolePermissionList.push(permission)
                }
              })
            })
          }).catch(error => {
            reject(error)
          })
        })
      },

      handleCheckAllPermission(val) {
        this.rolePermissionList = val ? this.permissionList : []
        this.isIndeterminate = false;
      },
      handleCheckedPermissionChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.permissionList.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.permissionList.length;
      },
      handleCheckAddRolePermission() {
        let params = {
          model: {
            roleId: this.editRoleModel.id,
            topOrgCode: this.editRoleModel.topOrgCode
          },
          modelList: []
        }
        this.rolePermissionList.forEach(it => {
          let model = {
            topOrgCode: this.roleModel.topOrgCode,
            roleId: this.editRoleModel.id,
            permissionId: it.id
          }
          params.modelList.push(model)
        })
        new Promise((resolve, reject) => {
          roleAddPermissionList(params).then(response => {
            if (response.result) {
              this.editRolePermissionDialogVisible = false
              this.rolePermissionList = []
              this.$message({
                message: '更新成功',
                type: 'success'
              })
            }
          }).catch(error => {
            reject(error)
            this.$message({
              message: '更新失败',
              type: 'warning'
            })
          })
        })
      },

      handleRoleMenu(index, row) {
        this.editRoleModel = row
        this.editRoleMenuDialogVisible = true
        let params = {
          topOrgCode: row.topOrgCode
        }
        new Promise((resolve, reject) => {
          menuTreeList(params).then(response => {
            this.menuTree = response.resultData
            this.getRoleMenuIdList()
          }).catch(error => {
            reject(error)
          })
        })
      },
      getRoleMenuIdList() {
        let params = {
          topOrgCode: this.editRoleModel.topOrgCode,
          roleCode: this.editRoleModel.roleCode
        }
        new Promise((resolve, reject) => {
          idListByRole(params).then(response => {
            this.roleMenuList = response.resultData
          }).catch(error => {
            reject(error)
          })
        })
      },
      handleEditRoleMenu() {
        console.log(this.$refs.menuTree.getCheckedNodes());
        let menuCodeList = []
        this.$refs.menuTree.getCheckedNodes().forEach(it => menuCodeList.push(it.id))
        // this.$refs.menuTree.getHalfCheckedKeys().forEach(it => menuCodeList.push(it))
        // alert(JSON.stringify(menuCodeList))
        let params = {
          topOrgCode: this.editRoleModel.topOrgCode,
          roleCode: this.editRoleModel.roleCode,
          menuCodeList: menuCodeList
        }
        new Promise((resolve, reject) => {
          roleAddMenuList(params).then(response => {
            if (response.result) {
              this.editRoleMenuDialogVisible = false
              this.roleMenuList = []
              this.$message({
                message: '更新成功',
                type: 'success'
              })
            }
          }).catch(error => {
            reject(error)
            this.$message({
              message: '更新失败',
              type: 'warning'
            })
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
            roleDelete(params).then(response => {
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
      dialogHandleClose() {
        this.editRoleModel = {
          id: "",
          roleName: "",
          roleCode: "",
          topOrgCode: JSON.parse(localStorage.magicAuthDefOrg).orgCode
        }
        this.roleMenuList = []
        this.rolePermissionList = []
        this.editRoleDialogVisible = false
        this.editRoleMenuDialogVisible = false
        this.editRolePermissionDialogVisible = false
      },
      handleEditRole() {
        let params = this.editRoleModel
        new Promise((resolve, reject) => {
          if (params.id) {
            roleUpdate(params).then(response => {
              if (response.result) {
                this.$message({
                  message: '更新成功',
                  type: 'success'
                })
                this.handleCurrentChange(this.requestPage)
                this.dialogHandleClose()
              }
            }).catch(error => {
              reject(error)
            })
          } else {
            roleCreate(params).then(response => {
              if (response.result) {
                this.$message({
                  message: '新增成功',
                  type: 'success'
                })
                this.searchList()
                this.dialogHandleClose()
              }
            }).catch(error => {
              reject(error)
            })
          }
        })
      },
      handleSizeChange(val) {
        this.rows = val
        this.searchList()
      },
      handleCurrentChange(val) {
        let requestParams = {
          requestPage: val,
          rows: this.rows,
          model: this.roleModel,
        };
        new Promise((resolve, reject) => {
          roleList(requestParams).then(response => {
            this.roleList = response.resultData
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
        this.roleModel = {
          roleName: "",
          roleCode: "",
        }
      },
      handleClose(done) {
        done();
      },
    },
    created() {
      //查询角色
      this.searchList();
      //查询权限列表
      let requestParams = {
        getAll: true,
      };
      new Promise((resolve, reject) => {
        permissionList(requestParams).then(response => {
          this.permissionList = response.resultData
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
