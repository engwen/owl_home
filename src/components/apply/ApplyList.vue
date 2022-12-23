<template>
  <div class="table-list-div">
    <div class="search-bar-div">
      <el-input size="small" v-model="applyModel.applicantAccount" placeholder="账号"
                style="float: left;margin:0 15px 0 0;width: 200px;line-height:20px" clearable/>
      <el-button size="small" type="primary" @click="searchList()" style="float: left">查找
      </el-button>
    </div>
    <div class="table-main-div">
      <el-table
        ref="multipleTable"
        :data="applyList"
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
          label=""
          prop="userName"
          width="140px">
        </el-table-column>
        <el-table-column
          label="申请人账号"
          prop="applicantAccount"
          width="140px">
        </el-table-column>
        <el-table-column
          label="申请状态"
          width="100px">
          <template #default="scope">
            {{scope.row.result === 1?'等待': scope.row.result === 2 ?'通过':'拒绝'}}
          </template>
        </el-table-column>

        <el-table-column
          label="申请时间"
          sortable
          width="160px"
          prop="createTime">
          <template #default="scope">
            {{scope.row.createTime}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template #default="scope">
            <el-button
              v-if="hasBtn(BTN_ID.EDIT_USER_PAGE_BTN)"
              size="small"
              :disabled="scope.row.result !== 1"
              @click="handlePass(scope.$index, scope.row)">通过
            </el-button>
            <el-button
              v-if="hasBtn(BTN_ID.EDIT_USER_PAGE_BTN)"
              size="small"
              :disabled="scope.row.result !== 1"
              @click="handleDefiled(scope.$index, scope.row)">拒绝
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
  </div>
</template>

<script>
  import {GLOBAL_CONTENT} from '../../utils/contentConst'
  import {applyJoinOrgDefiled, applyJoinOrgPass, applyOrgList} from "../api/apply";

  export default {
    name: "ApplyList",
    data() {
      return {
        applyList: [],
        requestPage: 1,
        rows: 10,
        sum: 0,
        applyModel: {
          applicantAccount: "",
          topOrgCode: "",
        },
        selectUser: {},
        BTN_ID: GLOBAL_CONTENT.BTN_ID
      }
    },
    computed: {},
    methods: {
      hasBtn: function (btnId) {
        return true;
      },
      handlePass(index, row) {
        let params = {
          applicantAccount: row.applicantAccount,
          topOrgCode: this.applyModel.topOrgCode
        }
        new Promise((resolve, reject) => {
          applyJoinOrgPass(params).then(response => {
            if (response.result) {
              this.$message({
                message: '通过',
                type: 'success'
              })
              this.handleCurrentChange(this.requestPage)
            }
          }).catch(error => {
            reject(error)
          })
        })
      },
      handleDefiled(index, row) {
        let params = {
          applicantAccount: row.applicantAccount,
          topOrgCode: this.applyModel.topOrgCode
        }
        new Promise((resolve, reject) => {
          applyJoinOrgDefiled(params).then(response => {
            if (response.result) {
              this.$message({
                message: '已拒绝',
                type: 'success'
              })
              this.handleCurrentChange(this.requestPage)
            }
          }).catch(error => {
            reject(error)
          })
        })
      },
      handleSizeChange(val) {
        this.rows = val
        this.searchList()
      },
      handleCurrentChange(val) {
        this.applyModel.topOrgCode = JSON.parse(localStorage.magicAuthDefOrg).orgCode
        let requestParams = {
          requestPage: val,
          rows: this.rows,
          model: this.applyModel,
        };
        new Promise((resolve, reject) => {
          applyOrgList(requestParams).then(response => {
            this.applyList = response.resultData
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
