<template>
  <div class="table-list-div">
    <div class="search-bar-div">
      <el-input size="small" v-model="permissionModel.permissionUrl" placeholder="接口路径"
                style="float: left;margin:0 15px 0 0;width: 200px;line-height:20px" clearable/>
      <el-button size="small" type="primary" @click="reset()" style="float: left">重置
      </el-button>
      <el-button size="small" type="primary" @click="searchList()" style="float: left">查找
      </el-button>
      <el-button size="small" type="primary" v-if="hasBtn(BTN_ID.CREATE_USER_PAGE_BTN)" @click="handleCreate" style="float: right">
        创建接口
      </el-button>
    </div>
    <div class="table-main-div">
      <el-table
        ref="multipleTable"
        :data="permissionList"
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
          label="接口路径"
          prop="permissionUrl"
          width="500px">
        </el-table-column>
        <el-table-column
          min-width="180px"
          fixed="right"
          label="操作">
          <template #default="scope">
            <el-button
              v-if="hasBtn(BTN_ID.EDIT_USER_PAGE_BTN)"
              size="small"
              @click="handleEdit(scope.$index, scope.row)">编辑
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

<!--    <el-drawer
      v-model="dialogVisible"
      direction="rtl"
      :before-close="editPermissionHandleClose">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <label>接口{{editPermissionModel.id?'编辑':'创建'}}</label>
        </div>
        <el-form ref="rulesForm" :rules="rules" :model="editPermissionModel" label-width="200px">
          <el-form-item label="接口路径:" prop="permissionUrl">
            <el-input v-model="editPermissionModel.permissionUrl" style="width:300px" maxlength="50" clearable/>
            <label>长度1-50个字符</label>
          </el-form-item>
          <el-form-item>
            <el-button  style="margin-right: 40px"
                       @click="editPermissionHandleClose">取消
            </el-button>
            <el-button type="primary"  @click="handleEditPermission()">
              {{editPermissionModel.id?"更新":"创建"}}
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-drawer>-->


        <el-dialog
          v-model="dialogVisible"
          width="50%"
          center>
          <div slot="header" class="clearfix">
            <label>接口{{editPermissionModel.id?'编辑':'创建'}}</label>
          </div>
          <el-form ref="rulesForm" :rules="rules" :model="editPermissionModel" label-width="200px">
            <el-form-item label="接口路径:" prop="permissionUrl">
              <el-input v-model="editPermissionModel.permissionUrl" style="width:300px" maxlength="50" clearable/>
              <label>长度1-50个字符</label>
            </el-form-item>
            <el-form-item>
              <el-button  style="margin-right: 40px"
                          @click="editPermissionHandleClose">取消
              </el-button>
              <el-button type="primary"  @click="handleEditPermission()"> {{editPermissionModel.id?"更新":"创建"}}
              </el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

  </div>
</template>

<script>
  import {GLOBAL_CONTENT} from '../../utils/contentConst'
  import {
    permissionDelete,
    permissionList,
    permissionCreate,
    permissionUpdate
  } from "../api/permission";
  import {isContain, RULE_VALIDATE} from "../../utils/rule";

  export default {
    name: "PermissionList",
    data() {
      return {
        permissionList: [],
        requestPage: 1,
        rows: 10,
        sum: 0,
        permissionModel: {
          permissionUrl: "",
        },
        editPermissionModel: {
          id: '',
          permissionUrl: "",
        },
        dialogVisible: false,
        BTN_ID: GLOBAL_CONTENT.BTN_ID,
        rules: {
          // 要以数组形式展示
          permissionUrl: [
            {required: true, message: "接口路径不能为空", trigger: "blur"},
            {min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur"}
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
        this.dialogVisible = true
      },
      handleEdit(index, row) {
        this.editPermissionModel = row
        this.dialogVisible = true
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
            permissionDelete(params).then(response => {
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
      editPermissionHandleClose() {
        this.editPermissionModel = {
          id: "",
          permissionUrl: "",
        }
        this.dialogVisible = false
      },
      handleEditPermission() {
        let params = this.editPermissionModel
        new Promise((resolve, reject) => {
          if (params.id) {
            permissionUpdate(params).then(response => {
              if (response.result) {
                this.$message({
                  message: '更新成功',
                  type: 'success'
                })
                this.handleCurrentChange(this.requestPage)
                this.editPermissionHandleClose()
              }
            }).catch(error => {
              reject(error)
            })
          } else {
            permissionCreate(params).then(response => {
              if (response.result) {
                this.$message({
                  message: '创建成功',
                  type: 'success'
                })
                this.searchList()
                this.editPermissionHandleClose()
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
          model: this.permissionModel,
        };
        new Promise((resolve, reject) => {
          permissionList(requestParams).then(response => {
            this.permissionList = response.resultData
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
        this.permissionModel = {
          id: "",
          permissionUrl: "",
        }
      },
      handleClose(done) {
        done();
      },
    },
    created() {
      this.searchList();
    },
    components: {
      // UserPermission: UserPermission
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
