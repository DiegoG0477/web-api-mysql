require("dotenv").config();
const db = require("../configs/db.config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class User {
    static async findAll(limit, offset){
        const sql = "SELECT * FROM usuarios u INNER JOIN datos_usuarios du ON u.id_usuario = du.id_usuario WHERE deleted = 0 LIMIT ? OFFSET ?";
        const results = await db.promise().query(sql, [limit, offset]);
        return results[0];
    }

    static async findById(id){
        const sql = "SELECT * FROM usuarios u INNER JOIN datos_usuarios du ON u.id_usuario = du.id_usuario WHERE u.id_usuario = ?";
        const result = await db.promise().query(sql,[id]);
        return result[0][0];
    }

    static async find(email){
        const sql = "SELECT * FROM usuarios WHERE email = ?";
        const result = await db.promise().query(sql,[email]);
        if(result[0][0] === undefined){
            return false;
        }
        return result[0][0];
    }

    static async getId(email){
        const sql = "SELECT id_usuario FROM usuarios WHERE email = ?"
        const result = await db.promise().query(sql,[email],(error,results)=>{
            if(error){
                console.log(error)
            }else{
                console.log(results[0].id)
            }
        })
        return result[0][0].id_usuario;
    }

    static async count(){
        const sql = "SELECT COUNT(*) FROM usuarios WHERE deleted = 0";
        const results = await db.promise().query(sql);
        return results[0][0]["COUNT(*)"];
    }

    static async create(user){
        const sql = "INSERT INTO usuarios(email, password, created_at) VALUES (?,?,?)";
        await db.promise().query(sql,[user.email,user.password, new Date()],(err,results)=>{
            if(err){
                console.log(err);
            }else{
                console.log(results);
            }
        });

        const id = await User.getId(user.email);
        console.log(id);

        const sqlTwo = 'INSERT INTO datos_usuarios(id_usuario, nombre, apellido_pat, apellido_mat) VALUES (?,?,?,?)';
        db.query(sqlTwo,[id,user.nombre,user.apellidoPat,user.apellidoMat],(err,results)=>{
            if(err){
                console.log(err);
            }else{
                console.log(results);
            }
        });
    }

    static async logicDelete(userId, adminId){
        const sql = "UPDATE usuarios SET deleted = 1, deleted_by = ?, deleted_at = ? WHERE id_usuario = ?";
        await db.promise().query(sql,[adminId, new Date(), userId],(err,results)=>{
            if(err){
                console.log(err);
            }else{
                console.log(results);
            }
        });
    }

    static async physicDelete(userId){
        const sql = "DELETE FROM usuarios WHERE id_usuario = ?";
        await db.promise().query(sql,[userId],(err,results)=>{
            if(err){
                console.log(err);
            }else{
                console.log(results);
            }
        });
    }

    static async update(userId, user){
        const sql = "UPDATE usuarios SET ? WHERE id_usuario = ?";
        await db.promise().query(sql,[user, userId],(err,results)=>{
            if(err){
                console.log(err);
            }else{
                console.log(results);
            }
        });

        const sqlTwo = "UPDATE datos_usuarios SET ? WHERE id_usuario = ?";
        await db.promise().query(sqlTwo,[user, userId],(err,results)=>{
            if(err){
                console.log(err);
            }else{
                console.log(results);
            }
        });
    }

    static async putUpdate(id, user){
        console.log(user);
        console.log(id);

        const sql = "UPDATE usuarios SET email = ?, password = ?, updated_at = ?, updated_by = ? WHERE id_usuario = ?";
        await db.promise().query(sql,[user.email,user.password,user.updated_at,user.updated_by, id],(err,results)=>{
            if(err){
                console.log(err);
            }else{
                console.log(results);
            }
        });

        const sqlTwo = "UPDATE datos_usuarios SET nombre = ?, apellido_pat = ?, apellido_mat = ? WHERE id_usuario = ?";
        await db.promise().query(sqlTwo,[user.nombre,user.apellidoPat,user.apellidoMat,id],(err,results)=>{
            if(err){
                console.log(err);
            }else{
                console.log(results);
            }
        });
    }

    static truncateTable(){
        const sql = "DELETE FROM eduplanet.usuarios WHERE id_usuario > 0;";
        db.query(sql,(err,results)=>{
            if(err){
                console.log(err);
            }else{
                console.log(results);
            }
        });
    }

    static async encryptPassword(password){
        const salt = bcrypt.genSalt(process.env.SALTOS_BCRYPT);
        return bcrypt.hash(password,salt);
    }

    static async comparePassword(password, receivedPassword){
        return await bcrypt.compare(receivedPassword, password);
    }

    static getToken(id){
        return jwt.sign({id:id},process.env.SECRET_KEY,{expiresIn: '12h'})
    }

    static async verifyToken(token){
        return jwt.verify(token, process.env.SECRET_KEY);
    }
}
module.exports = User;