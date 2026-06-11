import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ongHome.css";

function UserProfile() {
  const navigate = useNavigate();

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [mostrarNormas, setMostrarNormas] = useState(false);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  const contribuicoes = (JSON.parse(localStorage.getItem("contribuicoesMonetarias")) || []).filter(
    (c) => c.emailDoador === usuarioLogado?.email
  );

  const [perfil, setPerfil] = useState(
    usuarioLogado || {
      nome: "",
      email: "",
      localizacao: "",
      imagem: "",
      sobre: "",
    }
  );

  if (!usuarioLogado) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <h1>Perfil do Doador</h1>

          <p>Nenhum usuário está logado no momento.</p>

          <Link to="/">Voltar para o login</Link>
        </div>
      </div>
    );
  }

  const mudarCampo = (evento) => {
    const { name, value } = evento.target;

    setPerfil({
      ...perfil,
      [name]: value,
    });
  };

  const carregarImagem = (evento) => {
    const arquivo = evento.target.files[0];

    if (!arquivo) {
      return;
    }

    if (arquivo.size > 1000000) {
      alert("A imagem é muito grande. Escolha uma imagem menor que 1MB.");
      return;
    }

    const leitor = new FileReader();

    leitor.onloadend = () => {
      setPerfil({
        ...perfil,
        imagem: leitor.result,
      });
    };

    leitor.readAsDataURL(arquivo);
  };

  const salvarAlteracoes = () => {
    try {
      const usuariosSalvos =
        JSON.parse(localStorage.getItem("usuariosCadastrados")) || [];

      const perfilAtualizado = {
        ...perfil,
        email: usuarioLogado.email,
        senha: usuarioLogado.senha,
      };

      const listaAtualizada = usuariosSalvos.map((usuario) => {
        if (usuario.email === usuarioLogado.email) {
          return perfilAtualizado;
        }

        return usuario;
      });

      localStorage.setItem(
        "usuariosCadastrados",
        JSON.stringify(listaAtualizada)
      );

      localStorage.setItem("usuarioLogado", JSON.stringify(perfilAtualizado));

      alert("Perfil atualizado com sucesso!");
    } catch (erro) {
      console.error(erro);
      alert("Não foi possível salvar. Tente usar uma imagem menor.");
    }
  };

  const desconectar = () => {
    localStorage.removeItem("usuarioLogado");
    navigate("/");
  };

  return (
    <div className="profile-page">
      <nav className="ong-navbar">
        <div className="ong-logo">+COM</div>

        <div className="ong-nav-links">
          <button type="button" onClick={() => navigate("/usuario-home")}>
            Home
          </button>

          <button type="button" onClick={() => setMostrarNormas(true)}>
            Normas do site
          </button>

          <button type="button">Suporte</button>
        </div>

        <button type="button" className="ong-profile-circle">
          {perfil.imagem ? (
            <img src={perfil.imagem} alt="Foto do usuário" />
          ) : (
            perfil.nome.charAt(0).toUpperCase()
          )}
        </button>
      </nav>

      <div className="profile-container">
        <button
          type="button"
          className="profile-close"
          onClick={() => navigate("/usuario-home")}
        >
          ×
        </button>

        <div className="profile-header">
          <div className="profile-image-area">
            {perfil.imagem ? (
              <img src={perfil.imagem} alt="Imagem do usuário" />
            ) : (
              <div className="profile-image-placeholder">
                {perfil.nome.charAt(0).toUpperCase()}
              </div>
            )}

            <label className="profile-image-button">
              Alterar imagem
              <input
                type="file"
                accept="image/*"
                onChange={carregarImagem}
              />
            </label>
          </div>

          <div className="profile-title-area">
            <h1>{perfil.nome}</h1>

            <textarea
              name="sobre"
              value={perfil.sobre}
              onChange={mudarCampo}
              placeholder="Escreva aqui uma descrição sobre você..."
            ></textarea>
          </div>
        </div>

        <div className="profile-form-grid">
          <div className="profile-input-group">
            <label>Nome</label>
            <input
              type="text"
              name="nome"
              value={perfil.nome}
              onChange={mudarCampo}
            />
          </div>

          <div className="profile-input-group">
            <label>Localização</label>
            <input
              type="text"
              name="localizacao"
              value={perfil.localizacao}
              onChange={mudarCampo}
            />
          </div>

          <div className="profile-input-group full">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              value={perfil.email}
              readOnly
            />
          </div>
        </div>

        <div className="profile-actions">
          <button
            type="button"
            className="profile-history-button"
            onClick={() => setMostrarHistorico(true)}
          >
            Histórico de doações
          </button>

          <button
            type="button"
            className="profile-save-button"
            onClick={salvarAlteracoes}
          >
            Salvar alterações
          </button>

          <button
            type="button"
            className="profile-disconnect-button"
            onClick={() => setMostrarConfirmacao(true)}
          >
            Desconectar
          </button>
        </div>
      </div>

      {mostrarConfirmacao && (
        <div className="modal-background">
          <div className="modal-box">
            <h2>Desconectar</h2>

            <p>Tem certeza que deseja se desconectar da conta?</p>

            <div className="disconnect-modal-buttons">
              <button type="button" onClick={desconectar}>
                Sim, desconectar
              </button>

              <button
                type="button"
                onClick={() => setMostrarConfirmacao(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarNormas && (
        <div className="modal-background">
          <div className="modal-box">
            <h2>Normas do site</h2>

            <p>• Respeite as ONGs e envie apenas mensagens de doação reais.</p>

            <p>
              • Informe corretamente o que você pretende doar e combine a entrega
              com responsabilidade.
            </p>

            <p>• Não envie informações falsas ou enganosas.</p>

            <p>• Use a plataforma apenas para fins solidários.</p>

            <button type="button" onClick={() => setMostrarNormas(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}

      {mostrarHistorico && (
        <div className="modal-background" onClick={() => setMostrarHistorico(false)}>
          <div className="modal-box modal-historico" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setMostrarHistorico(false)}
            >
              ×
            </button>

            <h2>Histórico de doações</h2>

            {contribuicoes.length === 0 ? (
              <p className="historico-vazio">Você ainda não fez nenhuma contribuição monetária.</p>
            ) : (
              <div className="historico-lista">
                {contribuicoes.map((c) => (
                  <div className="historico-item" key={c.id}>
                    <div className="historico-col">
                      <span className="historico-label">Doação:</span>
                      <span className="historico-valor">R$ {c.valor},00 — {c.nomeOng}</span>
                    </div>
                    <div className="historico-col">
                      <span className="historico-label">Data de publicação:</span>
                      <span className="historico-valor">{c.data}</span>
                    </div>
                    <div className="historico-col">
                      <span className="historico-label">Status:</span>
                      <span className={`historico-status historico-status-${c.status === 'Comprovado' ? 'comprovado' : 'aguardando'}`}>
                        {c.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="historico-footer">
              <button
                type="button"
                className="btn-voltar-historico"
                onClick={() => setMostrarHistorico(false)}
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;