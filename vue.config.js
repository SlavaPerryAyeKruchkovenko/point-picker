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
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '@Components': path.resolve(__dirname, 'src/components'),
                '@Views': path.resolve(__dirname, 'src/views'),
                '@Store': path.resolve(__dirname, 'src/store'),
                '@Assets': path.resolve(__dirname, 'src/assets'),
                '@Router': path.resolve(__dirname, 'src/router'),
                '@Models': path.resolve(__dirname, 'src/models'),
                '@Helpers': path.resolve(__dirname, 'src/helpers'),
                'vue$': 'vue/dist/vue.esm-bundler.js'
            }
        },
        entry: {
            app: './index.ts'
        }
    },
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].template = 'index.html'
                return args
            })
    }
})
