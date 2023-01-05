<template>
  <div class="details-div">
    <el-card class="box-card edit-content">
      <div slot="header" class="clearfix">
        <span> <label>用户{{accountModel.id?'编辑':'新增'}}</label></span>
      </div>
      <el-form ref="rulesForm" :rules="rules" :model="accountModel" label-width="200px">
        <el-form-item label="账号:" prop="account">
          <el-input v-model="accountModel.account" style="width:300px" maxlength="50" clearable/>
          <label>长度3-16个字符，可为英文、数字，注册后不可更改</label>
        </el-form-item>
        <el-form-item label="用户名:" prop="userName">
          <el-input v-model="accountModel.userName" style="width:300px" maxlength="50" clearable/>
          <label>长度1-14个字符，可为中文、英文、数字、下划线、破折号。</label>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input v-model="accountModel.password" style="width:300px" maxlength="50" clearable/>
          <label :style="isCreate?'display:inline':'display:none'">如不填写，则默认密码为123456。填写长度3-16个字符，可为英文、数字</label>
        </el-form-item>
        <el-form-item label="email地址:" prop="email">
          <el-input v-model="accountModel.email" style="width:300px" maxlength="50" clearable/>
        </el-form-item>
        <el-form-item label="手机号:" prop="mobile">
          <el-input v-model="accountModel.mobile" style="width:300px" maxlength="50" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button  style="margin-right: 40px"
                     @click="handleCancel">取消
          </el-button>
          <el-button type="primary"  @click="handleCreate()"> {{isCreate?"新增":"更新"}}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import {GLOBAL_CONTENT} from "../../utils/contentConst";
  import {userCreate, userUpdate} from "../api/user";
  import {RULE_VALIDATE} from "../../utils/rule";
  import {routerPush} from "../../utils/request";

  export default {
    name: "Create",
    data() {
      return {
        accountModel: {
          id: "",
          userName: "",
          account: "",
          password: "",
          mobile: "",
          email: "",
          hasBan: "false",
        },
        BTN_ID: GLOBAL_CONTENT.BTN_ID,
        isCreate: true,
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

    methods: {
      handleCancel() {
        this.isCreate = true
        this.accountModel = {
          id: "",
          userName: "",
          account: "",
          password: "",
          mobile: "",
          email: "",
          hasBan: "false"
        }
        routerPush(GLOBAL_CONTENT.ROUTER_PATH.USER_LIST);
      },
      handleCreate() {
        this.$refs['rulesForm'].validate(valid => {
          if (valid) {
            if (this.isCreate) {
              new Promise((resolve, reject) => {
                userCreate(this.accountModel).then(response => {
                  if (response.result) {
                    this.$message({
                      message: '新增成功',
                      type: 'success'
                    })
                    routerPush(GLOBAL_CONTENT.ROUTER_PATH.USER_LIST);
                  }
                }).catch(error => {
                  reject(error)
                })
              })
            } else {
              new Promise((resolve, reject) => {
                userUpdate(this.accountModel).then(response => {
                  if (response.result) {
                    this.$message({
                      message: '更新成功',
                      type: 'success'
                    })
                    routerPush(GLOBAL_CONTENT.ROUTER_PATH.USER_LIST);
                  }
                }).catch(error => {
                  reject(error)
                })
              })
            }
          }
        })
      },
    },
    created() {
      // 取到路由带过来的参数
      if (this.$route.query.id) {
        this.accountModel = this.$route.query
        this.isCreate = false
      } else {
        this.isCreate = true
      }
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
