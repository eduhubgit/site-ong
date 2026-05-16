import { Link, useNavigate } from "react-router-dom";
import { useState , useRef } from "react";
import "../styles/registerONG.css";
import loginImage from "../assets/login-image.png";

function RegisterONG() {
  const navigate = useNavigate();

  const imagemInputRef = useRef(null);

  const [ong, setOng] = useState({
    nome: "",
    cnpj: "",
    email: "",
    localizacao: "",
    nicho: "",
    senha: "",
    imagem: "",
    sobre: "",
  });

  const mudarCampo = (evento) => {
    const { name, value } = evento.target;

    setOng({
      ...ong,
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
    setOng({
      ...ong,
      imagem: leitor.result,
    });
  };

  leitor.readAsDataURL(arquivo);
};

const removerImagem = () => {
  setOng({
    ...ong,
    imagem: "",
  });

  if (imagemInputRef.current) {
    imagemInputRef.current.value = "";
  }
};

  const cadastrarONG = (evento) => {
    evento.preventDefault();

    const novaONG = {
      nome: ong.nome.trim(),
      cnpj: ong.cnpj.trim(),
      email: ong.email.trim().toLowerCase(),
      localizacao: ong.localizacao.trim(),
      nicho: ong.nicho.trim(),
      senha: ong.senha,
      imagem: ong.imagem,
      sobre: ong.sobre.trim(),
    };

    const ongsSalvas =
      JSON.parse(localStorage.getItem("ongsCadastradas")) || [];

    const emailJaExiste = ongsSalvas.some(
      (ongSalva) => ongSalva.email === novaONG.email
    );

    if (emailJaExiste) {
      alert("Já existe uma ONG cadastrada com esse e-mail.");
      return;
    }

    const listaAtualizada = [...ongsSalvas, novaONG];

    localStorage.setItem("ongsCadastradas", JSON.stringify(listaAtualizada));
    localStorage.setItem("ongLogada", JSON.stringify(novaONG));

    alert("ONG cadastrada com sucesso!");

    navigate("/home");
  };

  return (
    <div className="register-page">
      <div className="shape-orange top-left-orange"></div>
      <div className="shape-blue top-right-blue"></div>
      <div className="shape-blue bottom-left-blue"></div>
      <div className="shape-orange bottom-right-orange"></div>

      <div className="register-container">
        <div className="register-content">
          <form className="register-left" onSubmit={cadastrarONG}>
            <h1>Cadastrar ONG</h1>

            <div className="row-inputs">
              <div className="input-group-register">
                <label>Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={ong.nome}
                  onChange={mudarCampo}
                  required
                />
              </div>

              <div className="input-group-register">
                <label>CNPJ</label>
                <input
                  type="text"
                  name="cnpj"
                  value={ong.cnpj}
                  onChange={mudarCampo}
                  required
                />
              </div>
            </div>

            <div className="input-group-register">
              <label>E-mail</label>
              <input
                type="email"
                name="email"
                value={ong.email}
                onChange={mudarCampo}
                required
              />
            </div>

            <div className="input-group-register">
              <label>Localização</label>
              <input
                type="text"
                name="localizacao"
                value={ong.localizacao}
                onChange={mudarCampo}
                required
              />
            </div>

            <div className="input-group-register">
              <label>Nicho</label>
              <input
                type="text"
                name="nicho"
                value={ong.nicho}
                onChange={mudarCampo}
                required
              />
            </div>

            <div className="input-group-register">
              <label>Senha</label>
              <input
                type="password"
                name="senha"
                value={ong.senha}
                onChange={mudarCampo}
                required
              />
            </div>

            <div className="input-group-register">
              <label>Imagem da ONG</label>
              <input
                type="file"
                accept="image/*"
                onChange={carregarImagem}
                ref={imagemInputRef}
              />
            </div>

            {ong.imagem && (
              <div className="register-image-area">
              <img
                className="register-image-preview"
                src={ong.imagem}
                alt="Prévia da ONG"
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
              <label>Sobre a ONG</label>
              <textarea
                name="sobre"
                value={ong.sobre}
                onChange={mudarCampo}
                placeholder="Escreva um pequeno texto sobre a ONG..."
              ></textarea>
            </div>

            <button type="submit">Criar ONG</button>

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

export default RegisterONG;