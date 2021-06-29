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
//防抖
export function _debounce(fn, wait = 300, isImmediate = false) {
    var timerId = null;
    var flag = true;
    return function () {
        var context = this
        var args = arguments
        clearTimeout(timerId)
        if (isImmediate) {
            if (flag) {
                fn.apply(context, args)
                flag = false
            }
            timerId = setTimeout(function () {
                flag = true
            }, wait)
        } else {
            timerId = setTimeout(function () {
                fn.apply(context, args)
            }, wait)
        }
    }
}
// 节流
export function _throttle(fn, wait = 300, isImmediate = false, callback) {
    var flag = true;
    return function () {
        if (flag == true) {
            var context = this
            var args = arguments
            flag = false
            isImmediate && fn.apply(context, args)
            setTimeout(() => {
                !isImmediate && fn.apply(context, args)
                flag = true
                if (callback) callback.apply(context, args);
            }, wait)
        }
    }
}
export function appendJScript(url) {
    return new Promise((resovle, reject) => {
        var script = document.createElement('script')
        script.type = 'text/javascript';
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == 'loaded' || script.readyState == 'complete') {
                    script.onreadystatechange = null;
                    resovle('success');
                }
            };
        } else {
            //其他浏览器
            script.onload = function () {
                resovle('success');
            };
            script.onerror = function () {
                reject('fail');
            }
        }
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    })
}