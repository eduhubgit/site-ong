import mongoose from "mongoose";

const ONGSchema = new mongoose.Schema({
  nome: String,
  cnpj: String,
  email: String,
  cidade: String,
  endereco: String,
  nichoPrincipal: String,
  chavePix: String,
  diasFuncionamento: String,
  horarioFuncionamento: String,
  senha: String,
  imagem: String,
  sobre: String,
  tipo: String,
});

export default mongoose.model("Ong", ONGSchema);
