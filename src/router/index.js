import {GLOBAL_CONTENT} from '../utils/contentConst'

import Signin from '../components/Signin.vue'
import Layout from '../components/Layout.vue'
import UserList from '../components/user/UserList.vue'
import UserChange from '../components/user/UserChange.vue'
import RoleList from '../components/role/RoleList.vue'
import PermissionList from '../components/permission/PermissionList.vue'
import MenuList from '../components/menu/MenuList.vue'
import OrgList from "../components/org/OrgList.vue";
import OrgChange from "../components/org/OrgChange.vue";
import MenuChange from "../components/menu/MenuChange.vue";
import OrgUserList from "../components/org/OrgUserList.vue";
import AddOrgUser from "../components/temp/AddOrgUser.vue";
import Info from "../components/my/Info.vue";
import ApplyList from "../components/apply/ApplyList.vue";
import DictList from "../components/dict/DictList.vue";


import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router'



const routes = [
    {
        path: '/' || '/signin',
        name: 'signin',
        component: Signin
    },
    {
        path: GLOBAL_CONTENT.ROUTER_PATH.LAYOUT_PATH,
        component: Layout,
        children: [
            {
                path: GLOBAL_CONTENT.ROUTER_PATH.USER_LIST,
                component: UserList,
            },
            {
                path: GLOBAL_CONTENT.ROUTER_PATH.USER_CREATE,
                component: UserChange,
            },
            {
                path: GLOBAL_CONTENT.ROUTER_PATH.USER_UPDATE,
                component: UserChange,
            },
            {
                path: GLOBAL_CONTENT.ROUTER_PATH.USER_DETAILS,
                component: UserChange,
            },

            /*=====================================================*/
            {
                path: GLOBAL_CONTENT.ROUTER_PATH.ROLE_LIST,
                component: RoleList,
            },
            /*=====================================================*/
            /*=====================================================*/
            {
                path: GLOBAL_CONTENT.ROUTER_PATH.SIGNIN_INFO,
                component: Info,
            },

            /*=====================================================*/
            /*        {
                      path: GLOBAL_CONTENT.ROUTER_PATH.ROLE_PAGE_LIST,
                      component: RolePageTree,
                    },*/
            {
                path: GLOBAL_CONTENT.ROUTER_PATH.APPLY_LIST,
                component: ApplyList,
            },
            /*=====================================================*/
            {
                path: GLOBAL_CONTENT.ROUTER_PATH.PERMISSION_LIST,
                component: PermissionList,
            },

            /*=====================================================*/
            {
                path: GLOBAL_CONTENT.ROUTER_PATH.ORG_LIST,
                component: OrgList,
            },
            {
                path: GLOBAL_CONTENT.ROUTER_PATH.ORG_CREATE,
                component: OrgChange,
            },
            {
                path: GLOBAL_CONTENT.ROUTER_PATH.ORG_USER_LIST,
                component: OrgUserList,
            },
            {
                path: GLOBAL_CONTENT.ROUTER_PATH.MENU_LIST,
                component: MenuList,
            },
            {
                path: GLOBAL_CONTENT.ROUTER_PATH.MENU_CREATE,
                component: MenuChange,
            },
            {
                path: GLOBAL_CONTENT.ROUTER_PATH.DICT_LIST,
                component: DictList,
            },
            /*        {
                      path: GLOBAL_CONTENT.ROUTER_PATH.PAGE_LIST + "/:id",
                      component: PageMenu,
                    },*/
        ]
    }]

export const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})