<template>
    <view id="reg-personal">
        <view class="reg_process">
            <view class="reg_process_complete"
                  style="width: 15%;"></view>
        </view>
        <view class="reg-form-wrap">
            <view class="reg-title2">证件地址信息</view>
            <view class="k-cells">
                <picker :value="region_i"
                        :range="region_arr"
                        @change="pickChange($event, 'region', 'region_arr')">
                    <view class="k-cell k-cell_access">
                        <view class="k-cell__hd">
                            <label class="k-label">证件地址</label>
                        </view>
                        <view class="k-cell__bd">
                            <input type="text"
                                   placeholder="请输入证件地址"
                                   v-model="region"
                                   disabled>
                        </view>
                        <view class="k-cell__ft"></view>
                    </view>
                </picker>
                <view class="k-cell">
                    <view class="k-cell__hd">
                        <label class="k-label">详细地址</label>
                    </view>
                    <view class="k-cell__bd">
                        <input type="text"
                               v-model="addr"
                               placeholder="请输入详细地址">
                    </view>
                </view>
                <view class="k-cell">
                    <view class="k-cell__hd">
                        <label class="k-label">邮政编码</label>
                    </view>
                    <view class="k-cell__bd">
                        <input type="text"
                               v-model="postalCode"
                               placeholder="请输入邮政编码">
                    </view>
                </view>
            </view>
            <view class="reg-title2 mtop50">家庭状况</view>
            <view class="k-cells">
                <picker :value="isMarry_i"
                        :range="isMarry_arr"
                        @change="pickChange($event, 'isMarry', 'isMarry_arr')">
                    <view class="k-cell k-cell_access">
                        <view class="k-cell__hd">
                            <label class="k-label">婚姻状况</label>
                        </view>
                        <view class="k-cell__bd">
                            <input type="text"
                                   placeholder="请选择婚姻状况"
                                   v-model="isMarry"
                                   disabled>
                        </view>
                        <view class="k-cell__ft"></view>
                    </view>
                </picker>
                <picker :value="family_i"
                        :range="family_arr"
                        @change="pickChange($event, 'family', 'family_arr')">
                    <view class="k-cell k-cell_access">
                        <view class="k-cell__hd">
                            <label class="k-label">家庭成员数</label>
                        </view>
                        <view class="k-cell__bd">
                            <input type="text"
                                   placeholder="请输入家庭成员数"
                                   v-model="family"
                                   disabled>
                        </view>
                        <view class="k-cell__ft"></view>
                    </view>
                </picker>
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
            region: '',
            addr: '',
            postalCode: '',
            isMarry: '',
            family: '',
            // 
            region_i: 0,
            region_arr: ['广东省，深圳', '浙江，杭州'],
            isMarry_i: 0,
            isMarry_arr: ['已婚', '未婚'],
            family_i: 0,
            family_arr: ['1', '2', '3', '4', '5', '>5'],
            btnLock: false,
            apiLock: false,
        }
    },
    methods: {
        pickChange (e, name, arr) {
            this[name] = this[arr][e.detail.value]
        },
        submit: _throttle(function () {
            this.btnLock = true
            var rules = [
                [this.region, [{ required: true, message: '请选择[证件地址]' },]],
                [this.addr, [{ required: true, message: '请填写[详细地址]' },]],
                [this.postalCode, [{ required: true, message: '请填写[邮政编码]' },]],
                [this.isMarry, [{ required: true, message: '请选择[婚姻状况]' },]],
                [this.family, [{ required: true, message: '请选择[家庭成员数]' },]],
            ]
            if (!validata(rules)) { return false };
            uni.navigateTo({ url: '4_occupation' })
        }, 2000, true, function () {
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