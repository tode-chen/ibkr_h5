// # 全局变量： 分受运行环境(env)影响的全局变量，和不受其影响的全局变量（直接命名）
import Vue from 'vue';
// # 环境、版本及对应配置 Start ###
let envSet // 环境配置，是个对象，里面是不同环境对应不同的配置
let envKey // 环境配置envSet的key, 可以手动切换发布（体验环境/开发环境）的对应配置，prod=正式，test=体验，dev=开发，ct=其他环境配置；但不能影响正式版的环境配置。
let envVersion // 实际当前运行的平台（MP/H5/APLI-MP等)的环境名称，所有平台命名规则以微信版为准release=正式, trial=体验，develop=开发
let isBrowser = false // 是否是浏览器，默认不是
let baseDomain // 接口总域名
let apiPath = '' // 接口域名+前缀，比如：https://www.ly3618.com/jx/api
// 这里可以手动赋值用以切换发布体验环境 / 开发环境的对应配置；
envKey = '' // prod,test,dev,ct
// 环境配置
envSet = {
    'prod': {
        // baseDomain: "http://47.119.202.153",
        baseDomain: "https://api.pioneerbrokersnz.com",
        apiAffix: '', // api地址的词缀，apiPath=baseDomain+apiAffix，如https://www.gswesttravel.cn/api
    },
    'test': {
        baseDomain: "https://api.pioneerbrokersnz.com",
        apiAffix: '',
    },
    'dev': {
        baseDomain: "https://api.pioneerbrokersnz.com",
        apiAffix: '',
    },
    // 'local': { // http://v.gswesttravel.cn/tour/api
    //     // 其他配置，如本机
    // },
    // 'ct': {
    //     // 其他配置，可以是其他接口开发者的本机，页可以是本机https://127.0.0.1
    //     // ct=其他开发者姓名缩写（如后端开发），连到其本机进行调试开发
    // },
}
// # 当前应用运行环境名（envVersion）判断；

// #ifdef H5
let h5Domain = location.origin
console.log('h5Domain：', h5Domain);
isBrowser = true
if (h5Domain.indexOf('127.0.0.1') > -1 || h5Domain === envSet['prod'].baseDomain) {
    envVersion = "develop"
} else if (location.search.indexOf('iftest') > -1) {
    envVersion = "trial"
} else if (h5Domain === envSet['test'].baseDomain) {
    envVersion = "release" // 因为H5只有一个服务器，现在H5版本暂用域名中是否包含iftest进行区分正式环境和测试环境；
} else {
    envVersion = "release"
}
// #endif
// # 根据envVersion值给envKey自动赋值，或使用envKey的自定义环境配置；
if (envKey === 'prod' || envVersion === 'release') {
    // 当应用版本环境是正式版时，强制为正式版配置。
    envKey = 'prod' // 务必不修改这里
} else if (envKey && envKey !== 'test' && envKey !== 'trial') {
    // 当envKey有值且不为test,dev,prod时那么envKey为三个版本之外的自定义环境配置；
} else if (envKey === 'test' || envVersion === 'trial') {
    envKey = 'test'
} else if (envKey === 'dev' || envVersion === 'develop') {
    envKey = 'dev'
}
// # 经过环境判断后，分配其对应的环境变量
let envItem = envSet[envKey]
if (envItem) {
    baseDomain = envItem.baseDomain
    apiPath = envItem.baseDomain + envItem.apiAffix
} else {
    // 没有对应的envKey的envSet；
    setTimeout(() => {
        uni.showModal({
            title: '温馨提示',
            content: 'envKey参数错误，请检查!',
            showCancel: false
        })
    }, 100);
    console.log('envKey参数错误，请检查!');
}
// H5读取相对地址，注意本地地址需要做代理；

// #ifdef H5
// if (envVersion !== "trial" && envVersion !== "release") apiPath = apiPath.replace(baseDomain, '');
// #endif
// # 变量打印
console.log('alpha3.0.2');
console.log('envVersion：' + envVersion);
console.log('envKey：' + envKey);
console.log('apiPath：' + apiPath);
Object.assign(Vue.prototype, {
    $envVersion: envVersion, // 当前环境版本
    $apiPath: apiPath, // 接口地址
    basePath: apiPath, // 接口地址
    $baseDomain: baseDomain, // 接口地址
    $envKey: envKey, // 环境变量控制
    $isBrowser: isBrowser,
    $ossImgPath: 'https://www.ly3618.com/remote_static/tourMoJ/asset', // 图片路径
})
// # 变量输出
export {
    apiPath,
    isBrowser
}