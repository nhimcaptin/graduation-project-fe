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
import historyService from "./routes/historyBooking.js";
import preferential from "./routes/preferential.js";
import DentalKnowledge from "./routes/DentalKnowledge.js";
import uploadFile from "./routes/upload.js";
import policyRoute from "./routes/policy.js";
import news from "./routes/news.js";
import dashboard from "./routes/dashboard.js";
import invoice from "./routes/invoice.js";
import commentRoute from "./routes/comment.js";
import vnpay from "./routes/vnpay.js";

import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";

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

//middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

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
app.use("/api/policy", policyRoute);
app.use("/api/News", news);
app.use("/api/dashboard", dashboard);
app.use("/api/invoice", invoice);
app.use("/api/comment", commentRoute);

app.use("/api", uploadFile);
app.use("/api", vnpay);

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

const port = process.env.PORT || 3000;

app.listen(port, () => {
  connect();
  console.log("Connected to backend", +port);
});
