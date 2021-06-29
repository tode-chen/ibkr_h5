<template>
    <view id="veriFace">
        <view v-if="jsLock"
              class="k-btn disabled">点击人脸识别</view>
        <view v-else-if="!jsLock&&!btnLock&&!apiLock"
              class="k-btn primary"
              @tap="submit">点击人脸识别</view>
        <view v-else
              class="k-btn disabled">操作中...</view>
        <view></view>
    </view>
</template>

<script>
import { _throttle, appendJScript } from '@/common/js/com'
export default {
    data () {
        return {
            jsUrl: "https://cn-shanghai-aliyun-cloudauth.oss-cn-shanghai.aliyuncs.com/web_sdk_js/jsvm_all.js",
            metainfo: '',
            jsLock: '',
            btnLock: '',
            apiLock: '',
        }
    },
    onLoad () {
        this.jsLock = true
        appendJScript(this.jsUrl).then(res => {
            let obj = getMetaInfo()
            if (obj) this.metainfo = encodeURIComponent(JSON.stringify(obj))
            console.log('metainfo', obj, this.metainfo);
        }).finally(() => {
            this.jsLock = false
            console.log('11', this.jsLock);
        })
    },
    methods: {
        submit: _throttle(function () {
            this.btnLock = true
            if (!this.metainfo) return console.log('lack metainfo...');
            this.apiLock = true
            this.$ajax({
                url: '/account/requestFaceVerify',
                needAuth: true,
                params: {
                    token: uni.getStorageSync('token'),
                    name: '陈涛', // debugger
                    idno: '360702198504210618',
                    metainfo: this.metainfo,
                }
            }).then(res => {
                if (res.code === 1) {
                    console.log('res.data.certifyUrl', res.data.certifyUrl);
                    if (res.data && res.data.certifyUrl) window.location.href = res.data.certifyUrl
                }
            }).finally(() => {
                this.apiLock = false
            })
        }, 2000, true, function () {
            this.btnLock = false
        }),
    }
}
</script>

<style lang="scss" scoped>
#veriFace {
    padding: 200rpx 30rpx;
    box-sizing: border-box;
}
</style>