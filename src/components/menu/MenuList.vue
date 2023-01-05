<template>
  <div class="table-list-div">
    <div class="search-bar-div">
      <el-button size="small" type="primary" v-if="hasBtn(BTN_ID.CREATE_MENU_PAGE_BTN)" @click="handleCreateMenu" style="float: right">
        新增菜单
      </el-button>
    </div>
    <div class="table-main-div">
      <el-table
        ref="multipleTable"
        :data="menuList"
        tooltip-effect="dark"
        height="100%"
        style="width: 100%;line-height:20px"
        row-key="id"
        default-expand-all
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
          label="菜单名称"
          prop="node.menuName"
          width="250px">
        </el-table-column>
        <el-table-column
          label="菜单编码"
          prop="node.menuCode"
          width="180px">
        </el-table-column>
        <!--        <el-table-column
                  label="上级菜单名称"
                  prop="node.upMenuName"
                  width="180px">
                </el-table-column>-->
        <!--        <el-table-column
                  label="上级菜单编码"
                  prop="node.pidCode"
                  width="180px">
                </el-table-column>-->
        <el-table-column
          label="归属组织"
          prop="node.topOrgName"
          width="150px">
        </el-table-column>
        <!--        <el-table-column
                  label="归属组织"
                  prop="node.pidCode"
                  width="180px">
                </el-table-column>-->
        <el-table-column
          label="菜单链接地址"
          prop="node.menuUrl">
        </el-table-column>
        <el-table-column
          label="菜单页面地址"
          prop="node.menuPageUrl">
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
          fixed="right"
          label="操作"
          width="220px">
          <template #default="scope">
            <el-button
              v-if="hasBtn(BTN_ID.EDIT_MENU_PAGE_BTN)"
              size="small"
              @click="handleEditMenu(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              v-if="hasBtn(BTN_ID.DELETE_MENU_BTN)"
              size="small"
              type="danger"
              @click="handleAddDownMenu(scope.$index, scope.row)">新增
            </el-button>
            <el-button
              v-if="hasBtn(BTN_ID.DELETE_MENU_BTN)"
              size="small"
              type="danger"
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
  import {listTreeExceptSelect, menuBanOrLeave, menuDelete,} from "../api/menu";
  import {routerPush} from "../../utils/request";


  export default {
    name: "MenuList",
    data() {
      return {
        menuList: [],
        requestPage: 1,
        rows: 10,
        sum: 0,
        editMenuModel: {
          id: "",
          menuName: "",
          menuCode: "",
          topOrgName: "",
          pidCode: "",
          upMenuName: "",
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
      handleCreateMenu() {
        routerPush(GLOBAL_CONTENT.ROUTER_PATH.MENU_CREATE)
      },
      handleEditMenu(index, row) {
        routerPush({path: GLOBAL_CONTENT.ROUTER_PATH.MENU_CREATE, query: {node: JSON.stringify(row.node), isUpNode: "n"}});
      },
      handleAddDownMenu(index, row) {
        routerPush({path: GLOBAL_CONTENT.ROUTER_PATH.MENU_CREATE, query: {node: JSON.stringify(row.node), isUpNode: "y"}});
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
            menuDelete(params).then(response => {
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
        new Promise((resolve, reject) => {
          listTreeExceptSelect(params).then(response => {
            this.menuList = response.resultData
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
      // MenuMenu: MenuMenu
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
