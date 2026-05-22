import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import "../styles/registerUser.css";
import loginImage from "../assets/login-image.png";

function RegisterUser() {
  const navigate = useNavigate();
  const imagemInputRef = useRef(null);

  const [usuario, setUsuario] = useState({
    nome: "",
    email: "",
    localizacao: "",
    senha: "",
    imagem: "",
    sobre: "",
  });

  const mudarCampo = (evento) => {
    const { name, value } = evento.target;

    setUsuario({
      ...usuario,
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
      setUsuario({
        ...usuario,
        imagem: leitor.result,
      });
    };

    leitor.readAsDataURL(arquivo);
  };

  const removerImagem = () => {
    setUsuario({
      ...usuario,
      imagem: "",
    });

    if (imagemInputRef.current) {
      imagemInputRef.current.value = "";
    }
  };

  const cadastrarUsuario = (evento) => {
    evento.preventDefault();

    const novoUsuario = {
      nome: usuario.nome.trim(),
      email: usuario.email.trim().toLowerCase(),
      localizacao: usuario.localizacao.trim(),
      senha: usuario.senha,
      imagem: usuario.imagem,
      sobre: usuario.sobre.trim(),
    };

    const usuariosSalvos =
      JSON.parse(localStorage.getItem("usuariosCadastrados")) || [];

    const emailJaExiste = usuariosSalvos.some(
      (usuarioSalvo) => usuarioSalvo.email === novoUsuario.email
    );

    if (emailJaExiste) {
      alert("Já existe um usuário cadastrado com esse e-mail.");
      return;
    }

    const listaAtualizada = [...usuariosSalvos, novoUsuario];

    localStorage.setItem(
      "usuariosCadastrados",
      JSON.stringify(listaAtualizada)
    );

    localStorage.setItem("usuarioLogado", JSON.stringify(novoUsuario));
    localStorage.removeItem("ongLogada");

    alert("Usuário cadastrado com sucesso!");

    navigate("/usuario-home");
  };

  return (
    <div className="user-register-page">
      <div className="user-shape-orange user-top-left-orange"></div>
      <div className="user-shape-blue user-top-right-blue"></div>
      <div className="user-shape-blue user-bottom-left-blue"></div>
      <div className="user-shape-orange user-bottom-right-orange"></div>

      <div className="user-register-container">
        <div className="user-register-content">
          <form className="user-register-left" onSubmit={cadastrarUsuario}>
            <h1>Cadastrar Usuário</h1>

            <div className="user-input-group">
              <label>Nome</label>
              <input
                type="text"
                name="nome"
                value={usuario.nome}
                onChange={mudarCampo}
                required
              />
            </div>

            <div className="user-input-group">
              <label>E-mail</label>
              <input
                type="email"
                name="email"
                value={usuario.email}
                onChange={mudarCampo}
                required
              />
            </div>

            <div className="user-input-group">
              <label>Localização</label>
              <input
                type="text"
                name="localizacao"
                value={usuario.localizacao}
                onChange={mudarCampo}
                required
              />
            </div>

            <div className="user-input-group">
              <label>Senha</label>
              <input
                type="password"
                name="senha"
                value={usuario.senha}
                onChange={mudarCampo}
                required
              />
            </div>

            <div className="user-input-group">
              <label>Imagem de perfil</label>
              <input
                type="file"
                accept="image/*"
                onChange={carregarImagem}
                ref={imagemInputRef}
              />
            </div>

            {usuario.imagem && (
              <div className="user-image-area">
                <img
                  className="user-image-preview"
                  src={usuario.imagem}
                  alt="Prévia do usuário"
                />

                <button
                  type="button"
                  className="user-remove-image-button"
                  onClick={removerImagem}
                >
                  Remover imagem
                </button>
              </div>
            )}

            <div className="user-input-group">
              <label>Sobre você</label>
              <textarea
                name="sobre"
                value={usuario.sobre}
                onChange={mudarCampo}
                placeholder="Escreva um pouco sobre você..."
              ></textarea>
            </div>

            <button type="submit">Criar usuário</button>

            <p className="user-login-link">
              Já tem uma conta? <Link to="/">Entrar</Link>
            </p>
          </form>

          <div className="user-register-right">
            <img src={loginImage} alt="Ilustração de cadastro" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterUser;