import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ongHome.css";
import "../styles/userHome.css";

function DonationMessage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  const necessidadesPublicadas =
    JSON.parse(localStorage.getItem("necessidadesPublicadas")) || [];

  const publicacao = necessidadesPublicadas.find(
    (item) => String(item.id) === String(id)
  );

  const [itemDoado, setItemDoado] = useState("");
  const [quantidadeDoada, setQuantidadeDoada] = useState("");
  const [mensagem, setMensagem] = useState("");

  const enviarMensagem = () => {
    if (!usuarioLogado) {
      alert("Você precisa estar logado como usuário para enviar uma doação.");
      navigate("/");
      return;
    }

    if (!publicacao) {
      alert("Publicação não encontrada.");
      navigate("/usuario-home");
      return;
    }

    if (
      itemDoado.trim() === "" ||
      quantidadeDoada.trim() === "" ||
      mensagem.trim() === ""
    ) {
      alert("Preencha todos os campos antes de enviar.");
      return;
    }

    const doacoesSalvas =
      JSON.parse(localStorage.getItem("doacoesRecebidas")) || [];

    const novaDoacao = {
      id: Date.now(),
      publicacaoId: publicacao.id,

      nomeDoador: usuarioLogado.nome,
      contato: usuarioLogado.email,
      imagemDoador: usuarioLogado.imagem || "",

      itemDoado: itemDoado.trim(),
      quantidadeDoada: quantidadeDoada.trim(),
      mensagem: mensagem.trim(),

      status: "Pendente",
      dataEnvio: new Date().toLocaleString("pt-BR"),
    };

    const listaAtualizada = [...doacoesSalvas, novaDoacao];

    localStorage.setItem("doacoesRecebidas", JSON.stringify(listaAtualizada));

    alert("Mensagem de doação enviada com sucesso!");

    navigate("/usuario-home");
  };

  if (!publicacao) {
    return (
      <div className="donation-page">
        <div className="donation-card">
          <h1>Publicação não encontrada</h1>

          <button type="button" onClick={() => navigate("/usuario-home")}>
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="donation-page">
      <nav className="ong-navbar">
        <div className="ong-logo">+COM</div>

        <div className="ong-nav-links">
          <button type="button" onClick={() => navigate("/usuario-home")}>
            Home
          </button>

          <button type="button">Necessidades disponíveis</button>

          <button type="button">Suporte</button>
        </div>

        <button
          type="button"
          className="ong-profile-circle"
          onClick={() => navigate("/perfil-usuario")}
        >
          {usuarioLogado?.imagem ? (
            <img src={usuarioLogado.imagem} alt="Foto do usuário" />
          ) : (
            usuarioLogado?.nome?.charAt(0).toUpperCase() || "U"
          )}
        </button>
      </nav>

      <main className="donation-main">
        <section className="donation-card">
          <h1>Enviar doação</h1>

          <p>
            Você está enviando uma mensagem para:
            <strong> {publicacao.ong.nome}</strong>
          </p>

          <div className="donation-needed-list">
            <h2>Necessidades da ONG</h2>

            {publicacao.itens.map((item) => (
              <p key={item.id}>
                <strong>{item.nome}</strong> - {item.quantidade}
              </p>
            ))}
          </div>

          <div className="donation-form">
            <div className="donation-input-group">
              <label>O que você pretende doar?</label>
              <input
                type="text"
                placeholder="Ex: Detergente"
                value={itemDoado}
                onChange={(evento) => setItemDoado(evento.target.value)}
              />
            </div>

            <div className="donation-input-group">
              <label>Quantidade</label>
              <input
                type="text"
                placeholder="Ex: 2 unidades"
                value={quantidadeDoada}
                onChange={(evento) =>
                  setQuantidadeDoada(evento.target.value)
                }
              />
            </div>

            <div className="donation-input-group">
              <label>Mensagem para a ONG</label>
              <textarea
                placeholder="Ex: Olá, posso doar 2 detergentes essa semana."
                value={mensagem}
                onChange={(evento) => setMensagem(evento.target.value)}
              ></textarea>
            </div>

            <div className="donation-buttons">
              <button type="button" onClick={enviarMensagem}>
                Enviar mensagem
              </button>

              <button
                type="button"
                onClick={() => navigate("/usuario-home")}
              >
                Cancelar
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DonationMessage;