<template>
    <view id="reg_tel">
        <view class="page-title-wrap">
            <view class="icon-logo">XF</view>
            <view class="page-title">密码登录</view>
        </view>
        <view class="k-cells reg-cells">
            <view class="k-cell">
                <view class="k-cell__hd">
                    <view class="k-label">+86</view>
                </view>
                <view class="k-cell__bd">
                    <input type="text"
                           maxlength='11'
                           placeholder="请输入手机号"
                           v-model.trim="phone">
                </view>
                <view class="k-cell__ft">
                    <view class="icon icon-close"
                          v-if="phone"
                          @tap="phone=''"></view>
                </view>
            </view>
            <view class="k-cell">
                <view class="k-cell__bd">
                    <input v-if="!password_show"
                           type="password"
                           placeholder="请输入密码"
                           v-model.trim="password">
                    <input v-else
                           type="text"
                           placeholder="请输入密码"
                           v-model.trim="password">
                </view>
                <view class="k-cell__ft">
                    <view class="icon icon-close"
                          v-if="password"
                          @tap="password=''"></view>
                    <view class="icon"
                          :class="[password_show?'icon-eye-open':'icon-eye-close']"
                          @tap="password_show=!password_show"></view>
                </view>
            </view>
        </view>
        <view class="reg_hint between">
            <view class="c000">邮箱账号登录</view>
            <view>忘记密码</view>
        </view>
        <view class="submit-wrap">
            <view v-if="!btnLock"
                  class="k-btn primary round"
                  @tap="onSubmit">登录</view>
            <view v-else
                  class="k-btn disabled round">操作中</view>
        </view>
        <view class="reg_hint text_left">提示：登录方式有账号(手机或邮箱)密码、短信验证码</view>
        <!-- popup -->
        <uni-popup ref="popup"
                   type="center">
            <view class="popup-wrap">
                <view class="page-title-wrap">
                    <view class="icon-logo">XF</view>
                    <view class="page-title">请输入图形验证码</view>
                </view>
                <view class="k-cells reg-cells">
                    <view class="k-cell">
                        <view class="k-cell__bd">
                            <input type="text"
                                   maxlength='4'
                                   placeholder="请输入图形验证码"
                                   v-model.trim="captcha"
                                   @input="captchaInput">
                        </view>
                        <view class="k-cell__ft">
                            <view class="icon icon-close"
                                  v-if="this.captcha"
                                  @tap="captcha=''"></view>
                            <image @tap="onCaptcha"
                                   v-if="captcha_refresh"
                                   class="captcha"
                                   :src="captchaUrl"
                                   alt="captcha">
                        </view>
                    </view>
                </view>
                <view class="popup-hint">提示：点击图片可刷新图形码。</view>
                <view class="popup-btns">
                    <view class="k-btn info round popup-btn-cancel"
                          @tap="onPopupCancel">取消</view>
                    <view class="k-btn primary round popup-btn-confirm"
                          @tap="onPopupconfirm">确认</view>
                </view>
            </view>
        </uni-popup>
    </view>
</template>

<script>
import { validate } from '@/common/js/validate'
import { _throttle } from '@/common/js/com'
export default {
    data () {
        return {
            phone: '18576754500', // 18576754500
            password: 'Nihao222', // Nihao222
            yzm: '',
            re_password: '',
            timer: '',
            timer_s: '',
            password_show: false,
            re_password_show: false,
            btnLock: false,
            // popup
            captchaUrl: '',
            captcha_refresh: true,
            captcha: '',
        }
    },
    onLoad () {
    },
    mounted () {
        this.captchaUrl = this.$baseDomain + '/account/captcha'
    },
    methods: {
        onSubmit: _throttle(function () {
            var rules = [
                [
                    this.phone,
                    [
                        { required: true, message: '手机不能为空' },
                        { type: 'phone', message: '请输入正确的手机格式' },
                    ]
                ],
                // [
                //     this.yzm,
                //     [
                //         { required: true, message: '验证码不能为空' },
                //         { min: 4, message: '请输入4位的验证码' },
                //     ]
                // ],
                [
                    this.password,
                    [
                        { required: true, message: '密码不能为空' },
                        { min: 4, message: '请输入6位以上的密码' },
                    ]
                ],
            ]
            if (!validate(rules)) { return false };
            this.$refs.popup.open()
        }, 2000, true),
        // popup
        captchaInput () {
            if (this.captcha.length >= 4) {
                this.onPopupconfirm()
            }
        },
        onCaptcha () {
            let that = this
            this.captcha_refresh = false
            setTimeout(() => {
                that.captcha_refresh = true
            }, 100);
        },
        onPopupconfirm: _throttle(function () {
            var rules = [
                [
                    this.captcha,
                    [
                        { required: true, message: '验证码不能为空' },
                        { min: 4, message: '验证码为4位数字或字符' },
                    ]
                ],
            ]
            if (!validate(rules)) { return false };
            this.btnLock = true
            this.$ajax({
                url: '/account/login',
                params: {
                    phone: this.phone,
                    password: this.password,
                    captcha: this.captcha,
                    login_type: 1,
                }
            }).then(res => {
                if (res.code === 1) {
                    uni.setStorageSync('token', res.data.token)
                    uni.setStorageSync('uid', res.data.uid)
                    uni.showModal({
                        title: '温馨提示', content: '登录成功，确认返回首页', showCancel: false, success: (res) => {
                            uni.redirectTo({ url: 'index' })
                            this.onPopupCancel()
                        }
                    })
                } else {
                    uni.showModal({ title: '温馨提示', content: res.message, showCancel: false })
                }
            })
        }, 1000, true, function () {
            this.btnLock = false
        }),
        onPopupCancel () {
            this.captcha = ''
            this.$refs.popup.close()
        },
    }
}
</script>

<style lang="scss">
#reg_tel {
    margin: 0 auto;
    padding-top: 88rpx;
    width: 630rpx;
    .reg-cells {
        margin-top: 70rpx;
    }
    .submit-wrap {
        margin-top: 100rpx;
    }
    .popup-wrap {
        margin: 0 auto;
        width: 690rpx;
        padding: 30rpx;
        border-radius: 16rpx;
        box-sizing: border-box;
        background: #fff;
        .captcha {
            display: block;
            margin-left: 10rpx;
            width: 192rpx;
            height: 74rpx;
        }
        .popup-btns {
            display: flex;
            justify-content: space-around;
            margin-top: 50rpx;
            .k-btn {
                width: 45%;
            }
        }
        .popup-hint {
            margin-top: 20rpx;
            width: 100%;
            height: 28rpx;
            line-height: 28rpx;
            font-size: 24rpx;
            color: #999;
            text-align: center;
        }
    }
    .reg_hint {
        margin-top: 30rpx;
        height: 28rpx;
        line-height: 28rpx;
        font-size: 24rpx;
        text-align: center;
        color: #999;
        &.text-r {
            text-align: right;
        }
        &.between {
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>