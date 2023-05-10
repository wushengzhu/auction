// 额外配置webpack，需要下面插件，并在angular.json中配置
const path = require('path')
// yarn add @angular-builders/custom-webpack -D
module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 8192, // 小于 8KB 的 SVG 文件将内联到 JavaScript 中
              noquotes: true, // 不添加引号，以避免在打包时出现语法错误
            },
          },
        ],
      },
        {
          test: /\.less$/,
          loader: 'less-loader',
          options: {
            lessOptions: {
                modifyVars: {
                // 修改主题变量
                'border-radius-base': '3px',
                'tabs-horizontal-padding': '12px 16px',
              },
              javascriptEnabled: true,
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
          include: [
            path.resolve(__dirname, 'node_modules/@ckeditor')
          ]
        }
    ]
  }
}
