import Vue from 'vue';
import {apiPath, isBrowser} from '@/common/js/global'
const ajax = option => {
    /**
         option = { // option配置说明
            url,
            header,
            method,
            params, // params对象的值会作为字符串拼接在URL请求地址中
            needAuth,  // 是否让header里携带token
            contentType,
            noCode, // 不做code判断及相关处理,直接返回RESresolve(res)
            showLoading, // 默认false, 是否显示加载中
            showOkMsg, // 默认false, true = CODE为200时用showToast发送res.message信息
            showErrorMsg, // 默认true, true = CODE不为200时用showToast发送res.message信息，和catch里ret.msg
            dotToLogin, // 不进行登录处理
         }
    */
    return new Promise((resolve, reject) => {
        var token = uni.getStorageSync('token');
        var params = '';
        if (option.params) {
            params = '?';
            var keyvalPair = '';
            for (var k in option.params) {
                keyvalPair = k + '=' + option.params[k];
                if (params === '?') {
                    params += keyvalPair
                } else {
                    params += ('&' + keyvalPair)
                }
            }
            if (params === '?') {
                params = ''
            }
        }
        // 判断地址是否包含https://，如果包含就不加apiPath
        if (option.url.indexOf(apiPath) === 0) {
            option.url = option.url.replace(apiPath, '')
        }
        var c_url
        if (/^https?:\/\//.test(option.url)) {
            c_url = option.url
        } else {
            c_url = apiPath + option.url
        }
        option.showErrorMsg = option.showErrorMsg === false ? false : true // 默认true
        if (option.showLoading) uni.showLoading({
            title: '加载中'
        });
        var header = Object.assign({
            'Content-Type': option.contentType || 'application/x-www-form-urlencoded;charset=utf-8' // contentType:'application/json;charset=utf-8'
        }, option.header)
        if (option.needAuth) {
            header.Authorization = token || ''
        }
        uni.request({
            url: c_url + params,
            method: option.method || 'POST',
            header,
            data: option.data || {},
            dataType: option.dataType || 'json',
            success(res) {
                var printApiRes = {
                    '接口地址': option.url,
                    '提交值': option,
                    '返回值': res
                }
                console.debug('printApiRes：', printApiRes)
                res = res.data;
                if (option.noCode) {
                    resolve(res)
                } else if (res.code) {
                    let toastMsg // 报错信息
                    // if (res.message === 'token错误') res.message = '请登录'
                    if (res.code === 1) {
                        if (option.showOkMsg) toastMsg = res.message || '操作成功!'
                    } else if (res.code === 401) {
                        console.log('code = 401');
                        // afterTokenError(option)
                    } else {
                        if (option.showErrorMsg) {
                            if (res.status && res.error) res.message = res.error
                            toastMsg = res.message || '接口返回值异常!'
                        }
                    }
                    if (toastMsg) setTimeout(() => {
                        uni.showToast({
                            title: toastMsg,
                            icon: 'none'
                        })
                    }, 100);
                    resolve(res)
                }
            },
            fail(ret) {
                if (option.showErrorMsg) {
                    setTimeout(() => {
                        uni.showToast({
                            title: ret.message || '接口访问异常!',
                            icon: 'none'
                        })
                    }, 100)
                }
                // printApiRes
                var printApiRet = {
                    '接口地址': option.url,
                    '提交值': option,
                    '返回值': ret
                }
                console.debug('printApiRet：', printApiRet)
                reject(ret)
            },
            complete() {
                if (option.showLoading) uni.hideLoading();
            }
        })
    })
}
const naviTo = (url) => {
    uni.navigateTo({ url: url })
}
Vue.prototype.$ajax = ajax;
Vue.prototype.$naviTo = naviTo;