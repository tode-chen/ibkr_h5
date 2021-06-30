<template>
    <view id="reg-personal">
        <view class="reg_process">
            <view class="reg_process_complete"
                  style="width: 15%;"></view>
        </view>
        <view class="reg-form-wrap">
            <view class="reg-title2">个人基础信息</view>
            <view class="k-cells">
                <view class="k-cell">
                    <view class="k-cell__hd">
                        <label class="k-label">姓</label>
                    </view>
                    <view class="k-cell__bd">
                        <input type="text"
                               v-model="firstName"
                               placeholder="请输入您的姓">
                    </view>
                </view>
                <view class="k-cell">
                    <view class="k-cell__hd">
                        <label class="k-label">姓的拼音</label>
                    </view>
                    <view class="k-cell__bd">
                        <input type="text"
                               v-model="firstNameSpell"
                               placeholder="请输入您的姓的拼音">
                    </view>
                </view>
                <view class="k-cell">
                    <view class="k-cell__hd">
                        <label class="k-label">名</label>
                    </view>
                    <view class="k-cell__bd">
                        <input type="text"
                               v-model="name"
                               placeholder="请输入您的名">
                    </view>
                </view>
                <view class="k-cell">
                    <view class="k-cell__hd">
                        <label class="k-label">名的拼音</label>
                    </view>
                    <view class="k-cell__bd">
                        <input type="text"
                               v-model="nameSpell"
                               placeholder="请输入您的名的拼音">
                    </view>
                </view>
                <view class="form-hint">请务必准确填写姓名拼音,否则或导致出入金失败影响交易</view>
                <view class="k-cell">
                    <view class="k-cell__hd">
                        <label class="k-label">身份证号码</label>
                    </view>
                    <view class="k-cell__bd">
                        <input type="idcard"
                               v-model="idcard"
                               placeholder="请输入您的身份证号码">
                    </view>
                </view>
                <picker mode="date"
                        :value="birthday_i"
                        start="1900-01-01"
                        @change="pickBirthday">
                    <view class="k-cell k-cell_access">
                        <view class="k-cell__hd">
                            <label class="k-label">出生日期</label>
                        </view>
                        <view class="k-cell__bd">
                            <input type="text"
                                   placeholder="请输入您的出生日期"
                                   v-model="birthday"
                                   disabled>
                        </view>
                        <view class="k-cell__ft"></view>
                    </view>
                </picker>
                <picker :value="gender_i"
                        :range="genderArr"
                        @change="pickGender">
                    <view class="k-cell k-cell_access">
                        <view class="k-cell__hd">
                            <label class="k-label">性别</label>
                        </view>
                        <view class="k-cell__bd">
                            <input type="text"
                                   placeholder="请输入您的性别"
                                   v-model="gender"
                                   disabled>
                        </view>
                        <view class="k-cell__ft"></view>
                    </view>
                </picker>
                <view class="k-cell">
                    <view class="k-cell__hd">
                        <label class="k-label">邮箱</label>
                    </view>
                    <view class="k-cell__bd">
                        <input type="text"
                               v-model="email"
                               placeholder="请输入您的邮箱">
                    </view>
                </view>
                <view class="form-hint2">开户、出入金、交易通知会发送至此邮箱，请正确填写！</view>
            </view>
        </view>
        <view></view>
        <view class="fixedBtn">
            <view class="k-btn  info btn1">上一步</view>
            <view class="k-btn primary btn2"
                  v-if="!btnLock&&!apiLock"
                  @tap="submit">确认，下一步</view>
            <view v-else
                  class="k-btn disabled btn2">操作中...</view>
        </view>
    </view>
</template>

<script>
import { _throttle } from '@/common/js/com'
import { validata } from '@/common/js/validata'
export default {
    data () {
        return {
            // form
            firstName: '',
            firstNameSpell: '',
            name: '',
            nameSpell: '',
            idcard: '',
            birthday: '',
            gender: '',
            email: '',
            // 
            birthday_i: '', // 默认值，格式Y-M-D
            gender_i: 0, // 默认值, 格式number
            genderArr: ['男', '女'],
            btnLock: false,
            apiLock: false,
        }
    },
    methods: {
        pickBirthday (e) {
            this.birthday = e.detail.value
        },
        pickGender (e) {
            this.gender = this.genderArr[e.detail.value]
        },
        submit: _throttle(function () {
            this.btnLock = true
            var rules = [
                [this.firstName, [{ required: true, message: '请填写[姓]' },]],
                [this.firstNameSpell, [{ required: true, message: '请填写[姓的拼音]' },]],
                [this.name, [{ required: true, message: '请填写[名]' },]],
                [this.nameSpell, [{ required: true, message: '请填写[名的拼音]' },]],
                [this.idcard, [{ required: true, message: '请填写[身份证号码]' },]],
                [this.birthday, [{ required: true, message: '请填写[出生日期]' },]],
                [this.gender, [{ required: true, message: '请填写[性别]' },]],
                [
                    this.email, [
                        { required: true, message: '请填写[邮箱]' },
                        { type: 'email', message: '请填写正确格式的[邮箱]' },
                    ]
                ],
            ]
            if (!validata(rules)) { return false };
            uni.showModal({
                title: '温馨提示', content: `邮箱用于接收开户、出入金、交易通知等重要信息，请务必再次确认邮箱是否正确：${this.email}`, success: (res) => {
                    if (res.confirm) uni.navigateTo({ url: '/pages/kakouFrom/healthForm' })
                }
            })
            // 邮箱用于接收开户、出入金、交易通知等重要信息，请务必再次确认邮箱是否正确：abcdefg@qq.com
        }, 1500, true, function () {
            this.btnLock = false
        })
    }
}
</script>

<style lang="scss" scoped>
#reg-personal {
    color: #333;
    padding-bottom: 180rpx;
    .reg-form-wrap {
        margin-top: 70rpx;
        .k-cells {
            margin-top: 20rpx;
        }
    }
}
</style>