import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import "../styles/registerONG.css";
import loginImage from "../assets/login-image.png";
import fundoImage from "../../assets/fundo.png";

function RegisterUser() {
  const navigate = useNavigate();
  const imagemInputRef = useRef(null);

  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [usuario, setUsuario] = useState({
    nome: "",
    email: "",
    localizacao: "",
    senha: "",
    imagem: "",
    sobre: "",
    tipo: "usuario",
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

  //cadastrar ususario

  const cadastrarUsuario = async (evento) => {
    evento.preventDefault();

    const novoUsuario = {
      nome: usuario.nome.trim(),
      email: usuario.email.trim().toLowerCase(),
      localizacao: usuario.localizacao.trim(),
      senha: usuario.senha,
      imagem: usuario.imagem,
      sobre: usuario.sobre.trim(),
      tipo: "usuario",
    };

    try {
      const resposta = await fetch("http://localhost:3001/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoUsuario),
      });

      const usuarioCriado = await resposta.json();

      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioCriado));
      localStorage.setItem("usuarioId", usuarioCriado._id);

      alert("Usuário cadastrado com sucesso");
      navigate("/usuario-home");
    } catch (erro) {
      console.log(erro);
      alert("Erro ao cadastrar usuário");
    }
  };

  return (
    <div className="register-page">
      <img src={fundoImage} alt="Fundo" className="bg-full-image" />

      <div className="register-container">
        <div className="register-top">
          <label>Entrar como</label>

          <select
            value="usuario"
            onChange={(evento) =>
              evento.target.value === "ong" && navigate("/register")
            }
          >
            <option value="ong">ONG</option>
            <option value="usuario">Usuário</option>
          </select>
        </div>

        <div className="register-content">
          <form className="register-left" onSubmit={cadastrarUsuario}>
            <h1>Cadastrar Usuário</h1>

            <div className="input-group-register">
              <label>Nome</label>
              <input
                type="text"
                name="nome"
                value={usuario.nome}
                onChange={mudarCampo}
                required
              />
            </div>

            <div className="input-group-register">
              <label>E-mail</label>
              <input
                type="email"
                name="email"
                value={usuario.email}
                onChange={mudarCampo}
                required
              />
            </div>

            <div className="input-group-register">
              <label>Localização</label>
              <input
                type="text"
                name="localizacao"
                value={usuario.localizacao}
                onChange={mudarCampo}
                placeholder="Ex: Quixadá - CE"
                required
              />
            </div>

            <div className="input-group-register">
              <label>Senha</label>

              <div className="password-input-area">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  name="senha"
                  value={usuario.senha}
                  onChange={mudarCampo}
                  required
                />

                <button
                  type="button"
                  className="password-eye-button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                >
                  {mostrarSenha ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="input-group-register">
              <label>Imagem do usuário</label>
              <input
                type="file"
                accept="image/*"
                onChange={carregarImagem}
                ref={imagemInputRef}
                className="file-input"
              />
            </div>

            {usuario.imagem && (
              <div className="register-image-area">
                <img
                  className="register-image-preview"
                  src={usuario.imagem}
                  alt="Prévia do usuário"
                />

                <button
                  type="button"
                  className="remove-image-button"
                  onClick={removerImagem}
                >
                  Remover imagem
                </button>
              </div>
            )}

            <div className="input-group-register">
              <label>Sobre você</label>
              <textarea
                name="sobre"
                value={usuario.sobre}
                onChange={mudarCampo}
                placeholder="Escreva um pequeno texto sobre você..."
                required
              ></textarea>
            </div>

            <button type="submit" className="btn-criar-ong">
              Criar conta
            </button>

            <p className="login-link">
              Já tem uma conta? <Link to="/">Entrar</Link>
            </p>
          </form>

          <div className="register-right">
            <img src={loginImage} alt="Ilustração de cadastro" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterUser;
