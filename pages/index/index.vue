<template>
    <view id="index">
        <view class="welcome"
              v-if="uid">
            欢迎用户[{{uid}}]回来！
        </view>
        <view class="button-wrap">
            <button @tap="navigateTo('reg_tel')">账户注册</button>
            <button @tap="navigateTo('login')"
                    class="mtop50">密码登录</button>
            <button @tap="navigateTo('login_sms')"
                    class="mtop50">验证码登录</button>
            <button @tap="navigateTo('/pages/reg/index')"
                    class="mtop50">账户开户</button>
        </view>
    </view>
</template>

<script>
export default {
    data () {
        return {
            uid: ''
        }
    },
    onShow () {
        this.uid = uni.getStorageSync('uid') || ''
    },
    methods: {
        navigateTo (url) {
            uni.navigateTo({ url: url })
        }
    }
}
</script>

<style lang='scss' scoped>
.welcome {
    margin: 300rpx auto 0;
    width: 600rpx;
    font-size: 38rpx;
    font-weight: 600;
    text-align: center;
}
.button-wrap {
    margin: 300rpx auto 0;
    width: 600rpx;
}
</style>