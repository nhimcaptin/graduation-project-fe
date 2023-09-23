import db from '../models/index';
import User_CRUDService from '../services/User_CRUDService';

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
       
        return res.render('homepage.ejs',{
            data: JSON.stringify(data)
        });
    }catch(e){
        console.log(e);
    }
   
}

let getCRUD = (req, res) => {
    return res.render('crud-user.ejs');
}
let postCRUD = async (req, res) => {
    let message = await User_CRUDService.createNewUser(req.body);
    console.log(message);
    return res.send('post crud from server');
}


module.exports = {
    getHomePage : getHomePage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
}