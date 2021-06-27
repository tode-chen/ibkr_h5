<template>
    <view id="reg_index">
        <view class="step-ul">
            <view class="step-li act">正在开户</view>
            <view class="step-li">审核</view>
            <view class="step-li">入金</view>
            <view class="step-li">交易</view>
        </view>
        <view class="switch-ul">
            <view class="switch-li">
                <view class="imgs">
                    <image class="image"
                           src="~@/static/banner-1.jpg"
                           alt="banner">
                        <view class="switch-tit">投资全球</view>
                        <view class="switch-brief">
                            交易市场覆盖沪深/港/美/新加坡，支持股票/窝轮牛熊证/期权/期货品类
                        </view>
                </view>
            </view>
        </view>
        <view class="btnBox">
            <view class="k-btn primary round"
                  @tap="$naviTo('1_id')">继续开户</view>
        </view>
    </view>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
#reg_index{
    overflow: hidden;
    .step-ul {
        position: relative;
        display: flex;
        justify-content: space-between;
        margin: 50rpx auto 0;
        width: 690rpx;
        height: auto;
        font-size: 28rpx;
        &::before {
            content: " ";
            display: block;
            position: absolute;
            top: 0;
            left: 2em;
            right: 2em;
            z-index: 10;
            width: calc(690rpx - 4em);
            height: 1px;
            // background: #e0e0e0;
            background: #ccc;
        }
        .step-li {
            position: relative;
            width: 4em;
            height: 80rpx;
            line-height: 80rpx;
            text-align: center;
            color: #333;
            &::before {
                content: " ";
                display: block;
                position: absolute;
                top: -6rpx;
                left: calc(2em - 6rpx);
                z-index: 20;
                border-radius: 50%;
                width: 12rpx;
                height: 12rpx;
                background: #aaa;
            }
            &.act {
                color: #0d8bf6;
                &::before {
                    top: -20rpx;
                    left: calc(2em - 20rpx);
                    width: 40rpx;
                    height: 40rpx;
                    background: url("~@/static/icon-clock.png") no-repeat;
                    background-size: cover;
                }
            }
        }
    }
    .switch-ul {
        margin: 88rpx auto 0;
        width: 690rpx;
        height: auto;
        .switch-li {
            width: 100%;
            height: auto;
            text-align: center;
            .image {
                display: block;
                margin: 0 auto;
                width: 400rpx;
                height: 400rpx;
                background: url("~@/static/banner-1.jpg") no-repeat center
                    center;
                background-size: 300rpx 300rpx;
            }
            .switch-tit {
                margin-top: 20rpx;
                width: 100%;
                height: 36rpx;
                color: #333;
                font-size: 32rpx;
                font-weight: bold;
            }
            .switch-brief {
                margin-top: 20rpx;
                width: 100%;
                height: 28rpx;
                color: #999;
                font-size: 28rpx;
            }
        }
    }
    .btnBox {
        margin: 200rpx auto 0;
        width: 690rpx;
        height: auto;
    }
}
</style>