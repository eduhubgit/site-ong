import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({
  nome: String,
  email: String,
  localizacao: String,
  senha: String,
  imagem: String,
  sobre: String,
  tipo: String,
});

export default mongoose.model("Usuario", UsuarioSchema);
