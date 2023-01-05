<template>
  <div class="main-body">
    <div id="signin" class="div-middle-flex">
      <div class="sign-in-content div-middle-position" @keyup.enter="onSubmit()">
        <div class="sign-in-left-bar">
          <div class="sign-in-row" style="margin-top: 130px">
          </div>
          <div class="sign-in-row" style="margin-top: 35px">
            <span style="color: #FFFFFF;font-size: 20px;">权限管理系统</span>
          </div>
          <div class="sign-in-row" style="margin-top: 35px">
            <span style="color: #FFFFFF;font-size: 20px;">by Owl</span>
          </div>
        </div>
        <div class="sign-in-right-bar">
          <div class="sign-in-row" style="margin-top:50px;margin-bottom: 20px">
            <span class="warn_span_color">&nbsp;</span>
          </div>
          <el-form ref="rulesForm" :rules="rules" :model="form">
            <el-form-item class="sign-in-row" style=" margin-bottom: 50px;margin-top: 40px" prop="username">
              <el-input class="sign-in-input" placeholder="请输入账号" v-model="form.username"
                        clearable/>
            </el-form-item>
            <el-form-item class="sign-in-row" style=" margin-bottom: 50px;" prop="password">
              <el-input type="password" class="sign-in-input" v-model="form.password" placeholder="请输入密码" clearable/>
            </el-form-item>
            <el-form-item class="sign-in-row" style=" margin-top: 20px;">
              <el-button type="primary" v-on:click="onSubmit()" class="sign-in-btn default-blue-btn">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {GLOBAL_CONTENT} from '../utils/contentConst'
import {signin} from './api/user'
import {routerPush} from "../utils/request";


export default {
  name: "Signin",
  data() {
    return {
      form: {
        username: 'admin',
        password: '32132100',
      },
      // 表单验证，需要在 el-form-item 元素中增加 prop 属性
      rules: {
        // 要以数组形式展示
        username: [
          {required: true, message: '账号不可为空', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '密码不可为空', trigger: 'blur'}
        ]
      },
    }
  },
  methods: {
    onSubmit() {
      // 为表单绑定验证功能
      this.$refs['rulesForm'].validate(valid => {
        if (valid) {
          new Promise((resolve, reject) => {
            signin({
              account: this.form.username.trim(),
              password: this.form.password
            }).then(response => {
              localStorage.setItem("magicAuthToken", response.resultData.token)
              // roles must be a non-empty array
              if (!response.resultData.roleList || response.resultData.roleList.length <= 0) {
                reject('getInfo: roles must be a non-null array!')
              }
              const roles = []
              response.resultData.roleList.forEach(it => {
                roles.push(it.roleCode)
              })
              localStorage.setItem('magicAtuhRoles', JSON.stringify(roles))
              localStorage.setItem('magicAtuhSigniner', JSON.stringify(response.resultData))
              localStorage.setItem("magicAuthDefOrg", JSON.stringify(response.resultData.defOrg))
              // resolve()
              // 使用 vue-router 路由到指定页面，该方式称之为编程式导航
              routerPush(GLOBAL_CONTENT.ROUTER_PATH.LAYOUT_PATH);
            }).catch(error => {
              reject(error)
            })
          });
        } else {
          return false;
        }
      });
    }
  },
  created() {
    if (localStorage.magicAuthToken) {
      routerPush(GLOBAL_CONTENT.ROUTER_PATH.LAYOUT_PATH);
    }
  }
}
</script>


<style scoped>
.main-body {
  background-color: #FFFFFF;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 30%;
  padding: 10% 0;
}

/*居中显示*/
.div-middle-flex {
  align-items: center;
  text-align: center;
}

.div-middle-position {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.sign-in-content {
  position: absolute;
  width: 800px;
  height: 500px;
  background-color: #ffffff;
  box-shadow: 0 10px 70px 0 rgba(129, 153, 171, 0.2);
  border-radius: 10px;
}

.sign-in-left-bar {
  float: left;
  width: 360px;
  height: 100%;
  background: url("../assets/img/sign_in_bg.png");
  border-radius: 10px 0 0 10px;
}

.sign-in-right-bar {
  float: right;
  width: 440px;
  height: 100%;
}

.sign-in-row {
  width: 320px;
  display: inline-block;
  font-size: 14px;
}

.sign-in-row > label {
  float: left;
  word-break: normal;
  font-family: MicrosoftYaHei;
  font-size: 14px;
  color: #909498;
}

.sign-in-input {
  height: 38px;
  width: 320px;
}

.sign-in-btn {
  width: 321px;
  height: 34px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}

.el-icon-arrow-down {
  font-size: 12px;
}
</style>
