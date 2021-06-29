<template>
    <view id="reg-id">
        <view class="reg_process">
            <view class="reg_process_complete"
                  style="width: 15%;"></view>
        </view>
        <view class="reg-id_main">
            <view class="reg-title">身份验证</view>
            <view class="reg-subtitle">为了符合金融部门监管要求，请您上传身份证正反面</view>
            <view class="reg-hint">
                <i class="icon-shield"></i>
                <view class="reg-hint__text">仅用于开户审核，隐私信息严格保密</view>
            </view>
            <view class="reg-idcard-ul">
                <view class="reg-idcard-li"
                      @tap="onCamera('idcard_front')">
                    <view class="bg-idcard">
                        <image v-if="!idcard_front"
                               class="reg-idcard__img"
                               src="~@/static/bg-idcard-1.png"
                               alt="front" />
                        <image v-else
                               class="reg-idcard__img"
                               :src="idcard_front"
                               alt="front"
                               mode="aspectFill" />
                    </view>
                    <view class="icon-camera"></view>
                    <view class="btn-hint">点击上传身份证正面</view>
                </view>
                <view class="reg-idcard-li"
                      @tap="onCamera('idcard_reverse')">
                    <view class="bg-idcard">
                        <view class="bg-idcard">
                            <image v-if="!idcard_reverse"
                                   class="reg-idcard__img"
                                   src="~@/static/bg-idcard-2.png"
                                   alt="front" />
                            <image v-else
                                   class="reg-idcard__img"
                                   :src="idcard_reverse"
                                   alt="front"
                                   mode="aspectFill" />
                        </view>
                    </view>
                    <view class="icon-camera"></view>
                    <view class="btn-hint">点击上传身份证反面</view>
                </view>
            </view>
            <view class="reg-tit">拍摄要求</view>
            <view class="camera-demand-ul">
                <view class="camera-demand-li">
                    <view class="camera-demand-li__img example1"></view>
                    <view class="camera-demand-li__tit">标准</view>
                </view>
                <view class="camera-demand-li">
                    <view class="camera-demand-li__img example2"></view>
                    <view class="camera-demand-li__tit">边角缺失</view>
                </view>
                <view class="camera-demand-li">
                    <view class="camera-demand-li__img example3"></view>
                    <view class="camera-demand-li__tit">照片模糊</view>
                </view>
                <view class="camera-demand-li">
                    <view class="camera-demand-li__img example4"></view>
                    <view class="camera-demand-li__tit">反光强烈</view>
                </view>
            </view>
        </view>
        <view class="fixedBtn">
            <view class="k-btn  info btn1">上一步</view>
            <view class="k-btn primary btn2"
                  v-if="!btnLock&&!apiLock"
                  @tap="saveIdcard">确认，下一步</view>
            <view v-else
                  class="k-btn disabled btn2">操作中...</view>
        </view>
    </view>
</template>

<script>
import { pathToBase64 } from '@/component/image-tools/index'
import { _throttle } from '@/common/js/com'
export default {
    data () {
        return {
            idcard_front: '',
            idcard_reverse: '',
            btnLock: false,
            apiLock: false,
        }
    },
    methods: {
        onCamera (pName) {
            let that = this
            uni.chooseImage({
                count: 1, //默认9
                sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
                sourceType: ['camera ', 'album'], //从相册选择
                success: res => {
                    pathToBase64(res.tempFilePaths)
                        .then(path => {
                            that[pName] = path
                        })
                        .catch(error => {
                            console.error('pathToBase64', error)
                        })
                }
            });
        },
        saveIdcard: _throttle(function () {
            if (!this.idcard_front) return uni.showToast({ title: '请上传身份证正面!', icon: 'none' })
            if (!this.idcard_reverse) return uni.showToast({ title: '请上传身份证反面!', icon: 'none' })
            this.btnLock = true
            this.apiLock = true
            this.$ajax({
                url: '/account/uploadIdentity',
                needAuth: true,
                showLoading: true,
                params: {
                    token: uni.getStorageSync('token'),
                },
                data: {
                    face: this.idcard_front.replace(/^data:\S+\/\S+;base64,/, ''),
                    back: this.idcard_reverse.replace(/^data:\S+\/\S+;base64,/, ''),
                }
            }).then(res => {

            }).finally(() => {
                this.apiLock = false
            })
        }, 2000, true, function () {
            this.btnLock = false
        })
    }
}
</script>

