<template>
    <view id="reg_tel">
        <view class="page-title-wrap">
            <view class="icon-logo">XF</view>
            <view class="page-title">账户注册</view>
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
                    <text class="yzm k-active"
                          v-if="!timer_s"
                          @tap="getYzm">获取验证码</text>
                    <text class="yzm k-active"
                          v-else>{{timer_s}}s后重新获取</text>
                </view>
            </view>
            <view class="k-cell">
                <view class="k-cell__bd">
                    <input type="text"
                           maxlength='4'
                           placeholder="请输入验证码"
                           v-model.trim="yzm">
                </view>
                <view class="k-cell__ft">
                    <view class="icon icon-close"
                          v-if="yzm"
                          @tap="yzm=''"></view>
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
        <view class="submit-wrap">
            <view class="k-btn primary round"
                  @tap="onSubmit">注册</view>
        </view>
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
                                   src="http://47.119.202.153/account/captcha"
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
import { countDown } from '@/common/js/fns'
export default {
    data () {
        return {
            // debugger
            phone: '18576754500',
            yzm: '',
            password: '',
            timer: '',
            timer_s: '',
            password_show: false,
            // popup
            captcha_refresh: true,
            captcha: '',
        }
    },
    onLoad () {
    },
    mounted () {
        this.$refs.popup.open()
    },
    methods: {
        getYzm () {
            var rules = [
                [
                    this.phone,
                    [
                        { required: true, message: '手机不能为空' },
                        { type: 'phone', message: '请输入正确的手机格式' },
                    ]
                ],
            ]
            if (!validate(rules)) { return false };
            this.$refs.popup.open()
        },
        onSubmit () {
            var rules = [
                [
                    this.phone,
                    [
                        { required: true, message: '手机不能为空' },
                        { type: 'phone', message: '请输入正确的手机格式' },
                    ]
                ],
                [
                    this.yzm,
                    [
                        { required: true, message: '验证码不能为空' },
                        { min: 4, message: '请输入4位的验证码' },
                    ]
                ],
                [
                    this.password,
                    [
                        { required: true, message: '密码不能为空' },
                        { min: 4, message: '请输入6位以上的密码' },
                    ]
                ],
            ]
            if (!validate(rules)) { return false };
            uni.request({
                url: `http://47.119.202.153/account/register?phone=${this.phone}&code=${this.yzm}&password=${this.password}`,
                method: 'post',
                data: {
                    phone: this.phone,
                    code: this.yzm,
                    password: this.password,
                },
                success: (res) => {
                    var r = res.data
                    console.log(r);
                    if (r.code === 1) {
                        // token: "e1b4fdc4a5d94ba7ba81e108e23ddf5d"
                        // uid: 879
                        uni.setStorageSync('token', r.token)
                        uni.setStorageSync('uid', r.uid)
                        uni.showModal({
                            title: '温馨提示', content: '注册成功，确认返回首页', success: (r) => {
                                if (r.confirm) uni.redirectTo({ url: 'index' })
                            }
                        })
                    } else {
                        uni.showModal({ title: '温馨提示', content: r.message, showCancel: false })
                    }
                },
                fail: (ret) => {
                    if (ret.data.message) uni.showModal({ title: '温馨提示', content: ret.data.message, showCancel: false })
                }
            });
        },
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
        onPopupconfirm () {
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
            this.$ajax({
                url: '/account/sendcode',
                showLoading: true,
                params: {
                    phone: this.phone,
                    type: 1,
                    captcha: this.captcha
                }
            }).then(res => {
                if (res.code === 1) {
                    countDown(() => {
                        this.timer_s = ''
                    }, this)
                    this.$refs.popup.close()
                } else if (res.code === -1 && res.message === '图形验证码已过期,请重新获取.') {
                    this.onCaptcha()
                }
                if (res.message) uni.showModal({ title: '温馨提示', content: res.message, showCancel: false })
            })
        },
        onPopupCancel () {
            countDown(() => {
                this.timer_s = ''
            }, this, 3)
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
}
</style>