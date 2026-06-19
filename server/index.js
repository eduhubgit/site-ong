import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./mongo.js";

dotenv.config();
const app = express();

async function start() {
  await connectDB();

  app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}`);
  });
}

start();
