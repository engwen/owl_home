<template>
  <div class="table-list-div">
    <div class="search-bar-div">
      <el-input size="small" v-model="dictModel.dictCode" placeholder="字典编码"
                style="float: left;margin:0 15px 0 0;width: 200px;line-height:20px" clearable/>
      <el-input size="small" v-model="dictModel.dictName" placeholder="字典名"
                style="float: left;margin:0 15px 0 0;width: 200px;line-height:20px" clearable/>
      <el-input size="small" v-model="dictModel.itemCode" placeholder="字典项值"
                style="float: left;margin:0 15px 0 0;width: 200px;line-height:20px" clearable/>
      <el-button size="small" type="primary" @click="reset()" style="float: left">重置
      </el-button>
      <el-button size="small" type="primary" @click="searchList()" style="float: left">查找
      </el-button>
      <el-button size="small" type="primary" v-if="hasBtn(BTN_ID.CREATE_USER_PAGE_BTN)" @click="handleCreate"
                 style="float: right">
        新增字典
      </el-button>
    </div>
    <div class="table-main-div">
      <el-table
          ref="multipleTable"
          :data="dictList"
          tooltip-effect="dark"
          height="100%"
          style="width: 100%;line-height:20px">
        <!--:data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"-->
        <el-table-column
            label="序号" width="60px"
            type="index">
          <template #default="scope">
            {{ scope.$index + 1 + rows * (requestPage - 1) }}
          </template>
        </el-table-column>
        <el-table-column
            label="字典编码"
            prop="dictCode"
            width="150px">
        </el-table-column>
        <el-table-column
            label="字典名"
            prop="dictName"
            width="220px">
        </el-table-column>
        <el-table-column
            label="字典项编码"
            prop="itemCode"
            width="150px">
        </el-table-column>
        <el-table-column
            label="字典项值"
            prop="itemValue"
            width="220px">
        </el-table-column>
        <el-table-column
            label="字典项说明"
            prop="itemComment"
            width="320px">
        </el-table-column>
        <el-table-column
            label="字典标志"
            prop="dictFlag"
            width="80px">
        </el-table-column>
        <el-table-column
            label="是否有效"
            prop="hasBan"
            width="80px">
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
        v-model="editDictDialogVisible"
        width="50%"
        :before-close="dialogHandleClose"
        center
        :showClose="false">
      <div>
        <span>
          <label>字典{{ editDictMode.id ? '编辑' : '新增' }}</label>
        </span>
        <el-button style="float: right;" size="small" @click="dialogHandleClose">取消</el-button>
      </div>
      <el-divider></el-divider>
      <el-form ref="rulesForm" :rules="rules" :model="editDictMode" label-width="200px">
        <el-form-item label="字典名称:" prop="dictName">
          <el-input v-model="editDictMode.dictName" style="width:300px" maxlength="50" clearable/>
          <label>长度1-50个字符</label>
        </el-form-item>
        <el-form-item label="字典编码:" prop="dictCode">
          <el-input v-model="editDictMode.dictCode" style="width:300px" maxlength="50" clearable/>
          <label>长度1-50个字符</label>
        </el-form-item>
        <el-form-item label="字典项编码:" prop="itemCode">
          <el-input v-model="editDictMode.itemCode" :disabled="disableList.itemCodeDisable" style="width:300px"
                    maxlength="50" clearable/>
          <label>长度1-50个字符</label>
        </el-form-item>
        <el-form-item label="字典项值:" prop="itemValue">
          <el-input v-model="editDictMode.itemValue" :disabled="disableList.itemValueDisable" style="width:300px"
                    maxlength="50" clearable/>
          <label>长度1-50个字符</label>
        </el-form-item>
        <el-form-item label="字典项说明:" prop="itemComment">
          <el-input v-model="editDictMode.itemComment" style="width:300px" maxlength="50" clearable/>
          <label>长度1-50个字符</label>
        </el-form-item>
        <el-form-item label="字典标志:" prop="dictFlag">
          <el-select v-model="editDictMode.dictFlag" class="m-2" style="width:300px" @change="dictFlagChg">
            <el-option
                v-for="item in dictFlagOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <span slot="footer" class="dialog-footer">
        <el-button style="margin-right: 40px"
                   @click="dialogHandleClose">取消
        </el-button>
        <el-button type="primary" @click="handleEditRole()"> {{ editDictMode.id ? "更新" : "新增" }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {GLOBAL_CONTENT} from '../../utils/contentConst'
import {dictList, dictDelete, dictCreate, dictUpdate} from "../api/dict";

export default {
  name: "DictList",
  data() {
    return {
      dictList: [],
      dictFlagOptions: [
        {value: 0, label: '字典'}, {value: 1, label: '字典项'},],
      requestPage: 1,
      rows: 10,
      sum: 0,
      dictModel: {
        dictName: "",
        dictCode: "",
        itemCode: "",
        topOrgCode: JSON.parse(localStorage.magicAuthDefOrg).topOrgCode
      },
      editDictMode: {
        id: '',
        dictName: "",
        dictCode: "",
        itemCode: "",
        itemValue: "",
        itemComment: "",
        dictFlag: 0,
        hasBan: 0,
        status: 1,
        displayOrder: 0,
        topOrgCode: JSON.parse(localStorage.magicAuthDefOrg).orgCode
      },
      disableList: {
        itemCodeDisable: true,
        itemValueDisable: true,
      },
      editDictDialogVisible: false,

      defaultProps: {
        children: 'treeList',
        label: 'name'
      },

      BTN_ID: GLOBAL_CONTENT.BTN_ID,
      rules: {
        // 要以数组形式展示
        dictName: [
          {required: true, message: "字典名称不能为空", trigger: "blur"},
          {min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur"}
        ],
        // 要以数组形式展示
        dictCode: [
          {required: true, message: "字典编码不能为空", trigger: "blur"},
          {min: 1, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur"}
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
      this.editDictDialogVisible = true
    },
    handleEdit(index, row) {
      this.editDictMode = row
      this.editDictDialogVisible = true
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
          dictDelete(params).then(response => {
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
      this.editDictMode = {
        id: "",
        dictCode: "",
        itemCode: "",
        topOrgCode: JSON.parse(localStorage.magicAuthDefOrg).orgCode
      }
      this.editDictDialogVisible = false
    },
    handleEditRole() {
      let params = this.editDictMode
      new Promise((resolve, reject) => {
        if (params.id) {
          dictUpdate(params).then(response => {
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
          dictCreate(params).then(response => {
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
        model: this.dictModel,
      };
      new Promise((resolve, reject) => {
        dictList(requestParams).then(response => {
          this.dictList = response.resultData
          this.sum = response.sum
          this.requestPage = response.requestPage
        }).catch(error => {
          reject(error)
        })
      })
    },
    dictFlagChg() {
      if (this.editDictMode.dictFlag == 0) {
        this.editDictMode.itemCode = ""
        this.editDictMode.itemValue = ""
        this.disableList.itemCodeDisable = true
        this.disableList.itemValueDisable = true
      } else {
        this.disableList.itemCodeDisable = false
        this.disableList.itemValueDisable = false
      }
    },
    searchList() {
      this.handleCurrentChange(1)
    },
    reset() {
      this.dictModel = {
        dictName: "",
        dictCode: "",
        itemCode: "",
        topOrgCode: JSON.parse(localStorage.magicAuthDefOrg).topOrgCode
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
