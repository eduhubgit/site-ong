import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileMenu from "../components/ProfileMenu";
import "../styles/ongHome.css";

function ONGProfile() {
  const navigate = useNavigate();

  const ongLogada = JSON.parse(localStorage.getItem("ongLogada"));

  const [mostrarNormas, setMostrarNormas] = useState(false);
  const [mostrarSuporte, setMostrarSuporte] = useState(false);
  const [editando, setEditando] = useState(false);

  const [perfil, setPerfil] = useState(
    ongLogada
      ? {
          ...ongLogada,
          cidade: ongLogada.cidade || ongLogada.localizacao || "",
          endereco: ongLogada.endereco || "",
          nichoPrincipal: ongLogada.nichoPrincipal || ongLogada.nicho || "",
          chavePix: ongLogada.chavePix || "",
          diasFuncionamento: ongLogada.diasFuncionamento || "",
          horarioFuncionamento: ongLogada.horarioFuncionamento || "",
          sobre: ongLogada.sobre || "",
          imagem: ongLogada.imagem || "",
        }
      : {
          nome: "",
          cnpj: "",
          email: "",
          cidade: "",
          endereco: "",
          nichoPrincipal: "",
          chavePix: "",
          diasFuncionamento: "",
          horarioFuncionamento: "",
          senha: "",
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

  const mudarCNPJ = (evento) => {
    const apenasNumeros = evento.target.value.replace(/\D/g, "").slice(0, 14);

    setPerfil({
      ...perfil,
      cnpj: apenasNumeros,
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
    setPerfil({
      ...ongLogada,
      cidade: ongLogada.cidade || ongLogada.localizacao || "",
      endereco: ongLogada.endereco || "",
      nichoPrincipal: ongLogada.nichoPrincipal || ongLogada.nicho || "",
      chavePix: ongLogada.chavePix || "",
      diasFuncionamento: ongLogada.diasFuncionamento || "",
      horarioFuncionamento: ongLogada.horarioFuncionamento || "",
      sobre: ongLogada.sobre || "",
      imagem: ongLogada.imagem || "",
    });

    setEditando(false);
  };

  const salvarAlteracoes = () => {
    try {
      const nome = perfil.nome.trim();
      const cnpj = perfil.cnpj.trim();
      const cidade = perfil.cidade.trim();
      const endereco = perfil.endereco.trim();
      const nichoPrincipal = perfil.nichoPrincipal.trim();
      const chavePix = perfil.chavePix.trim();
      const diasFuncionamento = perfil.diasFuncionamento.trim();
      const horarioFuncionamento = perfil.horarioFuncionamento.trim();
      const sobre = perfil.sobre.trim();

      if (cnpj.length !== 14) {
        alert("O CNPJ precisa ter exatamente 14 números.");
        return;
      }

      if (
        nome === "" ||
        cidade === "" ||
        endereco === "" ||
        nichoPrincipal === "" ||
        chavePix === "" ||
        diasFuncionamento === "" ||
        horarioFuncionamento === "" ||
        sobre === ""
      ) {
        alert("Preencha todos os campos obrigatórios antes de salvar.");
        return;
      }

      const ongsSalvas =
        JSON.parse(localStorage.getItem("ongsCadastradas")) || [];

      const perfilAtualizado = {
        ...perfil,

        nome,
        cnpj,
        cidade,
        endereco,
        nichoPrincipal,
        chavePix,
        diasFuncionamento,
        horarioFuncionamento,
        sobre,

        localizacao: cidade,
        nicho: nichoPrincipal,

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

      const necessidadesSalvas =
        JSON.parse(localStorage.getItem("necessidadesPublicadas")) || [];

      const necessidadesAtualizadas = necessidadesSalvas.map((publicacao) => {
        if (publicacao.ong.email === ongLogada.email) {
          return {
            ...publicacao,
            ong: {
              ...publicacao.ong,
              nome: perfilAtualizado.nome,
              cnpj: perfilAtualizado.cnpj,
              cidade: perfilAtualizado.cidade,
              localizacao: perfilAtualizado.cidade,
              endereco: perfilAtualizado.endereco,
              nichoPrincipal: perfilAtualizado.nichoPrincipal,
              nicho: perfilAtualizado.nichoPrincipal,
              chavePix: perfilAtualizado.chavePix,
              diasFuncionamento: perfilAtualizado.diasFuncionamento,
              horarioFuncionamento: perfilAtualizado.horarioFuncionamento,
              imagem: perfilAtualizado.imagem,
              sobre: perfilAtualizado.sobre,
            },
          };
        }

        return publicacao;
      });

      localStorage.setItem(
        "necessidadesPublicadas",
        JSON.stringify(necessidadesAtualizadas)
      );

      alert("Perfil atualizado com sucesso!");
      setEditando(false);
    } catch (erro) {
      console.error(erro);
      alert("Não foi possível salvar. Tente usar uma imagem menor.");
    }
  };

  const inicialPerfil = perfil.nome
    ? perfil.nome.charAt(0).toUpperCase()
    : "O";

  return (
    <div className="profile-page">
      <nav className="ong-navbar">
        <div className="ong-logo">+COM</div>

        <div className="ong-nav-links">
          <button type="button" onClick={() => navigate("/home")}>
            Início
          </button>

          <button type="button" onClick={() => setMostrarNormas(true)}>
            Normas do site
          </button>

          <button type="button" onClick={() => setMostrarSuporte(true)}>
            Suporte
          </button>
        </div>

        <ProfileMenu tipo="ong" pessoa={perfil} />
      </nav>

      <div className="profile-container">
        <button
          type="button"
          className="profile-close"
          onClick={() => navigate("/home")}
        >
          ×
        </button>

        <div className="profile-header">
          <div className="profile-image-area">
            {perfil.imagem ? (
              <img src={perfil.imagem} alt="Imagem da ONG" />
            ) : (
              <div className="profile-image-placeholder">{inicialPerfil}</div>
            )}

            {editando && (
              <label className="profile-image-button">
                Alterar imagem
                <input
                  type="file"
                  accept="image/*"
                  onChange={carregarImagem}
                />
              </label>
            )}
          </div>

          <div className="profile-title-area">
            <h1>{perfil.nome}</h1>

            <textarea
              name="sobre"
              value={perfil.sobre}
              onChange={mudarCampo}
              placeholder="Escreva aqui uma descrição sobre sua ONG..."
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
            <label>CNPJ</label>
            <input
              type="text"
              name="cnpj"
              value={perfil.cnpj}
              onChange={mudarCNPJ}
              maxLength="14"
              readOnly={!editando}
            />
          </div>

          <div className="profile-input-group">
            <label>Cidade</label>
            <input
              type="text"
              name="cidade"
              value={perfil.cidade}
              onChange={mudarCampo}
              readOnly={!editando}
            />
          </div>

          <div className="profile-input-group">
            <label>Endereço</label>
            <input
              type="text"
              name="endereco"
              value={perfil.endereco}
              onChange={mudarCampo}
              readOnly={!editando}
            />
          </div>

          <div className="profile-input-group">
            <label>Nicho principal</label>
            <input
              type="text"
              name="nichoPrincipal"
              value={perfil.nichoPrincipal}
              onChange={mudarCampo}
              readOnly={!editando}
            />
          </div>

          <div className="profile-input-group">
            <label>Chave Pix</label>
            <input
              type="text"
              name="chavePix"
              value={perfil.chavePix}
              onChange={mudarCampo}
              readOnly={!editando}
            />
          </div>

          <div className="profile-input-group">
            <label>Dias de funcionamento</label>
            <input
              type="text"
              name="diasFuncionamento"
              value={perfil.diasFuncionamento}
              onChange={mudarCampo}
              placeholder="Ex: Segunda a sexta"
              readOnly={!editando}
            />
          </div>

          <div className="profile-input-group">
            <label>Horário de funcionamento</label>
            <input
              type="text"
              name="horarioFuncionamento"
              value={perfil.horarioFuncionamento}
              onChange={mudarCampo}
              placeholder="Ex: 08:00 às 17:00"
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
            <h2>Normas do site</h2>

            <p>• Publique apenas necessidades reais da sua instituição.</p>

            <p>
              • Mantenha os pedidos atualizados conforme forem recebendo
              doações.
            </p>

            <p>• Não utilize informações falsas ou enganosas.</p>

            <p>• Remova pedidos que já foram atendidos.</p>

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

export default ONGProfile;