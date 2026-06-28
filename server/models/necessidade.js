import mongoose from "mongoose";

const necessidadeSchema = new mongoose.Schema({
  ongId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ong",
    required: true,
  },

  categorias: [String],

  itens: [
    {
      nome: String,
      quantidade: String,
    },
  ],

  status: {
    type: String,
    default: "Publicado",
  },

  dataPublicacao: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Necessidade", necessidadeSchema);
