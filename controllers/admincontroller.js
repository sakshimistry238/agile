const sql = require("jm-ez-mysql");
const { ResponseBuilder } = require("../helpers/responsebuilder");
const getUserDetail = async (req, res, next) => {
    try {
        const { search, order, length, start, draw,status } = req.body
        console.log(req.body);
        const column = ['', 'name', 'phone', 'email', 'address', 'status']
        let query1 = ``;
        if (search && search.value) {
            query1 += `name LIKE '%${search.value}%' OR phone LIKE '%${search.value}%' OR email LIKE '%${search.value}%' OR address LIKE '%${search.value}%' OR status = '${search.value}'`
        }
       
        const { result, count } = await sql.findAllWithCount(`user`, 'id', ['COUNT(*) OVER() as total', 'id as UserId', 'phone', 'email', `address`, 'status'], query1, `ORDER BY ${column[order[0].column]} ${order[0].dir} limit ? OFFSET ?`, [length, start]);
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
        if (data != null && data.length > 0) {
            return res.status(500).json(ResponseBuilder.errorMessage("This email is already register, Please use another email."))
        }else{
            const data2 = await sql.query(`insert into user (id,name,phone,email,address,status,created_at) values (null,'${req.body.name}',${req.body.phone},'${req.body.email}','${req.body.address}',${req.body.status},null)`)
           
            if (data2) {
                return res.status(200).json(ResponseBuilder.data(data2, "User Registered SucessFully"));
            }else{
                return res.status(500).json(ResponseBuilder.errorMessage("User not Registered"))
            }
        }
} catch (error) {
    return res.status(500).json(ResponseBuilder.errorMessage(error.message))
}
}

const updateUser = async (req, res, next) => {
    try {
        const data = await sql.query(`update user set email = '${req.body.email}', name = '${req.body.name}' , phone = '${req.body.phone}' , address = '${req.body.address}',status = ${req.body.status} where id = ${req.body.id}`);
        if (data.affectedRows>0) {
            return res.status(200).json(ResponseBuilder.data([], "User Updated SucessFully"));
        }else{
            return res.status(200).json(ResponseBuilder.data([], "Data not Found"));
        }

    } catch (error) {
        return res.status(500).json(ResponseBuilder.errorMessage(error.message))
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const data = await sql.query(`delete from user where id = ${req.params.id}`)
        if (data.affectedRows>0) {
            return res.status(200).json(ResponseBuilder.data([], "User Deleted SucessFully"));;
        }else{
            return res.status(500).json(ResponseBuilder.errorMessage("Data Not Found"))
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
        console.log(data);
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