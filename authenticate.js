const express = require("express");
const router = express.Router();
const sql = require("jm-ez-mysql");
const { ResponseBuilder } = require("./helpers/responsebuilder");
const { Jwt } = require("./helpers/jwt")
router.post('/adminLogin', async (req, res, next) => {
    const data = await sql.query(`select * from admin where Email = '${req.body.email}' and password = '${req.body.password}'`);
    if (data.length > 0) {
        const user = data[0];
        let token = Jwt.getAuthToken({ userId: user.id, role: "Admin" });
        data[0].token = token;
        return res.status(200).json(ResponseBuilder.data(data, "Welcome Back"));
    }else{
        return res.status(500).json(ResponseBuilder.errorMessage("Invalid Credentials."));
    }
});


module.exports = router;
