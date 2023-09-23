import bcrypt from 'bcryptjs';
import db from '../models/index';

const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise(async(resolve, reject) => {
        try{
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.Users.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
                address: data.address,
                gender: data.gender === '1' ? true : false,
                //yearOfBirth: data.yearOfBirth,
                roleId: data.roleId
            })

            resolve('create a new user succeed')
            
        }catch(e){
            reject(e);
        }
    })
    
}
let hashUserPassword = (password) => {
    return new Promise(async(resolve, reject) => {
        try{
            var hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        }catch(e){
            reject(e);
        }
    })
}

module.exports = {
    createNewUser:  createNewUser
}