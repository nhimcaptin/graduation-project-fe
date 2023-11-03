import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import roleRoute from "./routes/role.js";
import bookingRoute from "./routes/booking.js";
import mainServiceRoute from "./routes/mainService.js";
import timeTypeRoute from "./routes/timeType.js";
import subService from "./routes/subServices.js";
import historyService from "./routes/historyBooking.js"
import preferential from "./routes/preferential.js";
import DentalKnowledge from "./routes/DentalKnowledge.js";


import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import session  from "express-session";

import {upload, uploadMultiple} from "./middlewares/multer.js";
import {getStorage, ref ,uploadBytesResumable} from 'firebase/storage';
import {signInWithEmailAndPassword, createUserWithEmailAndPassword} from "firebase/auth";
import {auth} from "./config/firebase.config.js";


const app = express();
dotenv.config();

const connect = async () => {
  try {
   // console.log("process.env.JWT",process.env.JWT)
    //await mongoose.connect("mongodb://localhost:27017/nodejs-React");
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

//UPLOAD IMAGE
async function uploadImage(file, quantity) {
  const storageFB = getStorage();

  await signInWithEmailAndPassword(auth, process.env.FIREBASE_USER, process.env.FIREBASE_AUTH)

  if (quantity === 'single') {
      const dateTime = Date.now();
      const fileName = `images/${dateTime}`
      const storageRef = ref(storageFB, fileName)
      const metadata = {
          contentType: file.type,
      }
      await uploadBytesResumable(storageRef, file.buffer, metadata);
      return fileName
  }

  if (quantity === 'multiple') {
      for(let i=0; i < file.images.length; i++) {
          const dateTime = Date.now();
          const fileName = `images/${dateTime}`
          const storageRef = ref(storageFB, fileName)
          const metadata = {
              contentType: file.images[i].mimetype,
          }

          const saveImage = await Image.create({imageUrl: fileName});
          file.item.imageId.push({_id: saveImage._id});
          await file.item.save();

          await uploadBytesResumable(storageRef, file.images[i].buffer, metadata);

      }
      return
  }

}

app.post('/test-upload', upload, async (req, res) => {
  const file = {
      type: req.file.mimetype,
      buffer: req.file.buffer
  }
  try {
      const buildImage = await uploadImage(file, 'single'); 
      res.send({
          status: "SUCCESS",
          imageName: buildImage
      })
  } catch(err) {
      console.log(err);
  }
})

//middlewares
app.use(cors())
app.use(cookieParser())
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key', 
  resave: false,
  saveUninitialized: true,
}));

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/role", roleRoute);
app.use("/api/booking", bookingRoute);
app.use("/api/main-service", mainServiceRoute);
app.use("/api/time-type", timeTypeRoute);
app.use("/api/sub-service", subService);
app.use("/api/history", historyService);
app.use("/api/preferential", preferential);
app.use("/api/DentalKnowledge", DentalKnowledge);



app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

const port = process.env.PORT || 3000

app.listen(port, () => {
  connect();
  console.log("Connected to backend", +port);
});
