// 倒计时
export function countDown(callBack, that, interval = 60, timerName = 'timer', intervalShow = 'timer_s') {
    // countDown(()=>{}, 60, this, 'phoneYzmTimer', 'phoneYzmStr')
    // 先清空旧计时器
    if (that[timerName]) clearInterval(that[timerName])
    if (intervalShow) that[intervalShow] = interval
    // 新建计时器
    that[timerName] = setInterval(function () {
        interval--
        if (intervalShow) that[intervalShow] = interval
        // 倒计时结束
        if (interval <= 0) {
            callBack()
            if (that[timerName]) clearInterval(that[timerName])
        }
        console.debug('interval... ...', interval)
    }, 1000)
}