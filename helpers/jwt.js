const jwt = require('jsonwebtoken');
class Jwt {
    /*
    * getAuthToken
    */
    static getAuthToken(data) {
        return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "7d" });
    }
    /*
    * decodeAuthToken
    */
    static decodeAuthToken(token) {
        if (token) {
            try {
                return jwt.verify(token, process.env.JWT_SECRET);
            }
            catch (error) {
                // logger.error(error);
                return false;
            }
        }
        return false;
    }
    static getDatafromToken(token) {
        if (token) {
            try {
                return jwt.decode(token, { complete: true });
            }
            catch (error) {
                return false;
            }
        }
        return false;
    }
}
module.exports = { Jwt };