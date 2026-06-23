import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/login.css";
import loginImage from "../assets/login-image.png";
import fundoImage from "../../assets/fundo.png";

function Login() {
  const navigate = useNavigate();

  const [tipoLogin, setTipoLogin] = useState("ong");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const fazerLogin = async () => {
    try {
      const resposta = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          senha: senha,
          tipo: tipoLogin,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.mensagem);
        return;
      }

      if (tipoLogin === "ong") {
        localStorage.setItem("ongId", dados._id);
      } else {
        localStorage.setItem("usuarioId", dados._id);
      }

      if (tipoLogin === "usuario") {
        navigate("/usuario-home");
      } else {
        navigate("/ong-home");
      }

      alert("Login realizado com sucesso");
    } catch (erro) {
      console.log(erro);
      alert("Erro ao fazer login");
    }
  };

  const irParaCadastro = () => {
    if (tipoLogin === "ong") {
      navigate("/register");
    } else {
      navigate("/register-user");
    }
  };

  return (
    <div className="login-page">
      <img src={fundoImage} alt="Fundo" className="bg-full-image" />

      <div className="login-container">
        <div className="login-content">
          <div className="login-left">
            <div className="login-title-row">
              <h1>Login</h1>

              <div className="login-type-card">
                <label>Entrar como</label>

                <select
                  value={tipoLogin}
                  onChange={(evento) => setTipoLogin(evento.target.value)}
                >
                  <option value="ong">ONG</option>
                  <option value="usuario">Usuário</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>E-mail</label>

              <input
                type="email"
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Senha</label>

              <div className="login-password-area">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(evento) => setSenha(evento.target.value)}
                />

                <button
                  type="button"
                  className="login-eye-button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                >
                  {mostrarSenha ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="login-options">
              <div>
                <input type="checkbox" />
                <span>Lembre-se de mim</span>
              </div>

              <a href="#">Esqueceu a senha?</a>
            </div>

            <button type="button" onClick={fazerLogin}>
              Entrar
            </button>

            <p className="register-text">
              Ainda não tem uma conta?
              <button
                type="button"
                className="create-account-link"
                onClick={irParaCadastro}
              >
                Crie uma
              </button>
            </p>
          </div>

          <div className="login-right">
            <img src={loginImage} alt="Ilustração de login" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
