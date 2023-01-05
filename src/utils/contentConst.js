/**
 * @author engwen
 * email xiachanzou@outlook.com
 * 2017/11/13 0013
 */

// 全局變量，長期存儲
var globalContentStorage = window.localStorage;
if (!window.localStorage) {
  window.localStorage = {
    getItem: function (sKey) {
      if (!sKey || !this.hasOwnProperty(sKey)) {
        return null;
      }
      return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
    },
    key: function (nKeyId) {
      return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
    },
    setItem: function (sKey, sValue) {
      if (!sKey) {
        return;
      }
      document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
      this.length = document.cookie.match(/\=/g).length;
    },
    length: 0,
    removeItem: function (sKey) {
      if (!sKey || !this.hasOwnProperty(sKey)) {
        return;
      }
      document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      this.length--;
    },
    hasOwnProperty: function (sKey) {
      return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    }
  };
  window.localStorage.length = (document.cookie.match(/\=/g) || window.localStorage).length;
}

export const GLOBAL_CONTENT = {
  /*全局变量*/
   GLOBAL_CONTENT_NAME : {
    SIGNIN_ACCOUNT: "OwlMagicSigninAccount",
    IS_SIGNIN: "OwlMagicIsSignin",
    SECRET_KEY: "OwlMagicSecretKey",
    REMEMBER_ME: "OwlMagicIsRememberMe",
    REMEMBER_ACCOUNT: "OwlMagicAccount",
    REMEMBER_PASSWORD: "OwlMagicPassword"
  },
  ROUTER_PATH : {
    SIGNIN_PATH: "/",
    LAYOUT_PATH: "/layout",

    USER_LIST: "/layout/user/list",
    USER_CREATE: "/layout/user/create",
    // ADD_ORG_USER: "/layout/user/addOrg",
    USER_UPDATE: "/layout/user/update",
    USER_DETAILS: "/layout/user/details",

    ROLE_LIST: "/layout/role/list",
    ROLE_CREATE: "/layout/role/create",
    ROLE_UPDATE: "/layout/role/update",
    ROLE_DETAILS: "/layout/role/details",
    ROLE_PAGE_LIST: "/layout/role/page",

    PERMISSION_LIST: "/layout/permission/list",
    PERMISSION__CREATE: "/layout/permission/create",
    PERMISSION__UPDATE: "/layout/permission/update",
    PERMISSION__DETAILS: "/layout/permission/details",

    ORG_LIST: "/layout/org/list",
    ORG_CREATE: "/layout/org/create",
    ORG_UPDATE: "/layout/org/update",
    ORG_DETAILS: "/layout/org/details",

    DICT_LIST: "/layout/dict/list",
    DICT_CREATE: "/layout/dict/create",
    DICT_UPDATE: "/layout/dict/update",


    DICTTREE_LIST: "/layout/dictTree/list",
    DICTTREE_CREATE: "/layout/dictTree/create",
    DICTTREE_UPDATE: "/layout/dictTree/update",

    ORG_USER_LIST: "/layout/org/userList",
    SIGNIN_INFO: "/layout/my/info",
    APPLY_LIST: "/layout/apply/list",

    MENU_LIST: "/layout/menu/list",
    MENU_CREATE: "/layout/menu/create",
    MENU_UPDATE: "/layout/menu/update",
    MENU_DETAILS: "/layout/menu/details",
  },
  BTN_ID:  {
    CREATE_USER_PAGE_BTN: "createUserPageBtn",
    ADD_USER_PAGE_BTN: "addUserPageBtn",
    EDIT_USER_PAGE_BTN: "editUserPageBtn",
    BAN_OR_LEAVE_USER_BTN: "banOrLeaveUserBtn",
    DELETE_USER_BTN: "deleteUserBtn",
    REST_USER_PASS_BTN: "restUserPassBtn",

    CREATE_ROLE_PAGE_BTN: "createRolePageBtn",
    EDIT_ROLE_PAGE_BTN: "editRlePageBtn",
    DELETE_ROLE_BTN: "deleteRoleBtn",

    CREATE_PERMISSION_PAGE_BTN: "createPermissionPageBtn",
    EDIT_PERMISSION_PAGE_BTN: "editPermissionPageBtn",
    DELETE_PERMISSION_BTN: "deletePermissionBtn",

    CREATE_ORG_PAGE_BTN: "createOrgPageBtn",
    EDIT_ORG_PAGE_BTN: "editOrgPageBtn",
    DELETE_ORG_BTN: "deleteOrgBtn",
    BAN_OR_LEAVE_ORG_BTN: "banOrLeaveOrgBtn",

    CREATE_MENU_PAGE_BTN: "createMenuPageBtn",
    EDIT_MENU_PAGE_BTN: "editMenuPageBtn",
    DELETE_MENU_BTN: "deleteMenuBtn",
  },

}

/**
 * 遍歷返回值，並且將其賦值，會保留原有的數據
 * @param type 清除屬性，或者賦值屬性
 * @param aimObj 目標對象
 * @param data 指定對象
 */
function aimContentData(type, aimObj, data) {
  switch (type) {
    case 0:
      //清除目標對象擁有的屬性
      if (aimObj) {
        $.each(aimObj, function (key, value) {
          aimObj[key] = null;
        });
      }

      break;
    case 1:
      //清除目標對象擁有的指定對象屬性
      if (data) {
        $.each(data, function (key, value) {
          aimObj[key] = null;
        });
      }
      break;
    case 2:
      //將指定對象中的屬性全部賦值給目標對象
      if (data) {
        // aimObj = new Object();
        // aimObj = cloneOldObject(data);
        $.each(data, function (key, value) {
          aimObj[key] = value;
        });
      }
      break;
    case 3:
      //將指定對象中，擁有的目標對象屬性 全部賦值到目標對象 不包含的維持現狀
      if (aimObj) {
        $.each(aimObj, function (key, value) {
          if (data[key]) {
            aimObj[key] = data[key];
          }
        });
      }
      break;
  }

}




/**
 * 是否包含指定菜单
 */
function hasBtn(pageName, btnId) {
  // return null != getBtnInfo(pageName, btnId);
  return true;
}
