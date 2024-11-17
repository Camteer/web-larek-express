import express from "express";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import productsRouter from "./routes/product";
import orderRouter from "./routes/order";
import userRouter from "./routes/user";
import uploadRouter from "./routes/upload";
import { errorLogger, requestLogger } from "./middlewares/logger";
import { errors } from "celebrate";
import { errorHandler } from "./middlewares/error-handler";
import cookieParser from "cookie-parser";
import { dbAddress, port, server } from "./config";
import { job } from "./cronClear";

const app = express();
mongoose.connect(dbAddress);

app.use(
  cors({
    origin: server,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);
job.start();
app.use("/auth", userRouter);
app.use("/upload", uploadRouter);
app.use("/product", productsRouter);
app.use("/order", orderRouter);

app.use(errorLogger);
app.use(errors());

app.use(errorHandler);

app.listen(port, () => {
  console.log("port", port);
});
