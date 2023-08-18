const {defineConfig} = require('@vue/cli-service');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        port: 3000
    },
    configureWebpack: {
        plugins: [
            new HtmlWebpackPlugin({
                template: 'index.html'
            })
        ]
    },
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].template = 'index.html'
                return args
            })
        config.resolve.alias
            .set('@', path.resolve(__dirname, 'src'))
            .set('@Components', path.resolve(__dirname, 'src/components'))
            .set('@Views', path.resolve(__dirname, 'src/views'))
            .set('@Store', path.resolve(__dirname,'src/store'))
            .set('@Assets', path.resolve(__dirname,'src/assets'))
            .set('@Router', path.resolve(__dirname,'src/router'))
            .set('@Models', path.resolve(__dirname,'src/models'))
    }
})
