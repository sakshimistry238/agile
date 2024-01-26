const sql = require("jm-ez-mysql");
const { ResponseBuilder } = require("./helpers/responsebuilder");
const { Jwt } = require("./helpers/jwt")

let checkToken = async (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (token) {
        const tokenInfo = Jwt.decodeAuthToken(token);
        if (tokenInfo && tokenInfo.userId) {
            if (tokenInfo.role === 'Admin') {
                const user = await sql.query(`select * from admin where id = ${tokenInfo.userId}`);
                if (user.length > 0) {
                    req._user = user;
                    next();
                } else {
                    return res.status(401).json(ResponseBuilder.badRequest("unautherize"));
                }
            }
        }
    } else {
        return res.status(401).json(ResponseBuilder.badRequest("unautherize"));
    }
}


module.exports = {
    checkToken
}