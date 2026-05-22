import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/login.css";
import loginImage from "../assets/login-image.png";

function Login() {
  const navigate = useNavigate();

  const [tipoLogin, setTipoLogin] = useState("ong");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const fazerLogin = () => {
    if (tipoLogin === "ong") {
      const ongsSalvas =
        JSON.parse(localStorage.getItem("ongsCadastradas")) || [];

      const ongEncontrada = ongsSalvas.find(
        (ong) =>
          ong.email === email.trim().toLowerCase() &&
          ong.senha === senha
      );

      if (ongEncontrada) {
        localStorage.setItem("ongLogada", JSON.stringify(ongEncontrada));
        localStorage.removeItem("usuarioLogado");

        alert("Login de ONG realizado com sucesso!");
        navigate("/home");
      } else {
        alert("E-mail ou senha de ONG incorretos.");
      }

      return;
    }

    if (tipoLogin === "usuario") {
      const usuariosSalvos =
        JSON.parse(localStorage.getItem("usuariosCadastrados")) || [];

      const usuarioEncontrado = usuariosSalvos.find(
        (usuario) =>
          usuario.email === email.trim().toLowerCase() &&
          usuario.senha === senha
      );

      if (usuarioEncontrado) {
        localStorage.setItem(
          "usuarioLogado",
          JSON.stringify(usuarioEncontrado)
        );
        localStorage.removeItem("ongLogada");

        alert("Login de usuário realizado com sucesso!");
        navigate("/usuario-home");
      } else {
        alert("E-mail ou senha de usuário incorretos.");
      }
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
      <div className="background-shape top-left"></div>
      <div className="background-shape bottom-right"></div>

      <div className="login-container">
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

        <div className="login-content">
          <div className="login-left">
            <h1>Login</h1>

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
              <input
                type="password"
                value={senha}
                onChange={(evento) => setSenha(evento.target.value)}
              />
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