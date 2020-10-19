module.exports = {
    publicPath: './',
    // chainWebpack和configureWebpack都可以修改入口文件，两者的作用是一样的，它们的区别：
    // chainWebpack可以通过链式编程的形式，修改webpack配置
    // configureWebpack可以通过操作对象的形式，修改webpack配置
    chainWebpack: config => {
        //发布模式
        config.when(process.env.NODE_ENV === 'production', config => {
            // 通过when函数判断当前处于的模式
            //entry找到默认的打包入口，调用clear方法删除默认的打包入口(main.js)
            //add添加新的打包入口
            config.entry('app').clear().add('./src/main-prod.js');

            //使用externals设置排除项
            // 默认情况下，依赖项的所有第三方包都会被打包到js/chunk-vendors.******.js文件中，导致该js文件过大
            // 那么我们可以通过externals排除这些包，使它们不被打包到js/chunk-vendors.******.js文件中
            // 只有发布模式下才有必要配置
            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                nprogress: 'NProgress',
                // 'vee-validate':'VeeValidate'
            })

            //使用插件
            // 调用html插件
            config.plugin('html').tap(args => {
                //添加参数isProd
                args[0].isProd = true
                return args
            })
        })


        //开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')

            //使用插件
            config.plugin('html').tap(args => {
                //添加参数isProd
                args[0].isProd = false
                return args
            })

        })
    },
}