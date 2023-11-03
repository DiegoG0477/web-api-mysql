require("dotenv").config();
const db = require("../configs/db.config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class User {
    static async getAll(limit, offset){
        const sql = "SELECT * FROM usuarios LIMIT ? OFFSET ?";
        const results = await db.promise().query(sql, [limit, offset]);
        return results[0];
    }

    static async count(){
        const sql = "SELECT COUNT(*) FROM usuarios";
        const results = await db.promise().query(sql);
        return results[0][0]["COUNT(*)"];
    }

    static async getId(user){
        const sql = "SELECT id FROM usuarios WHERE correo = ? AND constrasenia = ?"
        const result = await db.promise().query(sql,[user.email,user.password],(error,results)=>{
            if(error){
                console.log(error)
            }else{
                console.log(results[0].id)
            }
        })
        return result[0][0];
    }

    static async createUser(user){
        const sql = "INSERT INTO usuarios(correo,contrasenia) VALUES (?,?)";
        await db.promise().query(sql,[user.email,user.password],(err,results)=>{
            if(err){
                console.log(err);
            }else{
                console.log(results);
            }
        });

        const newUser = await User.findUser(user.email);
        const id = newUser.id;

        const sqlTwo = 'INSERT INTO datos_usuarios(id, nombre, apellido_pat, apellido_mat) VALUES (?,?,?,?)';
        db.query(sqlTwo,[id,user.nombre,user.apellidoPat,user.apellidoMat],(err,results)=>{
            if(err){
                console.log(err);
            }else{
                console.log(results);
            }
        });
    }

    static async findUser(email){
        const sql = "SELECT * FROM usuarios WHERE correo = ?";
        const result = await db.promise().query(sql,[email]);
        if(result[0][0] === undefined){
            return 0;
        }
        return result[0][0];
    }

    static async encryptPassword(password){
        console.log(password);
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password,salt);
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