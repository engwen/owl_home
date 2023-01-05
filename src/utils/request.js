import axios from 'axios'
import {GLOBAL_CONTENT} from "./contentConst";
import {ElMessage as Message, ElLoading as Loading,ElMessageBox as MessageBox} from 'element-plus'
import {router as router} from "../router";

let loading

export function routerPush(pushData){
    startLoading()
    router.push(pushData)
    endLoading()
}

export function startLoading() {
    loading = Loading.service({
        lock: true,
        text: '加载中....',
        background: 'rgba(0, 0, 0, 0.1)'
    })
}

export function endLoading() {
    loading.close()
}


// create an axios instance
const service = axios.create({
    baseURL: 'http://localhost:8081/', // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 50000 // request timeout
})

// 请求拦截
service.interceptors.request.use(
    (config) => {
        startLoading()

        //设置请求头
        if (localStorage.magicAuthToken) {
            config.headers['X-Token'] = localStorage.magicAuthToken
            config.headers.Authorization = localStorage.magicAuthToken
            config.headers.defTopOrgCode = JSON.parse(localStorage.magicAuthDefOrg).topOrgCode
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

//响应拦截

service.interceptors.response.use(
    (response) => {
        endLoading()
        const res = response.data
        // if the custom code is not 20000, it is judged as an error.
        if (res.result === 'false' || !res.result) {
            if (res.resultCode === '1007') {
                Message({
                    message: res.resultMsg,
                    type: 'error',
                    duration: 5 * 1000
                })
                return
            }
            Message({
                message: res.resultMsg || 'Error',
                type: 'error',
                duration: 5 * 1000
            })
            if (res.resultCode === '1003' || res.resultCode === '1004') {
                //设置请求头
                if (localStorage.magicAuthToken) {
                    localStorage.setItem("magicAuthToken", "");
                }
                router.push(GLOBAL_CONTENT.ROUTER_PATH.SIGNIN_PATH)
                return Promise.reject(new Error(res.resultMsg || 'Error'))
            } else if (res.resultCode === '50012' || res.resultCode === '50014') {
                // to re-login
                MessageBox.confirm('确认退出登录', '退出登录', {
                    confirmButtonText: 'Re-Login',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('user/resetToken').then(() => {
                        location.reload()
                    })
                })
            }
            return Promise.reject(new Error(res.resultMsg || 'Error'))
        } else {
            return res
        }
    },
    (error) => {
        Message.error(error.response.data)
        endLoading()

        // 获取状态码
        const {status} = error.response

        if (status === 401) {
            Message.error('请重新登录')
            //清楚token
            localStorage.removeItem('eToken')
            //跳转到登录页面
            router.push('/signin')
        } else {
            console.log('err' + error) // for debug
            Message({
                message: error.message,
                type: 'error',
                duration: 5 * 1000
            })
        }
        return Promise.reject(error)
    }
)
export default service
