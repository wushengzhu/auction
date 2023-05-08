const { encodeBase64 } = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('./config');

const Token = {
    encrypt: function (data, time) { //data加密数据，time过期时间
        return jwt.sign(data, config.jwtSecretKey, { expiresIn: time })
    },
    decrypt: function (token) {
        // 解码的时候记得把Bearer后面的空格去掉
        const curToken = token?.replace('Bearer ', '');
        try {
            const data = jwt.verify(curToken, config.jwtSecretKey);
            return {
                token: true,
                data: data
            };
        } catch (e) {
            return {
                token: false,
                data: e
            }
        }
    }
}

module.exports = Token;