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

//pegar usuario
app.get("/usuarios/:id", async (req, res) => {
  const usuario = await Usuario.findById(req.params.id);

  if (!usuario) {
    return res.status(404).json({
      mensagem: "Usuário não encontrado",
    });
  }

  res.json(usuario);
});

//salvar perfil usuario
app.put("/usuarios/:id", async (req, res) => {
  const usuarioAtualizado = await Usuario.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    },
  );

  res.json(usuarioAtualizado);
});

//criar ONG
app.post("/ongs", async (req, res) => {
  const novaOng = await Ong.create(req.body);
  res.json(novaOng);
});

//pegar ong
app.get("/ongs/:id", async (req, res) => {
  const ong = await Ong.findById(req.params.id);

  if (!ong) {
    return res.status(404).json({
      mensagem: "ONG não encontrada",
    });
  }

  res.json(ong);
});

//salvar perfil ong
app.put("/ongs/:id", async (req, res) => {
  const ongAtualizada = await Ong.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.json(ongAtualizada);
});

//login usuario e ONG
app.post("/login", async (req, res) => {
  const { email, senha, tipo } = req.body;

  let conta;

  if (tipo === "usuario") {
    conta = await Usuario.findOne({
      email: email,
    });
  }

  if (tipo === "ong") {
    conta = await Ong.findOne({
      email: email,
    });
  }

  if (!conta) {
    return res.status(404).json({
      mensagem: "Email não encontrado",
    });
  }

  if (conta.senha !== senha) {
    return res.status(400).json({
      mensagem: "Senha incorreta",
    });
  }

  res.json(conta);
});

//liga o back end
async function start() {
  await connectDB();

  app.listen(process.env.PORT, () => {
    console.log("Servidor rodando");
  });
}

start();
