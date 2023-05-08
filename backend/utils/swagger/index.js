const path = require('path')
const express = require('express')
const swaggerUI = require('swagger-ui-express')
const expressSwagger = require('express-swagger-generator')
// const swaggerDoc = require('swagger-jsdoc')

//配置swagger-jsdoc
const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Auction',
            version: '1.0.0',
            description: `廉洁拍卖项目的相关api接口`
        },
        schemes: ['http', 'https'],
    },
    route: {
        url: '/swagger',
        docs: '/swagger.json' //swagger文件 api
    },
    basedir: __dirname, //app absolute path
    files: ['../../routes_handler/auction/*.js', '../../routes_handler/user/*.js'] //Path to the API handle folder
}

const swaggerJson = function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
}
const swaggerSpec = expressSwagger(options);
const swaggerInstall = function (app) {
    if (!app) {
        app = express()
    }
    // 开放相关接口，
    app.get('/swagger.json', swaggerJson);
    // 使用 swaggerSpec 生成 swagger 文档页面，并开放在指定路由
    app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
}
module.exports = swaggerInstall
