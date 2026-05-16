import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/login.css";
import loginImage from "../assets/login-image.png";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const fazerLogin = () => {
    const ongsSalvas = JSON.parse(localStorage.getItem("ongsCadastradas")) || [];

    const ongEncontrada = ongsSalvas.find(
      (ong) =>
        ong.email === email.trim().toLowerCase() &&
        ong.senha === senha
    );

    if (ongEncontrada) {
      localStorage.setItem("ongLogada", JSON.stringify(ongEncontrada));

      alert("Login realizado com sucesso!");

      navigate("/home");
    } else {
      alert("E-mail ou senha incorretos.");
    }
  };

  return (
    <div className="login-page">
      <div className="background-shape top-left"></div>
      <div className="background-shape bottom-right"></div>

      <div className="login-container">
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

            <button onClick={fazerLogin}>Entrar</button>

            <p className="register-text">
              Ainda não tem uma conta?
              <Link to="/register"> Crie uma</Link>
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