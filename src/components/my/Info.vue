<template>

  <el-tabs type="border-card" class="table-list-div">
    <el-tab-pane label="个人信息">
      <div>
        <span> <label>用户：　{{accountModel.userName}}</label></span>
      </div>
      <div v-if="!isEdit" class="edit-content">
        <div class="row-div">
          <div class="label-div ">
            <label>账号:</label>
          </div>
          <div class="span-div">
            <span>{{accountModel.account}}</span>
          </div>
        </div>
        <div class="row-div">
          <div class="label-div ">
            <label>用户名:</label>
          </div>
          <div class="span-div">
            <span>{{accountModel.userName}}</span>
          </div>
        </div>
        <div class="row-div">
          <div class="label-div ">
            <label>E-mail:</label>
          </div>
          <div class="span-div">
            <span>{{accountModel.email}}</span>
          </div>
        </div>
        <div class="row-div">
          <div class="label-div ">
            <label>手机号:</label>
          </div>
          <div class="span-div">
            <span>{{accountModel.mobile}}</span>
          </div>
        </div>
        <div class="row-div">
          <div class="label-div ">
            <label>&nbsp;</label>
          </div>
          <div class="span-div">
            <el-button type="primary" @click="handleEditUserInfo()"> 编辑</el-button>
          </div>
        </div>

      </div>
      <div v-else class="edit-content">
        <el-form ref="rulesForm" :rules="rules" :model="accountModel" label-width="200px">
          <el-form-item label="账号:" prop="account">
            <el-input disabled v-model="accountModel.account" style="width:300px" maxlength="50" clearable/>
            <label>长度3-16个字符，可为英文、数字，注册后不可更改</label>
          </el-form-item>
          <el-form-item label="用户名:" prop="userName">
            <el-input v-model="accountModel.userName" style="width:300px" maxlength="50" clearable/>
            <label>长度1-14个字符，可为中文、英文、数字、下划线、破折号。</label>
          </el-form-item>
          <el-form-item label="email地址:" prop="email">
            <el-input v-model="accountModel.email" style="width:300px" maxlength="50" clearable/>
          </el-form-item>
          <el-form-item label="手机号:" prop="mobile">
            <el-input v-model="accountModel.mobile" style="width:300px" maxlength="50" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button style="margin-right: 40px"
                       @click="handleCancelUpdateUserInfo">取消
            </el-button>
            <el-button type="primary" @click="handleUpdateUserInfo()"> 更新</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-tab-pane>
    <el-tab-pane label="组织管理">
      <div>
        <div>
          <span><label>拥有组织：</label></span>
        </div>
        <el-table
          ref="multipleTable"
          :data="signinerOrgList"
          tooltip-effect="dark"
          height="100%"
          style="width: 100%;margin-top: 40px"
          row-key="id"
        >
          <el-table-column
            label="顶级组织名称"
            prop="topOrgName"
            width="250px">
          </el-table-column>
          <el-table-column
            label="顶级组织编码"
            prop="topOrgCode"
            width="180px">
          </el-table-column>
          <el-table-column
            label="归属组织名称"
            prop="orgName"
            width="250px">
          </el-table-column>
          <el-table-column
            label="归属组织编码"
            prop="orgCode"
            width="180px">
          </el-table-column>

          <el-table-column
            label="操作">
            <template #default="scope">
              <el-button
                v-if="hasBtn(BTN_ID.DELETE_ORG_BTN)"
                size="small"
                type="danger"
                @click="handleLeaveOrg(scope.row)">离开组织
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-tab-pane>
    <el-tab-pane label="组织申请">
      <div>
        <span><label>申请加入组织</label></span>
      </div>
      <div class="table-list-div" style="margin-top: 40px">
        <div class="search-bar-div">
          <el-input size="small" v-model="orgModel.topOrgName" placeholder="组织名称"
                    style="float: left;margin:0 15px 0 0;width: 200px;line-height:20px" clearable/>
          <el-input size="small" v-model="orgModel.topOrgCode" placeholder="组织编码"
                    style="float: left;margin:0 15px 0 0;width: 200px;line-height:20px" clearable/>

          <el-button size="small" type="primary" @click="resetOrgMode()" style="float: left">重置
          </el-button>
          <el-button size="small" type="primary" @click="searchTopOrgList()" style="float: left">查找
          </el-button>
        </div>
      </div>
      <el-table
        height="100%"
        ref="multipleTable"
        :data="topOrgList"
        tooltip-effect="dark"
        style="width: 100%;">
        <el-table-column
          label="序号" width="60px"
          type="index">
          <template #default="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column
          label="组织名称"
          prop="orgName"
          width="250px">
        </el-table-column>
        <el-table-column
          label="组织编码"
          prop="orgCode"
          width="180px">
        </el-table-column>
        <el-table-column
          label="申请状态"
          width="100px">
          <template #default="scope">
            {{scope.row.applyResult === 1?'等待': scope.row.applyResult === 2 ?'通过':
            scope.row.applyResult === 3 ?'拒绝' :'未申请'}}
          </template>
        </el-table-column>
        <el-table-column
          label="处理人名称"
          sortable
          width="200px"
          prop="terminatorName">
        </el-table-column>
        <el-table-column
          label="处理人账号"
          sortable
          width="200px"
          prop="terminatorAccount">
        </el-table-column>
        <el-table-column
          label="申请时间"
          sortable
          width="200px"
          prop="createTime">
          <template #default="scope">
            {{scope.row.createTime}}
          </template>
        </el-table-column>
        <el-table-column
          label="处理时间"
          sortable
          width="200px"
          prop="updateTime">
          <template #default="scope">
            {{scope.row.updateTime}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template #default="scope">
            {{scope.row.result}}
            <el-button
              v-if="hasBtn(BTN_ID.EDIT_USER_PAGE_BTN)"
              size="small"
              :disabled="scope.row.applyResult === 1 "
              @click="handleApplyJoinOrg(scope.$index, scope.row)">{{scope.row.applyResult === 3 ? '再次申请' : '申请加入'}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>

    <el-tab-pane label="申请记录">
      <div>
        <span><label>申请记录</label></span>
      </div>
      <el-table
        height="100%"
        ref="multipleApplyTable"
        :data="myApplyOrgList"
        tooltip-effect="dark"
        style="width: 100%;">
        <el-table-column
          label="序号" width="60px"
          type="index">
          <template #default="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column
          label="组织编码"
          prop="topOrgCode"
          width="180px">
        </el-table-column>
        <el-table-column
          label="处理人账号"
          sortable
          width="200px"
          prop="terminatorAccount">
        </el-table-column>
        <el-table-column
          label="申请类型"
          sortable
          width="200px"
          prop="applyComment">
        </el-table-column>
        <el-table-column
          label="申请时间"
          sortable
          width="200px"
          prop="createTime">
          <template #default="scope">
            {{scope.row.createTime}}
          </template>
        </el-table-column>
        <el-table-column
          label="处理时间"
          sortable
          width="200px"
          prop="updateTime">
          <template #default="scope">
            {{scope.row.updateTime}}
          </template>
        </el-table-column>
        <el-table-column
          label="申请状态">
          <template #default="scope">
            {{scope.row.result === 1?'等待': scope.row.result === 2 ?'通过':
            scope.row.result === 3 ?'拒绝' :'未申请'}}
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import {GLOBAL_CONTENT} from '../../utils/contentConst'
  import {
    signinerOrgLeave, signinerInfoUpdate
  } from "../api/user";
  import {RULE_VALIDATE} from "../../utils/rule";
  import {signerTopOrgList, topOrgList, topOrgListExceptJoin} from "../api/org";
  import {applyJoinOrg, myApplyOrgList} from "../api/apply";

  export default {
    name: "Info",
    inject: ['reload'],
    data() {
      return {
        isEdit: false,
        accountModel: {
          id: "",
          userName: "",
          account: "",
          mobile: "",
          email: "",
        },
        signinerOrgList: [],

        orgModel: {
          topOrgCode: "",
          topOrgName: ""
        },
        topOrgList: [],

        myApplyOrgList: [],
        BTN_ID: GLOBAL_CONTENT.BTN_ID,
        rules: {
          // 要以数组形式展示
          account: [
            {required: true, validator: RULE_VALIDATE.isEngAccount, trigger: "blur"},
            {min: 3, max: 16, message: "长度在 3 到 30 个字符", trigger: "blur"}
          ],
          // 要以数组形式展示
          userName: [
            {required: true, message: "用户名不能为空", trigger: "blur"},
            {min: 2, max: 30, message: "长度在 2 到 30 个字符", trigger: "blur"}
          ],
          email: [
            {
              type: "email",
              required: false,
              message: "邮箱格式不正确",
              trigger: "blur"
            }
          ],
          password: [
            {required: false, message: " 如不填写，则默认密码为123456。填写长度6-16个字符，可为英文、数字", trigger: "blur"},
            {min: 6, max: 16, message: "长度在 6 到 30 个字符", trigger: "blur"}
          ],
          mobile: [
            {
              validator: RULE_VALIDATE.validateMobile,
              required: false,
              message: "手机号格式不正确",
              trigger: "change"
            }
          ],
        },
      }
    },
    computed: {},
    methods: {
      hasBtn: function (btnId) {
        return true;
      },
      handleCancelUpdateUserInfo() {
        this.isEdit = false
        this.resetUserInfo()
      },
      handleEditUserInfo() {
        this.isEdit = true
      },
      handleUpdateUserInfo() {
        new Promise((resolve, reject) => {
          signinerInfoUpdate(this.accountModel).then(response => {
            if (response.result) {
              this.$message({
                message: '更新成功',
                type: 'success'
              })
              this.updateUserInfo()
              this.isEdit = false
            }
          }).catch(error => {
            reject(error)
          })
        })
      },

      handleLeaveOrg(rows) {
        let params = {
          userAccount: this.accountModel.account,
          topOrgCode: rows.orgCode
        }
        this.$confirm('是否确认离开该组织?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          new Promise((resolve, reject) => {
            signinerOrgLeave(params).then(response => {
              if (response.result) {
                this.$message({
                  message: '离开组织成功',
                  type: 'success'
                })
                this.getSignerTopOrgList()
                this.searchTopOrgList()
              }
            }).catch(error => {
              reject(error)
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },

      resetUserInfo() {
        let signiner = JSON.parse(localStorage.magicAtuhSigniner)
        this.accountModel = {
          id: signiner.id,
          userName: signiner.userName,
          account: signiner.account,
          mobile: signiner.mobile,
          email: signiner.email,
        }
      },
      updateUserInfo() {
        let signiner = JSON.parse(localStorage.magicAtuhSigniner)
        signiner.userName = this.accountModel.userName
        signiner.account = this.accountModel.account
        signiner.mobile = this.accountModel.mobile
        signiner.email = this.accountModel.email
        localStorage.setItem("magicAtuhSigniner", JSON.stringify(signiner))
      },
      handleClose(done) {
        done();
      },

      getSignerTopOrgList() {
        new Promise((resolve, reject) => {
          signerTopOrgList().then(response => {
            this.signinerOrgList = response.resultData
            if (!this.signinerOrgList) {
              this.$message({
                message: "未查询到归属组织信息",
                type: 'error'
              })
              return
            }
            localStorage.setItem("magicAuthSignerOrgList", JSON.stringify(this.signinerOrgList))
          }).catch(error => {
            reject(error)
          })
        });
      },


      resetOrgMode() {
        this.orgModel = {
          topOrgCode: "",
          topOrgName: ""
        }
      },
      searchTopOrgList() {
        new Promise((resolve, reject) => {
          topOrgListExceptJoin(this.orgModel).then(response => {
            this.topOrgList = response.resultData
            if (!this.topOrgList) {
              this.$message({
                message: "未查询到归属组织信息",
                type: 'error'
              })
            }
          }).catch(error => {
            reject(error)
          })
        });
      },
      getMyApplyOrgList() {
        new Promise((resolve, reject) => {
          myApplyOrgList({
            getAll: true
          }).then(response => {
            this.myApplyOrgList = response.resultData
            if (!this.topOrgList) {
              this.$message({
                message: "未查询到申请信息",
                type: 'error'
              })
            }
          }).catch(error => {
            reject(error)
          })
        });
      },
      handleApplyJoinOrg(index, rows) {
        let params = {
          topOrgCode: rows.orgCode,
          applyInfo: "申请加入组织"
        }
        this.$confirm('是否确认申请加入该组织?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          new Promise((resolve, reject) => {
            applyJoinOrg(params).then(response => {
              if (response.result) {
                this.$message({
                  message: '申请成功',
                  type: 'success'
                })
                this.searchTopOrgList()
                this.getMyApplyOrgList()
              }
            }).catch(error => {
              reject(error)
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
    },
    created() {
      this.resetUserInfo()
      this.getSignerTopOrgList()
      this.searchTopOrgList()
      this.getMyApplyOrgList()
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


  /* --------------------------edit-------------------------------- */

  .edit-content {
    margin-top: 50px;
  }

  .edit-content > .next-remark-row-div {
    display: inline-block;
    width: 100%;
    margin: 0;
  }

  .edit-content > .row-div {
    display: inline-block;
    width: 100%;
    margin-left: 10%;
    margin-bottom: 50px;
  }

  .edit-content .label-div {
    width: 80px;
    text-align: right;
    vertical-align: middle;
    float: left;
    color: #909498;
  }

  .edit-content .span-div {
    height: 100%;
    text-align: left;
    vertical-align: middle;
    margin-left: 20px;
    float: left;
    color: #909498;
  }

  .edit-content .span-div > span {
    word-break: normal;
    font-family: MicrosoftYaHei;
    font-size: 14px;
  }

  .span-div > image {
    height: 100%;
    margin-right: 15px;;
  }

  .edit-content .image-div {
    width: 300px;
    height: 168px;
    text-align: left;
    vertical-align: middle;
    margin-left: 20px;
    float: left;
  }

  .edit-content .text-input {
    height: 30px;
    width: 440px;
  }

  .edit-content .mini-input {
    height: 30px;
    width: 300px;
  }

  .edit-content .mini-btn {
    margin-left: 20px;
  }

  .edit-content .upload-btn {
    margin-left: 70px;
    float: left;
  }

</style>