<style lang="scss" scoped>
#reg-id {
    color: #333;
    padding-bottom: 180rpx;
    .reg-id_main {
        margin: 50rpx auto 0;
        width: 690rpx;
        height: auto;
        .reg-title {
            width: 100%;
            height: 42rpx;
            line-height: 42rpx;
            font-size: 38rpx;
            font-weight: bold;
            color: #333;
        }
        .reg-subtitle {
            margin-top: 30rpx;
            width: 100%;
            height: 32rpx;
            line-height: 32rpx;
            font-size: 28rpx;
            color: #333;
        }
        .reg-hint {
            display: flex;
            justify-content: flex-start;
            margin-top: 20rpx;
            height: 26rpx;
            line-height: 26rpx;
            font-size: 24rpx;
            .icon-shield {
                width: 26rpx;
                height: 26rpx;
                background: url("~@/static/icon-shield.png") no-repeat center;
                background-size: cover;
            }
            .reg-hint__text {
                flex: 1;
                padding-left: 10rpx;
                box-sizing: border-box;
                color: #999;
            }
        }
        .reg-idcard-ul {
            margin-top: 50rpx;
            width: 100%;
            height: auto;
            .reg-idcard-li {
                position: relative;
                margin: 0 auto;
                padding: 20rpx 0;
                border-radius: 8rpx;
                width: 486rpx;
                height: 306rpx;
                background: #f2f2f2;
                .bg-idcard {
                    margin: 0 auto;
                    width: 390rpx;
                    height: 242rpx;
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                    .reg-idcard__img {
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                }
                &:not(:first-child) {
                    margin-top: 50rpx;
                }
                &:active {
                    opacity: 0.5;
                }
                .btn-hint {
                    margin-top: 20rpx;
                    color: #333;
                    text-align: center;
                    font-size: 28rpx;
                }
                .icon-camera {
                    position: absolute;
                    right: 30rpx;
                    bottom: 70rpx;
                    z-index: 30;
                    border-radius: 50%;
                    width: 110rpx;
                    height: 110rpx;
                    background: rgba(0, 0, 0, 0.5)
                        url("~@/static/icon-camera.png") no-repeat center;
                    background-size: 60rpx 60rpx;
                }
            }
        }
        .reg-tit {
            margin-top: 30rpx;
            width: 100%;
            height: 34rpx;
            line-height: 34rpx;
            font-size: 32rpx;
        }
        .camera-demand-ul {
            display: flex;
            justify-content: flex-start;
            margin-top: 20rpx;
            width: 100%;
            height: auto;
            border-radius: 8rpx;
            background: #f2f7fe;
            .camera-demand-li {
                flex: 1;
                padding: 4rpx;
                box-sizing: border-box;
                .camera-demand-li__img {
                    margin: 0 auto;
                    width: 160rpx;
                    height: 116rpx;
                    background-repeat: no-repeat;
                    background-size: cover;
                    &.example1 {
                        background-image: url("~@/static/yaoqiu_01.png");
                    }
                    &.example2 {
                        background-image: url("~@/static/yaoqiu_02.png");
                    }
                    &.example3 {
                        background-image: url("~@/static/yaoqiu_03.png");
                    }
                    &.example4 {
                        background-image: url("~@/static/yaoqiu_04.png");
                    }
                }
                .camera-demand-li__tit {
                    font-size: 24rpx;
                    text-align: center;
                }
            }
        }
    }
}
</style>