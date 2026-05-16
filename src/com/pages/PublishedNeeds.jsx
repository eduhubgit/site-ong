import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ongHome.css";
import "../styles/publishedNeeds.css";

function PublishedNeeds() {
  const navigate = useNavigate();

  const ongLogada = JSON.parse(localStorage.getItem("ongLogada"));
  const nomeOng = ongLogada?.nome || "ONG";
  const inicialPerfil = nomeOng.charAt(0).toUpperCase();

  const todasNecessidades =
    JSON.parse(localStorage.getItem("necessidadesPublicadas")) || [];

  const necessidadesDaOng = todasNecessidades.filter(
    (publicacao) => publicacao.ong.email === ongLogada?.email
  );

  const [necessidades, setNecessidades] = useState(necessidadesDaOng);
  const [mostrarNormas, setMostrarNormas] = useState(false);

  const removerPublicacao = (id) => {
    const confirmar = window.confirm(
      "Tem certeza que deseja remover essa publicação?"
    );

    if (!confirmar) {
      return;
    }

    const listaAtualizadaGeral = todasNecessidades.filter(
      (publicacao) => publicacao.id !== id
    );

    const listaAtualizadaDaOng = necessidades.filter(
      (publicacao) => publicacao.id !== id
    );

    localStorage.setItem(
      "necessidadesPublicadas",
      JSON.stringify(listaAtualizadaGeral)
    );

    setNecessidades(listaAtualizadaDaOng);
  };

  return (
    <div className="published-page">
      <nav className="ong-navbar">
        <div className="ong-logo">+COM</div>

        <div className="ong-nav-links">
          <button onClick={() => navigate("/home")}>Home</button>

          <button onClick={() => setMostrarNormas(true)}>
            Normas do site
          </button>

          <button>Suporte</button>
        </div>

        <button
          className="ong-profile-circle"
          onClick={() => navigate("/perfil-ong")}
        >
          {ongLogada?.imagem ? (
            <img src={ongLogada.imagem} alt="Foto da ONG" />
          ) : (
            inicialPerfil
          )}
        </button>
      </nav>

      <main className="published-main">
        <div className="published-header">
          <h1>Necessidades publicadas</h1>

          <button onClick={() => navigate("/publicar-necessidades")}>
            Nova publicação
          </button>
        </div>

        {necessidades.length === 0 ? (
          <div className="published-empty">
            <h2>Nenhuma necessidade publicada ainda.</h2>

            <p>
              Quando sua ONG publicar uma lista de necessidades, ela aparecerá
              aqui.
            </p>
          </div>
        ) : (
          <div className="published-list">
            {necessidades.map((publicacao) => (
              <div className="published-card" key={publicacao.id}>
                <div className="published-card-header">
                  <div>
                    <h2>{publicacao.ong.nome}</h2>
                    <p>{publicacao.dataPublicacao}</p>
                  </div>

                  <span>{publicacao.status}</span>
                </div>

                <div className="published-categories">
                  {publicacao.categorias.map((categoria) => (
                    <span key={categoria}>{categoria}</span>
                  ))}
                </div>

                <div className="published-items">
                  {publicacao.itens.map((item) => (
                    <div className="published-item" key={item.id}>
                      <strong>{item.nome}</strong>
                      <p>{item.quantidade}</p>
                    </div>
                  ))}
                </div>

                <button
                  className="remove-publication-button"
                  onClick={() => removerPublicacao(publicacao.id)}
                >
                  Remover publicação
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {mostrarNormas && (
        <div className="modal-background">
          <div className="modal-box">
            <h2>Normas do site</h2>

            <p>• Publique apenas necessidades reais da sua instituição.</p>

            <p>
              • Mantenha os pedidos atualizados conforme forem recebendo
              doações.
            </p>

            <p>• Não utilize informações falsas ou enganosas.</p>

            <p>• Remova pedidos que já foram atendidos.</p>

            <button onClick={() => setMostrarNormas(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PublishedNeeds;