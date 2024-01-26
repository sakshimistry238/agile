const sql = require("jm-ez-mysql");
const moment = (require("moment-timezone"));
const { ResponseBuilder } = require("../helpers/responsebuilder");
const getUserDetail = async (req, res, next) => {
    try {
        const { search, order, length, start, draw } = req.body;
        const column = ['', 'name', 'phone', 'email', 'address', 'status']
        let query1 = ``;
        const status = search.value == "1" ? 'status = 1' : 'status = 0';
        if (search && (search.value == "1" || search.value == "0")) {
            query1 += `${status} `
        } else {
            query1 += `name LIKE '%${search.value}%' OR phone LIKE '%${search.value}%' OR email LIKE '%${search.value}%' OR address LIKE '%${search.value}%'`
        }
        const { result, count } = await sql.findAllWithCount(`user`, 'id', ['COUNT(*) OVER() as total', 'id as UserId', 'phone', 'email', `address`, 'status'], query1, ` ORDER BY ${column[order[0].column]} ${order[0].dir} limit ? OFFSET ?`, [length, start]);
        if (result.length > 0) {
            const data = {
                "data": result,
                "draw": draw,
                "recordsTotal": count,
                "recordsFiltered": result[0].total,
            }
            return res.status(200).json(ResponseBuilder.data(data, "Success"));
        } else {
            const data = {
                "data": [],
                "draw": draw,
                "recordsTotal": 0,
                "recordsFiltered": 0,
            }
            return res.status(200).json(ResponseBuilder.data(data, "Success"));
        }
    } catch (error) {
        return res.status(500).json(ResponseBuilder.errorMessage(error.message))
    }
}



const RegisterNewUser = async (req, res, next) => {
    try {
        const data = await sql.query(`select * from user where email='${req.body.email}'`);
        var date = moment().format("YYYY-MM-DD HH:mm:ss");
        if (data != null && data.length > 0) {
            return res.status(500).json(ResponseBuilder.errorMessage("This email is already register, Please use another email."))
        } else {
            const data2 = await sql.query(`insert into user (id,name,phone,email,address,status,created_at) values (null,'${req.body.name}',${req.body.phone},'${req.body.email}','${req.body.address}',${req.body.status},'${date}')`)

            if (data2) {
                return res.status(200).json(ResponseBuilder.data(data2, "User Registered SucessFully"));
            } else {
                return res.status(500).json(ResponseBuilder.errorMessage("User not Registered"))
            }
        }
    } catch (error) {
        return res.status(500).json(ResponseBuilder.errorMessage(error.message))
    }
}

const updateUser = async (req, res, next) => {
    try {
        let { ...updateFields } = req.body;
        const { id } = req.params;
        const fields = Object.keys(updateFields);
        const values = Object.values(updateFields)
        const queryFieldValues = [...values, id];
        let extendedQuery = "";
        fields.forEach((key, i) => {
            const separator = i + 1 === fields.length ? "" : ",";
            extendedQuery = extendedQuery + " " + `${key} = ?` + " " + separator;
        });
        const query = `UPDATE user  SET ${extendedQuery} WHERE id = ?`;
        console.log(query);
        console.log(queryFieldValues);
        const data = await sql.query(query,queryFieldValues);
        if (data.affectedRows > 0) {
            return res.status(200).json(ResponseBuilder.data([], "User Updated SucessFully"));
        } else {
            return res.status(200).json(ResponseBuilder.data([], "Data not Found"));
        }

    } catch (error) {
        return res.status(500).json(ResponseBuilder.errorMessage(error.message))
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const data = await sql.query(`delete from user where id = ${req.params.id}`)
        if (data.affectedRows > 0) {
            return res.status(200).json(ResponseBuilder.data([], "User Deleted SucessFully"));;
        } else {
            return res.status(200).json(ResponseBuilder.errorMessage("Data Not Found"))
        }
    } catch (error) {
        return res.status(500).json(ResponseBuilder.errorMessage(error.message))
    }
}
const getInActiveUser = async (req, res, next) => {
    try {
        const data = await sql.query(`select * from user where status = 0`)
        if (data) {
            return res.status(200).json(ResponseBuilder.data(data, "SucessFul"));;
        }
    } catch (error) {
        return res.status(500).json(ResponseBuilder.errorMessage(error.message))
    }
}

const getActiveUser = async (req, res, next) => {
    try {
        const data = await sql.query(`select * from user where status = 1`)
        if (data) {
            return res.status(200).json(ResponseBuilder.data(data, "SucessFul"));;
        }
    } catch (error) {
        return res.status(500).json(ResponseBuilder.errorMessage(error.message))
    }
}

const toggle_status = async (req, res) => {
    try {
        const data = await sql.query('SELECT * FROM user WHERE id = ?', [req.params.id]);
        if (data.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const newStatus = data[0].status === 1 ? 0 : 1;
        await sql.query('UPDATE user SET status = ? WHERE id = ?', [newStatus, req.params.id]);
        return res.status(200).json(ResponseBuilder.errorMessage("User status toggled successfully"))
    } catch (error) {
        console.error(error);
        return res.status(500).json(ResponseBuilder.errorMessage(error.message))
    }
}
module.exports = {
    getUserDetail,
    RegisterNewUser,
    updateUser,
    deleteUser,
    getInActiveUser,
    getActiveUser,
    toggle_status
}