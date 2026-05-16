import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ongHome.css";

function ONGProfile() {
  const navigate = useNavigate();

  const ongLogada = JSON.parse(localStorage.getItem("ongLogada"));

  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [mostrarNormas, setMostrarNormas] = useState(false);

  const irParaSuporte = () => {
  navigate("/home");

  setTimeout(() => {
    const rodape = document.getElementById("rodape");

    if (rodape) {
      rodape.scrollIntoView({ behavior: "smooth" });
    }
  }, 100);
};

  const [perfil, setPerfil] = useState(
    ongLogada || {
      nome: "",
      cnpj: "",
      email: "",
      localizacao: "",
      nicho: "",
      imagem: "",
      sobre: "",
    }
  );

  if (!ongLogada) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <h1>Perfil da ONG</h1>
          <p>Nenhuma ONG está logada no momento.</p>
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
    const ongsSalvas =
      JSON.parse(localStorage.getItem("ongsCadastradas")) || [];

    const perfilAtualizado = {
      ...perfil,
      email: ongLogada.email,
      senha: ongLogada.senha,
    };

    const listaAtualizada = ongsSalvas.map((ong) => {
      if (ong.email === ongLogada.email) {
        return perfilAtualizado;
      }

      return ong;
    });

    localStorage.setItem("ongsCadastradas", JSON.stringify(listaAtualizada));
    localStorage.setItem("ongLogada", JSON.stringify(perfilAtualizado));

    alert("Perfil atualizado com sucesso!");
  } catch (erro) {
    console.error(erro);
    alert("Não foi possível salvar. Tente usar uma imagem menor.");
  }
};

  const desconectar = () => {
    localStorage.removeItem("ongLogada");
    navigate("/");
  };

  

  return (
    <div className="profile-page">
      <nav className="ong-navbar">
        <div className="ong-logo">+COM</div>

        <div className="ong-nav-links">
        <Link to="/home">Home</Link>

        <button onClick={() => setMostrarNormas(true)}>
         Normas do site
        </button>

        <button onClick={irParaSuporte}>
        Suporte
        </button>
        </div>

        <div className="ong-profile-circle">
         {perfil.imagem ? (
         <img src={perfil.imagem} alt="Foto da ONG" />
          ) : (
          perfil.nome.charAt(0).toUpperCase()
          )}
        </div>
      </nav>

      <div className="profile-container">
        <button className="profile-close" onClick={() => navigate("/home")}>
          ×
        </button>

        <div className="profile-header">
          <div className="profile-image-area">
            {perfil.imagem ? (
              <img src={perfil.imagem} alt="Imagem da ONG" />
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
              placeholder="Escreva aqui uma descrição sobre sua ONG..."
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
            <label>CNPJ</label>
            <input
              type="text"
              name="cnpj"
              value={perfil.cnpj}
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

          <div className="profile-input-group">
            <label>Nicho</label>
            <input
              type="text"
              name="nicho"
              value={perfil.nicho}
              onChange={mudarCampo}
            />
          </div>

          <div className="profile-input-group full">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              value={perfil.email}
              onChange={mudarCampo}
            />
          </div>
        </div>

        <div className="profile-actions">
          <button className="profile-save-button" onClick={salvarAlteracoes}>
            Salvar alterações
          </button>

          <button
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
              <button onClick={desconectar}>
                Sim, desconectar
              </button>

              <button onClick={() => setMostrarConfirmacao(false)}>
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

      <p>• Publique apenas necessidades reais da sua instituição.</p>

      <p>
        • Mantenha os pedidos atualizados conforme forem recebendo doações.
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

export default ONGProfile;