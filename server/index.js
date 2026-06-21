import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./mongo.js";
import Usuario from "./models/usuario.js";
import Ong from "./models/ong.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

//criar usuario
app.post("/usuarios", async (req, res) => {
  const novoUsuario = await Usuario.create(req.body);
  res.json(novoUsuario);
});

//criar ong
app.post("/ongs", async (req, res) => {
  const novaOng = await Ong.create(req.body);
  res.json(novaOng);
});

//liga o back end
async function start() {
  await connectDB();

  app.listen(process.env.PORT, () => {
    console.log("Servidor rodando");
  });
}

start();
