import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileMenu from "../components/ProfileMenu";
import "../styles/ongHome.css";
import logoImg from "../assets/comm.png";

function UserProfile() {
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState(null);

  const [mostrarNormas, setMostrarNormas] = useState(false);
  const [mostrarSuporte, setMostrarSuporte] = useState(false);
  const [editando, setEditando] = useState(false);

  const buscarUsuario = async () => {
    const id = localStorage.getItem("usuarioId");

    const resposta = await fetch(`http://localhost:3001/usuarios/${id}`);

    const dados = await resposta.json();

    setPerfil(dados);
  };

  useEffect(() => {
    const id = localStorage.getItem("usuarioId");
    if (!id) return;
    buscarUsuario();
  }, []);

  if (!perfil) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <h1>Perfil do Usuário</h1>
          <p>Nenhum Usuário está logada no momento.</p>
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

  const cancelarEdicao = () => {
    buscarUsuario();
    setEditando(false);
  };

  const salvarAlteracoes = async () => {
    try {
      const resposta = await fetch(
        `http://localhost:3001/usuarios/${perfil._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(perfil),
        },
      );

      if (!resposta.ok) {
        alert("Erro ao salvar");
        return;
      }

      alert("Perfil atualizado com sucesso!");
      setEditando(false);
      buscarUsuario();
    } catch (erro) {
      console.error(erro);
      alert("Erro ao salvar");
    }
  };

  const inicialPerfil = perfil.nome ? perfil.nome.charAt(0).toUpperCase() : "U";

  return (
    <div className="profile-page">
      <nav className="ong-navbar">
       <a href="#topo" className="ong-logo">
                 <img src={logoImg} alt="Logo +COM" />
               </a>

        <div className="ong-nav-links">
          <button type="button" onClick={() => navigate("/usuario-home")}>
            Início
          </button>

          <button type="button" onClick={() => setMostrarNormas(true)}>
            Normas do Site
          </button>

          <button type="button" onClick={() => setMostrarSuporte(true)}>
            Suporte
          </button>
        </div>

        <ProfileMenu tipo="usuario" pessoa={perfil} />
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
              <div className="profile-image-placeholder">{inicialPerfil}</div>
            )}

            {editando && (
              <label className="profile-image-button">
                Alterar imagem
                <input type="file" accept="image/*" onChange={carregarImagem} />
              </label>
            )}
          </div>

          <div className="profile-title-area">
            <h1>{perfil.nome}</h1>

            <textarea
              name="sobre"
              value={perfil.sobre}
              onChange={mudarCampo}
              placeholder="Escreva aqui uma descrição sobre você..."
              readOnly={!editando}
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
              readOnly={!editando}
            />
          </div>

          <div className="profile-input-group">
            <label>Localização</label>
            <input
              type="text"
              name="localizacao"
              value={perfil.localizacao}
              onChange={mudarCampo}
              readOnly={!editando}
            />
          </div>

          <div className="profile-input-group full">
            <label>E-mail</label>
            <input type="email" name="email" value={perfil.email} readOnly />
          </div>
        </div>

        <div className="profile-actions">
          {!editando ? (
            <button
              type="button"
              className="profile-save-button"
              onClick={() => setEditando(true)}
            >
              Editar perfil
            </button>
          ) : (
            <>
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
                onClick={cancelarEdicao}
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>

      {mostrarNormas && (
        <div className="modal-background">
          <div className="modal-box">
            <h2>Normas do Site para Doadores</h2>

            <p>
              • Cumpra com sua palavra sobre os itens que você informou que iria
              doar.
            </p>

            <p>
              • Evite enviar mensagens de doação caso você não tenha certeza de
              que conseguirá realizar a entrega.
            </p>

            <p>
              • Entregue as doações em até 3 dias úteis depois de enviar a
              mensagem de doação.
            </p>

            <p>
              • Caso você deixe de entregar doações em até 3 mensagens
              diferentes, e passe 2 dias do prazo definido na mensagem, você
              poderá ser banido da plataforma.
            </p>

            <p>
              • Quando entregar a doação para a ONG, relembre a instituição de
              atualizar a necessidade publicada e confirmar que o pedido foi
              recebido.
            </p>

            <button type="button" onClick={() => setMostrarNormas(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}

      {mostrarSuporte && (
        <div className="modal-background">
          <div className="modal-box">
            <h2>Suporte</h2>

            <p>
              Caso tenha algum problema com nossa plataforma, entre em contato
              conosco:
            </p>

            <p>
              <strong>EMAIL:</strong> maiscom@gmail.com
            </p>

            <p>
              <strong>Número:</strong> 4002-8922
            </p>

            <button type="button" onClick={() => setMostrarSuporte(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
