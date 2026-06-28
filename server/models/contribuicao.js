import mongoose from "mongoose";

const contribuicaoSchema = new mongoose.Schema({
  necessidadeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Necessidade",
  },

  ongId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ong",
  },
  nomeDoador: String,
  emailDoador: String,
  imagemDoador: String,
  comprovanteNome: String,
  comprovanteTipo: String,
  comprovanteArquivo: String,
  mensagem: String,
  status: {
    type: String,
    default: "Pendente",
  },
  dataEnvio: String,
});

export default mongoose.model("Contribuicao", contribuicaoSchema);
