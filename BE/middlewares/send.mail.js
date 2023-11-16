import nodemailer from "nodemailer"
import * as dotenv from "dotenv";
dotenv.config();

 const sendMail = async({ email, subject, html}) =>{
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        service: "Gmail",
        auth:{
            user: process.env.USER_MAIL,
            pass: process.env.PASS_MAIL
        }
    })

    const message = {
        from: 'PHÒNG KHÁM NHA KHOA TÂY ĐÔ',
        to: email,
        subject: subject,
        html: html
    }

    const result = await transporter.sendMail(message)
    return result;
};
export {sendMail}