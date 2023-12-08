import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../middlewares/error.js";
import jwt from "jsonwebtoken";
import { MESSAGE_ERROR } from "../const/messages.js";
import Role from "../models/Role.js";
import { sendMail } from "../middlewares/send.mail.js";

export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send("Email đã được sử dụng");
    }
    const existingPhoneUser = await User.findOne({ phone: req.body.phone });
    if (existingPhoneUser) {
      return res.status(400).send("Số điện thoại đã được sử dụng");
    }
    const newUser = new User({
      ...req.body,
      password: hash,
    });
    if (req.body.role === "65317023583bf8c93e253b4e") {
      const { position, specialize } = req.body;
      if (!position || !specialize) {
        return res.status(400).send("Vì bạn là bác sĩ nên phải thêm các bằng position,specialize");
      }
    }
    await newUser.save();
    res.status(200).send("User has been created.");
  } catch (err) {
    next(err);
  }
};
//  export const register =  async(req,res,next) => {
//  try{
//   const newUser = new User({
//     username:req.body.username,
//     email:req.body.email,
//     password:req.body.password,

//   })
//   await newUser.save()
//   res.status(200).send("ok")
//  }catch(err){
//   next(err)
//  }
//  }

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(400, MESSAGE_ERROR.MAIL_ALREADY_NOT_EXISTS));
    if (req.originalUrl === "/api/auth/login-admin" && !user.isAdmin)
      return next(createError(403, MESSAGE_ERROR.NOT_PERMISSIONS));

    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect) return next(createError(400, MESSAGE_ERROR.WRONG_ACCOUNT));

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT);

    const { password, isAdmin, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ access_token: token });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  const accessToken = req.header("authorization").replace("Bearer ", "");
  try {
    if (accessToken) {
      res
        .cookie("access_token", "", {
          httpOnly: true,
        })
        .status(200)
        .json({ message: "Sign Out Successfully" });
    } else {
      res.status(500).json({ message: "accessToken = undefine " });
    }
  } catch {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const sendPasswordLink = async (req, res) => {
  console.log(req.body);

  const { email, url } = req.body;

  if (!email) {
    res.status(401).json({ status: 401, message: "Enter Your Email" });
  }
  try {
    const userFind = await User.findOne({ email: email });
    //console.log(userFind)

    // token generate for reset password
    const token = jwt.sign({ _id: userFind._id }, process.env.JWT, {
      expiresIn: "1200s",
    });
    //console.log(token)

    const setUserToken = await User.findByIdAndUpdate({ _id: userFind._id }, { verifytoken: token }, { new: true });
    //console.log(setUserToken)

    if (setUserToken) {
      await sendMail({
        email: email,
        subject: "Thông báo thay đổi mật khẩu tài khoản từ Website Phòng Khám Nha Khoa Tây Đô",
        html: `<div id=":2d" class="a3s aiL">
        Xin chào Quý khách,<br />
        Vui lòng thông báo bạn vừa yêu cầu chức năng quên mật khẩu. Vui lòng click vào đường dẫn sau để đặt lại mật khẩu cho tài khoản !
        <br /><br />
        <a
          href="${url}${userFind.id}/${setUserToken.verifytoken}"
          target="_blank"
          >${url}${userFind.id}/${setUserToken.verifytoken}</a
        ><br /><br />
        &nbsp;*Đường dẫn trên chỉ có hiệu lực trong 20p*<br />
        &nbsp;*Nếu Quý khách không gửi yêu cầu này, vui lòng liên hệ ngay với
        chúng tôi!*<br />
        Mọi thắc mắc và góp ý, xin vui lòng liên hệ với chúng tôi qua:<br />
        Email:
        <a href="mailto:dental.taydo@gmail.com" target="_blank"
          >dental.taydo@gmail.com</a
        ><br />
        <!-- Hotline: 1900 55 55 77 -->
        <br />
        Trân trọng,<br />
        *Quý khách vui lòng không trả lời email này*
      </div>`,
      });
      return res.status(200).json({ status: 200, message: "password reset link sent successfully" });
    }
  } catch (error) {
    res.status(401).json({ status: 401, message: "invalid user" });
  }
};

export const forgotPassword = async (req, res) => {
  const { id, token } = req.params;
  //console.log(id, token)
  try {
    const validuser = await User.findOne({ _id: id, verifytoken: token });
    //console.log(validuser)

    const verifyToken = jwt.verify(token, process.env.JWT);
    console.log(verifyToken);

    if (validuser && verifyToken._id) {
      res.status(201).json({ status: 201, validuser });
    } else {
      res.status(401).json({ status: 401, message: "user does not exist" });
    }
  } catch (error) {}
};

export const resetPassword = async (req, res) => {
  const { id, token } = req.params;

  const { password } = req.body;

  try {
    const validuser = await User.findOne({ _id: id, verifytoken: token });

    const verifyToken = jwt.verify(token, process.env.JWT);

    if (validuser && verifyToken._id) {
      const newpassword = await bcrypt.hash(password, 12);

      const setnewuserpass = await User.findByIdAndUpdate({ _id: id }, { password: newpassword });

      setnewuserpass.save();
      res.status(201).json({ status: 201, setnewuserpass });
    } else {
      res.status(401).json({ status: 401, message: "user not exist" });
    }
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
};
